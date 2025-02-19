import { redirect } from '@sveltejs/kit';

export function load() {
    // page redirection here
    // authorized user should be redirect to /app directory
	  redirect(307, '/landing');
}



