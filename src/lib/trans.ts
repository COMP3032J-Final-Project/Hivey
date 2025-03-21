import * as m from '$lib/paraglide/messages';

/**
 * Example
 * 
 * ```typescript
 * // Create namespace objects
 * const e = createMessageNamespace(m, 'e');
 * const api = createMessageNamespace(m, 'api');
 * // Usage
 * e.unknown(); // Calls m['e.unknown']()
 * e.network_error(); // Calls m['e.network_error']()
 * api.fetch_data(123); // Calls m['api.fetch_data'](123)
 * ```
 */
export function createMessageNamespace<T extends Record<string, any>>(obj: T, prefix: string) {
    return new Proxy({} as any, {
        get: (_, suffix) => {
            const key = `${prefix}.${String(suffix)}`;
            if (typeof obj[key] === 'function') {
                return (...args: any[]) => obj[key](...args);
            }
            throw new Error(`Method ${key} not found`);
        }
    });
}

// global 
export { m };
// global error
export const me = createMessageNamespace(m, "__error");
// page starts with 'mp'
export const mpm = createMessageNamespace(m, "_marketing");
export const mpml = createMessageNamespace(m, "_marketing._landing");
export const mpmf = createMessageNamespace(m, "_marketing._features");
export const mpmc = createMessageNamespace(m, "_marketing._contact");
export const mpma = createMessageNamespace(m, "_marketing._about_us");
export const mpmt = createMessageNamespace(m, "_marketing._terms");
export const mpa = createMessageNamespace(m, "_auth");
export const mpae = createMessageNamespace(m, "_auth.__error");
export const mpd = createMessageNamespace(m, "_dashboard");
export const mpp = createMessageNamespace(m, "_project");
