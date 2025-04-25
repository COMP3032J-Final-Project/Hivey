import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { File as EditorFile, FileCategory, TreeNode } from "$lib/types/editor";
import { FileType } from '$lib/types/editor';

/**
 * Combines multiple class values into a single string, handling Tailwind CSS conflicts.
 * 
 * This utility function takes any number of class values (strings, objects, arrays)
 * and merges them together. It uses `clsx` to conditionally join classNames and
 * `tailwind-merge` to properly handle Tailwind CSS class conflicts by removing duplicates
 * with the latter values taking precedence.
 * 
 * @param inputs - Any number of class values (strings, objects, or arrays) to be merged
 * @returns A single merged className string with resolved Tailwind conflicts
 * 
 * @example
 * // Basic usage
 * cn('text-red-500', 'bg-blue-500')
 * // => 'text-red-500 bg-blue-500'
 * 
 * @example
 * // With conditional classes
 * cn('btn', isActive && 'btn-active')
 * // => 'btn btn-active' if isActive is true
 * // => 'btn' if isActive is false
 * 
 * @example
 * // Resolving Tailwind conflicts (later classes win)
 * cn('text-red-500', 'text-blue-500')
 * // => 'text-blue-500'
 * 
 * @example
 * // With component props pattern
 * cn('default-classes', className)
 * // => Merges default classes with user-provided className
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Reference: https://github.com/martinstark/throttle-ts
 * 
 * Creates a throttled function that limits how often the original function can be called.
 * @param fn The function to throttle
 * @param delay The minimum time (ms) between allowed function calls
 * @returns [throttledFn, cancelFn, resetFn]
 */
export const throttle = <R, A extends any[]>(
    fn: (...args: A) => R,
    delay: number
): [(...args: A) => R | undefined, () => void, () => void] => {
    let isWaiting = false;
    let timeoutId: number | undefined;
    let isCancelled = false;
    
    const resetWaitingState = () => {
        isWaiting = false;
    };
    
    const throttledFn = (...args: A): R | undefined => {
        if (isCancelled || isWaiting) return undefined;
        
        const result = fn(...args);
        
        isWaiting = true;
        timeoutId = window.setTimeout(resetWaitingState, delay);
        
        return result;
    };
    
    const cancelFn = () => {
        isCancelled = true;
        clearTimeout(timeoutId);
    };
    
    const resetFn = () => {
        clearTimeout(timeoutId);
        resetWaitingState();
    };
    
    return [throttledFn, cancelFn, resetFn];
};


