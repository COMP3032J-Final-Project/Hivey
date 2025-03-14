import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

