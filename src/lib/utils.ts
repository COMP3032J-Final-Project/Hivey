import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { File, FileTreeFolderNode, FileType } from "$lib/types/file";

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


// Uint8Array to Base64
export function uint8ArrayToBase64(array: Uint8Array): string {
    return btoa(
        Array.from(array)
            .map(byte => String.fromCharCode(byte))
            .join('')
    );
}

// Base64 to Uint8Array
export function base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}


// TODO
export function buildFileTree(files: File[]): TreeNode[] {
    const fileMap = new Map<string, TreeNode>();
    files.forEach(file => {
        fileMap.set(file.id, {
            id: file.id,
            project_id: file.project_id,
            filename: file.filename,
            filepath: file.filepath,
            filetype: 'file',
            children: null,
        });
    });

    interface TreeLevel { children: TreeNode[] }
    const root: TreeLevel = { children: [] };
    
    // 辅助函数获取路径部分
    const getPathParts = (path: string): string[] => path ? path.split('/').filter(part => part !== '') : [];
    
    // 处理所有文件，构建文件夹结构
    fileMap.forEach((file) => {
        const pathParts = getPathParts(file.filepath);
        let currentLevel: TreeLevel = root;
        
        // 遍历路径，创建必要的文件夹结构
        for (let i = 0; i < pathParts.length; i++) {
            const part = pathParts[i];
            const isLastPart = i === pathParts.length - 1;
            
            // 查找是否已存在这个文件夹
            let found = currentLevel.children.find(
                child => child.filename === part && child.filetype === 'folder'
            );
            
            if (!found && !isLastPart) {
                // 创建文件夹节点
                found = {
                    id: `folder-${file.filepath}-${i}`, // 生成唯一ID
                    project_id: file.project_id,
                    filename: part,
                    filepath: pathParts.slice(0, i + 1).join('/'),
                    filetype: 'folder',
                    children: [],
                };
                currentLevel.children.push(found);
            }
            
            if (found) {
                currentLevel = found as TreeLevel;
            }
        }
        
        // 如果是最后一部分且不是文件夹（即文件本身），添加到当前层级
        if (pathParts.length > 0) {
            currentLevel.children.push(file);
        } else {
            // 如果没有路径，直接添加到根
            root.children.push(file);
        }
    });
    
    // 清理可能的空文件夹（如果有需要）
    function cleanEmptyFolders(node: TreeNode): boolean {
        if (node.filetype === 'file') return false;
        
        if (node.children) {
            // 过滤子节点，递归清理
            node.children = node.children.filter(child => {
                if (child.filetype === 'folder') {
                    return cleanEmptyFolders(child);
                }
                return true; // 保留文件
            });
            
            // 如果文件夹为空，且不是根，则删除
            return node.children.length > 0;
        }
        
        return false;
    }
    
    root.children.forEach(child => {
        if (child.filetype === 'folder') {
            cleanEmptyFolders(child);
        }
    });
    
    return root.children;
}

export function getFolders(files: File[]){
    const folderInfoMap = new Map<string, { value: string, label: string }>(); // 用于存储不重复的文件夹路径及其名称
    
    folderInfoMap.set('/', { value: '/', label: 'root' });
    files.forEach(file => {
        const pathParts = file.filepath.split('/'); // 将文件路径按 '/' 拆分成部分
        let currentPath = '';
    
        // 遍历每一部分，逐层构建路径
        pathParts.forEach((part, index) => {
          // 构建路径
          currentPath += `/${part}`;
    
          // 如果该路径尚未添加到 Map 中，则加入 Map
          if (!folderInfoMap.has(currentPath)) {
            folderInfoMap.set(currentPath, { value: currentPath, label: part });
          }
        });
      });
    
    return Array.from(folderInfoMap.values());
}

/**
 * Determines the file type based on the filename's extension.
 *
 * @param filename - The full name of the file (e.g., "document.typ", "image.png").
 * @returns The determined FileType ('typst', 'latex', 'markdown', 'pdf', 'png', 'jpg', 'webp', or 'unknown').
 */
export function getFileType(filename: string): FileType {
	  if (!filename) {
		    return 'unknown';
	  }
	  const lastDotIndex = filename.lastIndexOf('.');
	  // No extension found or filename starts with a dot (like .env) and has no other extension part
	  if (lastDotIndex === -1 || lastDotIndex === 0) {
		    return 'unknown';
	  }
	  const extension = filename.substring(lastDotIndex + 1).toLowerCase();
	  switch (extension) {
		    case 'typ':
			      return 'typst';
		    case 'tex':
			      return 'latex';
		    case 'md':
		    case 'markdown': // Allow both .md and .markdown
			      return 'markdown';
		    case 'pdf':
			      return 'pdf';
		    case 'png':
			      return 'png';
		    case 'jpg':
		    case 'jpeg': // Allow both .jpg and .jpeg
			      return 'jpg';
		    case 'webp':
			      return 'webp';
        case 'bib':
            return 'bib';
		    default:
			      return 'unknown';
	  }
}
