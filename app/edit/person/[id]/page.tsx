import { prisma } from '@/lib/prisma'
import { editPerson } from '@/app/actions/db'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function EditPerson({ params }: { params: { id: string } }) {
    const person = await prisma.person.findUnique({
        where: { id: params.id }
    })

    if (!person) return notFound()

    return (
        <div className="p-4 space-y-6 pb-20">
            <div className="flex items-center gap-2">
                <Link
                    href={person.role === 'TEACHER' ? '/manage/teachers' : '/manage/students'}
                    className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors active:bg-slate-200"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </Link>
                <h1 className="text-xl font-bold text-slate-900">Edit {person.role.toLowerCase()}</h1>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <form action={async (formData) => {
                    'use server'
                    await editPerson(person.id, formData)
                }} className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-slate-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            defaultValue={person.name}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <button type="submit" className="w-full flex justify-center items-center gap-2 bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-sm">
                        <Save className="w-5 h-5" />
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    )
}
