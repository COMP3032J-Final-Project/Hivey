import type { User } from './auth';
import * as v from 'valibot';

// /routes/dashboard/+layout.ts的load函数返回的数据类型
export interface DashboardLayoutData {
    user: User | null;
}

export const Project = v.object(
    {
        id: v.string(),
        name: v.string(),
        createdAt: v.date(),
        updatedAt: v.date(),
        type: v.union(v.literal('project'), v.literal('template')),
        owner: v.optional(User) ,
    }
)
export type Project = v.InferOutput<typeof Project>;


export const CreateProjectForm = v.object({
    name: v.string(),
    category: v.union(v.literal('blank'), v.literal('upload'), v.literal('example')),
    file: v.optional(v.instanceof(File))
})
export type CreateProjectForm = v.InferOutput<typeof CreateProjectForm>;