export function titleCase(str: string) {
    return str.replace(
        /\w\S*/g,
        function(txt: string) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export function buildFileTree(files: EditorFile[], tempFolders: TreeNode[]): TreeNode[] {
  interface TreeLevel {
    children: TreeNode[];
  }

  const root: TreeLevel = { children: [] };

  const allNodes: TreeNode[] = [
    ...files.map(file => ({
      ...file,
      filetype: 'file' as const,
      children: null,
    })),
    ...tempFolders,
  ];

  const getPathParts = (path: string): string[] =>
    path ? path.split('/').filter(part => part !== '') : [];

  allNodes.forEach(node => {
    const pathParts = getPathParts(node.filepath);
    // 如果filepath为空或路径部分为空则直接将节点添加到根目录
    if (pathParts.length === 0) {
      if (!root.children.find(child => child.filename === node.filename)) { // 检查根目录是否已经有同名节点
        root.children.push(node);
      }
      return; // 继续处理下一个节点
    }
    
    let currentLevel: TreeLevel = root;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];

      // 中间路径部分或文件夹，确保目录存在
      let found = currentLevel.children.find(
        child => child.filename === part && child.filetype === 'folder'
      );

      if (!found) {
        found = {
          id: `folder-${pathParts.slice(0, i + 1).join('/')}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          project_id: node.project_id,
          filename: part,
          filepath: `/${pathParts.slice(0, i + 1).join('/')}`,
          filetype: 'folder',
          children: [],
        };
        currentLevel.children.push(found);
      }

      currentLevel = found as TreeLevel;
    };

		const existingNode = currentLevel.children.find(
			child => child.filename === node.filename && child.filetype === node.filetype
		);
		if (!existingNode) {
			currentLevel.children.push(node);
		}
  });

  return root.children;
}



export function getFolders(files: EditorFile[], tempFolders: TreeNode[]){
	console.log('[utils] getFolders', files, tempFolders);
	const folderInfoMap = new Map<string, { value: string, label: string }>();
	folderInfoMap.set('/', { value: 'root', label: 'root' });

	const allSources = [...(files ?? []), ...(tempFolders ?? [])];

	allSources.forEach(item => {
		// 如果是文件夹，直接加进去
		if (item.filetype === 'folder') {
			if (!folderInfoMap.has(item.filepath + '/' + item.filename)) {
				folderInfoMap.set(item.filepath + '/' + item.filename, { value: item.filepath + '/' + item.filename, label: item.filename });
			}
		}

		// 无论是文件还是文件夹，都要处理其 filepath 作为“父路径”
		const pathParts = item.filepath?.split('/').filter(Boolean) ?? [];

		let currentPath = '';
		for (let i = 0; i < pathParts.length; i++) {
			const part = pathParts[i];
			currentPath += `/${part}`;

			// 避免把文件的 filepath 也当成文件夹加入（前面已经加了 folder 的 filepath）
			if (!folderInfoMap.has(currentPath)) {
				folderInfoMap.set(currentPath, {
					value: currentPath,
					label: part,
				});
			}
		}
	});

	return Array.from(folderInfoMap.values());
}






/**
 * Checks if the beginning of a file is likely binary content.
 * Reads a chunk of the file and looks for null bytes.
 *
 * @param file The File object to check.
 * @param chunkSize The number of bytes to read from the beginning of the file (default: 4096).
 * @returns Promise<boolean> True if the file chunk suggests binary content, false otherwise.
 */
export async function isLikelyBinary(file: File, chunkSize = 4096): Promise<boolean> {
    if (file.size === 0) return false;
    

    // Read the first chunk (or the whole file if smaller than chunkSize)
    const buffer = await file.slice(0, chunkSize).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Check for Null Bytes
    for (let i = 0; i < bytes.length; i++) {
        if (bytes[i] === 0) {
            console.debug(`File ${file.name} detected as likely binary due to null byte at position ${i}`);
            return true; // Found a null byte, strong indicator of binary
        }
    }

    return false;
}


export function getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1 || lastDotIndex === filename.length) return ''; // No extension
    return filename.substring(lastDotIndex).toLowerCase();
}


export async function getFileType(
    filename: string,
    file: File | undefined = undefined
): Promise<FileType> {
    const fileExtension = getFileExtension(filename);
    switch (fileExtension) {
        case '.md':
        case '.markdown':
            return FileType.MARKDOWN;
        case '.typ':
        case '.typst':
            return FileType.TYPST;
        case '.tex':
        case '.latex':
            return FileType.LATEX;
        case '.bib':
            return FileType.BIB;
        case '.png':
            return FileType.PNG;
        case '.jpg':
        case '.jpeg':
            return FileType.JPG;
        case '.webp':
            return FileType.WEBP;
        case '.pdf':
            return FileType.PDF;
        case '.txt':
            return FileType.PLAIN_TEXT;
        default:
            if (file && await isLikelyBinary(file)) 
                return FileType.GENERIC_BINARY;
            else 
                return FileType.PLAIN_TEXT;
    }
}


export function getFileCategory(fileType: FileType): FileCategory {
	  switch (fileType) {
		    case FileType.PNG:
		    case FileType.JPG:
		    case FileType.WEBP:
			      return 'Image';
    
		    case FileType.MARKDOWN:
		    case FileType.TYPST:
		    case FileType.LATEX:
		    case FileType.BIB:
		    case FileType.PLAIN_TEXT:
			      return 'PlainText';
    
		    case FileType.PDF:
		    case FileType.GENERIC_BINARY:
			      return 'Binary';
    
		    default:
			      // This line helps ensure you handle all FileType members.
			      // If you add a new FileType member and forget a case, TypeScript will error here.
			      const _exhaustiveCheck: never = fileType;
			      return 'Binary';
	  }
}


