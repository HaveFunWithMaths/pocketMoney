import { login } from '@/app/actions/auth'
import Image from 'next/image'

export default function LoginPage() {
    return (
        <div className="fixed inset-0 bg-slate-50 flex flex-col items-center justify-center p-4 z-50">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-8">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 relative rounded-full overflow-hidden shadow-sm border border-slate-200">
                        <Image src="/img/logo.jpeg" alt="Logo" fill className="object-cover" priority />
                    </div>
                    <div className="text-center space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pocket Money</h1>
                        <p className="text-sm text-slate-500">Sign in to manage the ledger</p>
                    </div>
                </div>

                <form action={async (formData: FormData) => {
                    'use server'
                    await login(formData)
                }} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                            placeholder="Enter password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 transition-colors active:scale-[0.98]"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    )
}
