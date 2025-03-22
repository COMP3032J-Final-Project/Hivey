import { browser } from '$app/environment';
import { UserAuth } from '$lib/types/auth';
import { LOCAL_STORAGE_KEY } from '$lib/constants';

// Expiration buffer in milliseconds (5 minutes)
const EXPIRATION_BUFFER_MS = 5 * 60 * 1000;

/**
 * Save user OAuth information to browser local storage
 * @param userAuth The authentication data to store
 */
export function saveUserSession(userAuth: UserAuth): void {
    if (!browser) return;
  
    if (!userAuth || typeof userAuth.expires_in !== 'number') {
        console.error('Invalid userAuth object or expires_in value');
        return;
    }

    // Calculate expiration timestamp with buffer
    const expiresAt = Date.now() + userAuth.expires_in * 1000 - EXPIRATION_BUFFER_MS;
    
    localStorage.setItem(LOCAL_STORAGE_KEY.AUTH.OBJ, JSON.stringify(userAuth));
    localStorage.setItem(LOCAL_STORAGE_KEY.AUTH.EXPIRES_AT, expiresAt.toString());
}

/**
 * Check if the stored user authentication has expired
 * @returns True if auth is expired or not available
 */
export function isSessionExpired(): boolean {
    if (!browser) return true;

    const expiresAtStr = localStorage.getItem(LOCAL_STORAGE_KEY.AUTH.EXPIRES_AT);
    if (!expiresAtStr) return true;

    const expiresAt = parseInt(expiresAtStr, 10);
    return isNaN(expiresAt) || Date.now() > expiresAt;
}

/**
 * Remove user authentication data from local storage
 */
export function clearUserSession(): void {
    if (!browser) return;
  
    localStorage.removeItem(LOCAL_STORAGE_KEY.AUTH.OBJ);
    localStorage.removeItem(LOCAL_STORAGE_KEY.AUTH.EXPIRES_AT);
}

/**
 * Get User Auth information
 * @returns UserAuth if valid and not expired, null otherwise
 */
export function getUserSession(): UserAuth | null {
    if (!browser || isSessionExpired()) return null;

    try {
        const userAuthString = localStorage.getItem(LOCAL_STORAGE_KEY.AUTH.OBJ);
        if (!userAuthString) return null;

        return JSON.parse(userAuthString) as UserAuth;
    } catch (error) {
        console.error('Failed to retrieve auth data from localStorage:', error);
        clearUserSession(); // Clean up potentially corrupted data
        return null;
    }
}
