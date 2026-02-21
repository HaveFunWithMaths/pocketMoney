import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, UserCircle, HandCoins } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function TeacherProfile({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const teacher = await prisma.person.findFirst({
        where: { id, role: 'TEACHER' },
        include: {
            expensesAsCred: {
                include: { debtor: true },
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!teacher) return notFound()

    // Aggregate incoming debts by Debtor
    const debtsByDebtor = teacher.expensesAsCred.reduce((acc: Record<string, any>, exp: any) => {
        const dId = exp.debtorId
        if (!acc[dId]) {
            acc[dId] = { debtorName: exp.debtor.name, total: 0, count: 0, role: exp.debtor.role }
        }
        acc[dId].total += exp.amount
        acc[dId].count += 1
        return acc
    }, {} as Record<string, { debtorName: string, total: number, count: number, role: string }>)

    const totalOwedToTeacher = Object.values(debtsByDebtor).reduce((sum: number, d: any) => sum + d.total, 0)

    return (
        <div className="p-4 space-y-6 pb-20">
            <div className="flex items-center gap-2">
                <Link href="/manage/teachers" className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors active:bg-slate-200">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </Link>
                <h1 className="text-xl font-bold text-slate-900">Teacher Profile</h1>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center space-y-3">
                <UserCircle className="w-16 h-16 text-indigo-500 bg-indigo-50 rounded-full p-2" />
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900">{teacher.name}</h2>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-1">Total Owed by Others</p>
                    <p className="text-3xl font-bold text-emerald-500 mt-2">₹{totalOwedToTeacher.toLocaleString('en-IN')}</p>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="font-semibold text-slate-900 px-1">Owed Money By</h3>
                {Object.entries(debtsByDebtor).length > 0 ? (
                    <ul className="space-y-3 shadow-sm border border-slate-100 bg-white rounded-2xl overflow-hidden divide-y divide-slate-100">
                        {Object.entries(debtsByDebtor).map(([debtorId, data]: [string, any]) => (
                            <li key={debtorId} className="p-4 flex items-center justify-between">
                                <Link href={`/profile/${data.role.toLowerCase()}/${debtorId}`} className="font-medium text-slate-800 hover:text-indigo-600 transition-colors flex flex-col items-start">
                                    <span>{data.debtorName}</span>
                                    <span className="text-xs font-normal text-slate-500">{data.count} transaction{data.count > 1 ? 's' : ''}</span>
                                </Link>
                                <span className="font-semibold text-slate-900 bg-emerald-50 px-3 py-1 rounded-lg text-emerald-700">₹{data.total.toLocaleString('en-IN')}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center text-slate-500">
                        Nobody owes money to this teacher.
                    </div>
                )}
            </div>

            <div className="space-y-3">
                <h3 className="font-semibold text-slate-900 px-1 flex items-center gap-2">
                    <HandCoins className="w-4 h-4 text-slate-400" />
                    All Incoming Transactions
                </h3>
                <ul className="space-y-2">
                    {teacher.expensesAsCred.map((exp: any) => (
                        <li key={exp.id} className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between shadow-sm group">
                            <div>
                                <p className="text-sm font-medium text-slate-800">From {exp.debtor.name}</p>
                                <p className="text-xs text-slate-500">{new Date(exp.createdAt).toLocaleDateString()}</p>
                                {exp.description && <p className="text-xs text-slate-400 mt-0.5">{exp.description}</p>}
                            </div>
                            <div className="flex items-center gap-3">
                                {exp.amount < 0 ? (
                                    <span className="text-sm font-semibold text-red-500">-₹{Math.abs(exp.amount)}</span>
                                ) : (
                                    <span className="text-sm font-semibold text-emerald-600">+₹{exp.amount}</span>
                                )}
                                <Link href={`/edit/expense/${exp.id}`} className="p-1.5 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors hidden group-hover:block">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    )
}
