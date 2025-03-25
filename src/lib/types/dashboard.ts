import { User } from './auth';
import * as v from 'valibot';

// /routes/dashboard/+layout.ts的load函数返回的数据类型
export interface DashboardLayoutData {
    user: User | null;
}

export enum ProjectType {
    Project = 'project',
    Template = 'template',
}

export enum ProjectFormCategory {
    Blank = 'blank',
    Upload = 'upload',
    Example = 'example'
}

export const Project = v.object({
    id: v.string(),
    name: v.string(),
    createdAt: v.date(),
    updatedAt: v.date(),
    type: v.enum(ProjectType),
    owner: v.optional(User) ,
})

export type Project = v.InferOutput<typeof Project>;


export const CreateProjectForm = v.object({
    name: v.string(),
    category: v.enum(ProjectFormCategory),
    file: v.optional(v.instance(File))
})
export type CreateProjectForm = v.InferOutput<typeof CreateProjectForm>;
