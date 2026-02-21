import { prisma } from '@/lib/prisma'
import { editExpense, deleteExpense } from '@/app/actions/db'
import Link from 'next/link'
import { ArrowLeft, Save, Trash } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

export default async function EditExpense({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const expense = await prisma.expense.findUnique({
        where: { id },
        include: { debtor: true, creditor: true }
    })

    if (!expense) return notFound()

    return (
        <div className="p-4 space-y-6 pb-20">
            <div className="flex items-center gap-2">
                <Link
                    // Could link back to either profile, but dashboard is safe 
                    href="/"
                    className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors active:bg-slate-200"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </Link>
                <h1 className="text-xl font-bold text-slate-900">Edit Transaction</h1>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-sm font-medium text-slate-500 mb-1">Transaction Details</p>
                    <p className="text-slate-800 font-medium">
                        {expense.debtor.name} <span className="text-slate-400 font-normal mx-1">owes</span> {expense.creditor.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(expense.createdAt).toLocaleString()}</p>
                </div>

                <form action={async (formData) => {
                    'use server'
                    await editExpense(expense.id, formData)
                }} className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="amount" className="text-sm font-medium text-slate-700">Amount (₹)</label>
                        <input
                            type="number"
                            name="amount"
                            id="amount"
                            required
                            min="1"
                            step="0.01"
                            defaultValue={expense.amount}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium text-slate-700">Description (Optional)</label>
                        <input
                            type="text"
                            name="description"
                            id="description"
                            defaultValue={expense.description || ''}
                            placeholder="e.g. Book purchase"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <button type="submit" className="w-full flex justify-center items-center gap-2 bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-sm">
                        <Save className="w-5 h-5" />
                        Save Changes
                    </button>
                </form>

                <form action={async () => {
                    'use server'
                    await deleteExpense(expense.id)
                    redirect('/')
                }}>
                    <button type="submit" className="w-full flex justify-center items-center gap-2 bg-red-50 text-red-600 font-semibold py-3 rounded-xl hover:bg-red-100 active:scale-[0.98] transition-all shadow-sm mt-4 border border-red-100">
                        <Trash className="w-5 h-5" />
                        Delete Transaction
                    </button>
                </form>
            </div>
        </div>
    )
}
