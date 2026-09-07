import {z} from 'zod';
export const invoiceSchema=z.object({invoiceNumber:z.string().min(1),issueDate:z.string().min(1),dueDate:z.string().min(1),currency:z.string(),items:z.array(z.object({description:z.string().min(1),quantity:z.coerce.number().nonnegative(),rate:z.coerce.number().nonnegative(),taxRate:z.coerce.number().nonnegative()})).min(1)});
export function validEmail(email:string){return !email||z.email().safeParse(email).success}
