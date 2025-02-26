import type { LayoutServerLoad } from './$types';

// TODO block unauthenticated users
export const load: LayoutServerLoad = async ({locals, url}) => {
    // const user = locals.user;
    
    // // If not authenticated, redirect to login page
    // if (!user) {
    //     // Save the original URL so we can redirect back after login
    //     throw redirect(303, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
    // }
    
    // // User is authenticated, return user data to make it available in layouts/pages
    // return {
    //     user
    // };
};
