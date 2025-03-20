import * as v from 'valibot';

export const UserAuth = v.object({
    access_token: v.string(),
    refresh_token: v.string(),
    token_type: v.string(),
    expires_in: v.number(),
});

export type UserAuth = v.InferOutput<typeof UserAuth>;

export const User = v.object({
    username: v.string(),
    email: v.pipe(v.string(), v.email()),
    is_active: v.boolean(),
    is_superuser: v.boolean(),
});

export type User = v.InferOutput<typeof User>;


export const RegisterForm = v.object({
    username: v.string(),
    email: v.pipe(v.string(), v.email()),
    password: v.string()
});

export type RegisterForm = v.InferOutput<typeof RegisterForm>;

export const LoginForm = v.object({
    email: v.pipe(v.string(), v.email()),
    password: v.string()
});

export type LoginForm = v.InferOutput<typeof LoginForm>;


export const RefreshUserAuthForm = v.object({
    refresh_token: v.string(),
});

export type RefreshUserAuthForm = v.InferOutput<typeof RefreshUserAuthForm>;
