'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
    const password = formData.get('password')

    if (password === 'ShriRam') {
        const cookieStore = await cookies()
        cookieStore.set('auth_token', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        })
        redirect('/')
    } else {
        return { error: 'Invalid password' }
    }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('auth_token')
    redirect('/login')
}
