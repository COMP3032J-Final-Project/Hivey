import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { FileType, TreeNode } from "$lib/types/editor";

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


export function buildFileTree(files: FileType[]): TreeNode[] {
    const fileMap = new Map<string, TreeNode>();
    files.forEach(file => {
        fileMap.set(file.id, {
            ...file,
            filetype: file.filetype as 'file' | 'folder',
            children: file.filetype === 'folder' ? [] : null,
            project_id: file.project_id,
        });
    });

    // Create a root object to hold top-level items
    interface TreeLevel { children: TreeNode[] }
    const root: TreeLevel = { children: [] };
    
    // Helper function to get or create path segments
    const getPathParts = (path: string): string[] => path ? path.split('/') : [];
    
    // First, add all folders to the tree structure
    fileMap.forEach((file) => {
        if (file.filetype === 'folder') {
            const pathParts = getPathParts(file.filepath);
            let currentLevel: TreeLevel = root;
            
            // Traverse or create the folder structure
            for (const part of pathParts) {
                let found = currentLevel.children.find(
                    child => child.filename === part && child.filetype === 'folder'
                );
                
                if (!found) {
                    // Only create placeholder if no real folder exists
                    found = {
                        id: `placeholder-${part}`,
                        filename: part,
                        filepath: pathParts.slice(0, pathParts.indexOf(part)).join('/'),
                        filetype: 'folder' as const,
                        children: [],
                        project_id: file.project_id,
                    };
                    currentLevel.children.push(found);
                }
                currentLevel = found as TreeLevel;
            }
            
            // Check if folder already exists at this level
            const existingFolder = currentLevel.children.find(
                child => child.id === file.id
            );
            if (!existingFolder) {
                currentLevel.children.push(file);
            }
        }
    });
    
    // Then, add all files to the tree structure
    fileMap.forEach((file) => {
        if (file.filetype === 'file') {
            const pathParts = getPathParts(file.filepath);
            let currentLevel: TreeLevel = root;
            
            // Traverse the folder structure
            for (const part of pathParts) {
                const found = currentLevel.children.find(
                    child => child.filename === part && child.filetype === 'folder'
                );
                
                if (!found) {
                    // Shouldn't happen as folders were added first
                    const placeholder = {
                        id: `placeholder-${part}`,
                        project_id: file.project_id,
                        filename: part,
                        filepath: pathParts.slice(0, pathParts.indexOf(part)).join('/'),
                        filetype: 'folder' as const,
                        children: []
                    };
                    currentLevel.children.push(placeholder);
                    currentLevel = placeholder;
                } else {
                    currentLevel = found as TreeLevel;
                }
            }
            
            // Add the file to the appropriate level
            currentLevel.children.push({
                ...file,
                filetype: 'file' as const,
                children: null
            });
        }
    });
    
    // Clean up placeholder folders by replacing them with real folders when found
    function replacePlaceholders(node: TreeNode): void {
        if (!node.children) return;
        
        for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            if (child.id.startsWith('placeholder-')) {
                // Look for a real folder with the same name
                const realFolder = node.children.find(
                    (c): c is TreeNode & { children: TreeNode[] } => 
                        !c.id.startsWith('placeholder-') && 
                        c.filename === child.filename && 
                        c.filetype === 'folder'
                );
                
                if (realFolder) {
                    // Merge children from placeholder to real folder
                    if (child.children) {
                        realFolder.children.push(...child.children);
                    }
                    // Replace placeholder with real folder
                    node.children[i] = realFolder;
                    // Remove the duplicate real folder
                    const realFolderIndex = node.children.indexOf(realFolder);
                    if (realFolderIndex > i) {
                        node.children.splice(realFolderIndex, 1);
                    }
                }
            }
            
            // Recursively process children
            if (node.children[i].children) {
                replacePlaceholders(node.children[i]);
            }
        }
    }
    
    root.children.forEach(replacePlaceholders);
    
    // Update filepaths to include 'root' prefix
    function updatePaths(node: TreeNode, currentPath: string = ''): void {
        node.filepath = currentPath;
        if (node.children) {
            node.children.forEach(child => {
                updatePaths(child, `${currentPath}/${child.filename}`);
            });
        }
    }
    
    root.children.forEach(child => updatePaths(child));
    
    return root.children;
}

export function getFolders(fileData: FileType[]) {
    // 筛选出文件夹类型的数据
    const folders = fileData.filter(item => item.filetype === 'folder');
    
    // 创建结果数组
    const result: { value: string; label: string }[] = [];

    result.push({
        value: "root",
        label: "root"
    });
    
    // 处理每个文件夹
    folders.forEach(folder => {
        const fullPath = folder.filepath ? `${folder.filepath}/${folder.filename}` : folder.filename;
        result.push({
            value: fullPath,
            label: folder.filename
        });
    });
    
    return result;
}