import * as v from 'valibot';
import { mpae } from '$lib/trans';

export const UserAuth = v.object({
    access_token: v.string(),
    refresh_token: v.string(),
    token_type: v.string(),
    expires_in: v.number(),
});

export type UserAuth = v.InferOutput<typeof UserAuth>;
 
/*
# Project CRUD
"CREATE_PROJECT": "owner",
"VIEW_PROJECT": { "owner": True, "admin": True, "writer": True, "viewer": True},
"UPDATE_PROJECT": { "owner": True, "admin": True, "writer": False, "viewer": False},
"DELETE_PROJECT": { "owner": True, "admin": False, "writer": False, "viewer": False},

# 成员CRUD
"ADD_MEMBER": {"owner": True, "admin": True, "writer": False, "viewer": False},  # admin只能添加 writer, viewer
"UPDATE_MEMBER": {"owner": True, "admin": True, "writer": False, "viewer": False},  # admin只能修改 writer, viewer 的权限 (且只能在这两个权限间改)
"REMOVE_MEMBER": { "owner": True, "admin": True, "writer": False, "viewer": False},  # admin只能移除 writer, viewer
"LEAVE": { "owner": False, "admin": True, "writer": True, "viewer": True},
*/
export enum UserPermissionEnum {
    Owner = 'owner',
    Admin = 'admin',
    Writer = 'writer',
    Viewer = 'viewer'
}

export const User = v.object({
    username: v.string(),
    email: v.pipe(v.string(), v.email()),
    avatar: v.optional(v.string()),
    permission: v.optional(v.enum(UserPermissionEnum)),
    is_active: v.optional(v.boolean()),
    is_superuser: v.optional(v.boolean()),
});

export type User = v.InferOutput<typeof User>;


// TODO translate
export const RawRegisterForm = v.pipe(
    v.object({
        username: v.pipe(
            v.string(),
            v.nonEmpty(mpae.empty_username()),
            // v.regex(/^[a-z0-9_-]{4,16}$/iu, "TODO"),
        ),
        email: v.pipe(
            v.string(),
            v.nonEmpty(mpae.empty_email()),
            v.email(mpae.invalid_email())
        ),
        password: v.pipe(
            v.string(),
            v.nonEmpty(mpae.empty_password()),
            v.minLength(6, mpae.weak_password())
        ),
        confirm_password: v.string(),
    }),
    v.forward(
        v.partialCheck(
            [['password'], ['confirm_password']],
            (input) => input.password === input.confirm_password,
            mpae.password_mismatch()
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
