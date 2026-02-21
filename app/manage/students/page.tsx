import { prisma } from '@/lib/prisma'
import { addPerson, deletePerson } from '@/app/actions/db'
import Link from 'next/link'
import { ArrowLeft, Trash2, Pencil, UserPlus } from 'lucide-react'

export default async function ManageStudents() {
    const students = await prisma.person.findMany({
        where: { role: 'STUDENT' },
        orderBy: { createdAt: 'asc' }
    })

    return (
        <div className="p-4 space-y-6 pb-20">
            <div className="flex items-center gap-2">
                <Link href="/" className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors active:bg-slate-200">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </Link>
                <h1 className="text-xl font-bold text-slate-900">Manage Students</h1>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-emerald-500" />
                    Add New Student
                </h2>
                <form action={async (formData: FormData) => {
                    'use server'
                    await addPerson(formData)
                }} className="flex gap-2">
                    <input type="hidden" name="role" value="STUDENT" />
                    <input
                        type="text"
                        name="name"
                        required
                        placeholder="Student's Name"
                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                    <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 active:scale-95 transition-all">
                        Add
                    </button>
                </form>
            </div>

            <div className="space-y-3">
                <h3 className="font-semibold text-slate-900 px-1">Current Students</h3>
                <ul className="space-y-3 shadow-sm border border-slate-100 bg-white rounded-2xl overflow-hidden divide-y divide-slate-100">
                    {students.map((t: any) => (
                        <li key={t.id} className="p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                            <Link href={`/profile/student/${t.id}`} className="font-medium text-slate-800 flex-1 py-1 hover:text-emerald-600">
                                {t.name}
                            </Link>
                            <div className="flex items-center gap-1">
                                <Link href={`/edit/person/${t.id}`} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                    <Pencil className="w-4 h-4" />
                                </Link>
                                <form action={async () => {
                                    'use server'
                                    await deletePerson(t.id)
                                }}>
                                    <button type="submit" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Student">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </form>
                            </div>
                        </li>
                    ))}
                    {students.length === 0 && (
                        <li className="p-8 text-center text-slate-500">No students found.</li>
                    )}
                </ul>
            </div>
        </div>
    )
}
