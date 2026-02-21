import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { PlusCircle, Users, BookOpen } from 'lucide-react'

export default async function Dashboard() {
  const teacherCount = await prisma.person.count({ where: { role: 'TEACHER' } })
  if (teacherCount === 0) {
    await prisma.person.createMany({
      data: [
        { name: 'Ninad Pr', role: 'TEACHER' },
        { name: 'Brajesh Pr', role: 'TEACHER' },
        { name: 'Tirumala Pr', role: 'TEACHER' }
      ]
    })
  }

  const expenses = await prisma.expense.findMany()
  const totalDebt = expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0)

  const quickLinks = [
    { label: 'Add Expense', href: '/add-expense', icon: PlusCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Manage Teachers', href: '/manage/teachers', icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Manage Students', href: '/manage/students', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ]

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-2">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Platform Total Debt</h2>
        <p className="text-4xl font-bold text-slate-900">₹{totalDebt.toLocaleString('en-IN')}</p>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900 text-lg px-1">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all group active:scale-[0.98]"
            >
              <div className={`p-3 rounded-lg ${link.bg} ${link.color} mr-4 group-hover:scale-110 transition-transform`}>
                <link.icon className="w-6 h-6" />
              </div>
              <span className="font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
