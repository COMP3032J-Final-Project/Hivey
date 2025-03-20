import * as v from 'valibot';
import * as m from '$lib/paraglide/messages';

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


// TODO translate
export const RawRegisterForm = v.pipe(
    v.object({
        username: v.pipe(
            v.string(),
            v.nonEmpty(m.error_empty_username()),
            // v.regex(/^[a-z0-9_-]{4,16}$/iu, "TODO"),
        ),
        email: v.pipe(
            v.string(),
            v.nonEmpty(m.error_empty_email()),
            v.email(m.error_invalid_email())
        ),
        password: v.pipe(
            v.string(),
            v.nonEmpty(m.error_empty_password()),
            v.minLength(6, m.error_weak_password())
        ),
        confirm_password: v.string(),
    }),
    v.forward(
        v.partialCheck(
            [['password'], ['confirm_password']],
            (input) => input.password === input.confirm_password,
            m.error_password_mismatch()
        ),
        ['confirm_password']
    )
);

export const RegisterForm = v.object({
    username: v.string(),
    email: v.pipe(v.string(), v.email()),
    password: v.string(),
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
