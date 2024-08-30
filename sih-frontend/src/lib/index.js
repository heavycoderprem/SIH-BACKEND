import { z } from "zod"

export const signUpformValidation = z.object({
    username: z.string().min(2, {message: 'Too Short'}).max(50),
    email: z.string().email(),
    password: z.string().min(8, {message: 'Password must be atleast 8 characters'})
})

export const signInformValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8,{message: 'Password must be atleast 8 characters'})
})