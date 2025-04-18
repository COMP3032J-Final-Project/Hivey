import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { File, TreeNode } from "$lib/types/editor";

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


export function buildFileTree(files: File[], tempFolders: TreeNode[]): TreeNode[] {
  interface TreeLevel {
    children: TreeNode[];
  }

  const root: TreeLevel = { children: [] };

  // 合并文件和临时文件夹一起处理
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
      
      if (!root.children.find(child => child.id === node.id)) { // 检查根目录是否已经有同id的节点
        root.children.push(node);
      }
      return; // 继续处理下一个节点
    }
    
    let currentLevel: TreeLevel = root;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      const isLastPart = i === pathParts.length - 1;

      let found = currentLevel.children.find(
        child => child.filename === part && child.filetype === 'folder'
      );

      if (!found && (!isLastPart || node.filetype === 'file')) {
        // 创建中间路径的文件夹
        found = {
          id: `folder-${pathParts.slice(0, i + 1).join('/')}-${i}`,
          project_id: node.project_id,
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

      // 最后一部分：将当前节点挂上去（如果没重复）
      if (isLastPart && !currentLevel.children.find(child => child.id === node.id)) {
        currentLevel.children.push(node);
      }
    }
  });

  return root.children;
}


export function getFolders(files: File[], tempFolders: TreeNode[]){
	console.log('[utils] getFolders', files, tempFolders);
	const folderInfoMap = new Map<string, { value: string, label: string }>();
	folderInfoMap.set('/', { value: 'root', label: 'root' });

	const allSources = [...(files ?? []), ...(tempFolders ?? [])];

	allSources.forEach(item => {
		// 当前文件夹本身就是一个目录，也应该加入
		if (item.filetype === 'folder') {
			if (!folderInfoMap.has(item.filepath)) {
				folderInfoMap.set(item.filepath, { value: item.filepath, label: item.filename });
			}
		}

		// 继续解析父路径
		const rawPath = item.filepath || '/';
		const pathParts = rawPath.split('/').filter(Boolean);

		let currentPath = '';
		pathParts.forEach((part) => {
			currentPath += `/${part}`;
			if (!folderInfoMap.has(currentPath)) {
				folderInfoMap.set(currentPath, { value: currentPath, label: part });
			}
		});
	});

	return Array.from(folderInfoMap.values());
}
