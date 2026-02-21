import { prisma } from '@/lib/prisma'
import { addExpense } from '@/app/actions/db'
import Link from 'next/link'
import { ArrowLeft, Send } from 'lucide-react'

export default async function AddExpense() {
    const people = await prisma.person.findMany({
        orderBy: { name: 'asc' }
    })

    const teachers = people.filter((p: any) => p.role === 'TEACHER')
    const allPeople = people // Anyone can be a debtor

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
                }} className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="debtorId" className="text-sm font-medium text-slate-700">Who owes money? (Debtor)</label>
                        <select
                            name="debtorId"
                            id="debtorId"
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="" disabled selected>Select a person</option>
                            {allPeople.map((p: any) => (
                                <option key={p.id} value={p.id}>{p.name} ({p.role.toLowerCase()})</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="creditorId" className="text-sm font-medium text-slate-700">Who is owed money? (Creditor - Teachers Only)</label>
                        <select
                            name="creditorId"
                            id="creditorId"
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="" disabled selected>Select a teacher</option>
                            {teachers.map((t: any) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="amount" className="text-sm font-medium text-slate-700">Amount (₹)</label>
                        <input
                            type="number"
                            name="amount"
                            id="amount"
                            required
                            min="1"
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
