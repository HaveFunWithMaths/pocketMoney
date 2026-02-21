import { prisma } from '@/lib/prisma'
import { addExpense } from '@/app/actions/db'
import Link from 'next/link'
import { ArrowLeft, Send } from 'lucide-react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { SearchableSelect } from './SearchableSelect'

export default async function AddExpense() {
    const cookieStore = await cookies()
    const currentUser = cookieStore.get('auth_token')?.value

    const people = await prisma.person.findMany({
        orderBy: { name: 'asc' }
    })

    const teachers = people.filter((p: any) => p.role === 'TEACHER')
    const students = people.filter((p: any) => p.role === 'STUDENT')

    const currentUserPr = teachers.find((t: any) => t.name.startsWith(currentUser))

    return (
        <div className="p-4 space-y-6 pb-20">
            <div className="flex items-center gap-2">
                <Link href="/" className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors active:bg-slate-200">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </Link>
                <h1 className="text-xl font-bold text-slate-900">Add Expense</h1>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <form action={async (formData: FormData) => {
                    'use server'
                    await addExpense(formData)
                    redirect('/')
                }} className="space-y-5">
                    <div className="space-y-2 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <label htmlFor="debtorId" className="text-sm font-semibold text-slate-800">For whom the expense is made?(Student)</label>
                        <SearchableSelect
                            name="debtorId"
                            options={students}
                            placeholder="Select a student"
                            required
                        />
                    </div>

                    <div className="space-y-2 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <label htmlFor="creditorId" className="text-sm font-semibold text-slate-800">Who made the expense(Teacher)?</label>
                        <select
                            name="creditorId"
                            id="creditorId"
                            required
                            defaultValue={currentUserPr ? currentUserPr.id : ""}
                            disabled={currentUser !== 'Ninad'}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-60 disabled:bg-slate-200"
                        >
                            <option value="" disabled>Select a teacher</option>
                            {teachers.map((t: any) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                        {currentUser !== 'Ninad' && currentUserPr && (
                            <input type="hidden" name="creditorId" value={currentUserPr.id} />
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="amount" className="text-sm font-medium text-slate-700">Amount (₹)</label>
                        <input
                            type="number"
                            name="amount"
                            id="amount"
                            required
                            step="0.01"
                            placeholder="e.g. 500"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium text-slate-700">Description (Optional)</label>
                        <input
                            type="text"
                            name="description"
                            id="description"
                            placeholder="e.g. Book purchase"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <button type="submit" className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all mt-4 shadow-sm shadow-blue-200">
                        <Send className="w-5 h-5" />
                        Record Transaction
                    </button>
                </form>
            </div>
        </div>
    )
}
