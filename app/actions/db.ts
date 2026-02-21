'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { addRecordToSheet } from '@/lib/googleSheets'

export async function addPerson(formData: FormData) {
    const name = formData.get('name') as String
    const role = formData.get('role') as 'TEACHER' | 'STUDENT'

    if (!name || !role) {
        return { error: 'Missing fields' }
    }

    try {
        const person = await prisma.person.create({
            data: { name: name.trim(), role },
        })
        revalidatePath('/')
        revalidatePath('/add-expense')
        revalidatePath('/manage/teachers')
        revalidatePath('/manage/students')
        return { success: true, person }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function addExpense(formData: FormData) {
    const debtorId = formData.get('debtorId') as string
    const creditorId = formData.get('creditorId') as string
    const amountStr = formData.get('amount') as string
    const amount = parseFloat(amountStr)

    if (!debtorId || !creditorId || isNaN(amount) || amount === 0) {
        return { error: 'Invalid input fields' }
    }

    if (debtorId === creditorId) {
        return { error: 'Debtor and Creditor cannot be the same person' }
    }

    try {
        // Only teachers can be creditors
        const creditor = await prisma.person.findUnique({ where: { id: creditorId } })
        if (creditor?.role !== 'TEACHER') {
            return { error: 'Creditor must be a Teacher' }
        }

        const expense = await prisma.expense.create({
            data: {
                debtorId,
                creditorId,
                amount,
                description: formData.get('description') as string | undefined
            },
            include: {
                debtor: true,
                creditor: true
            }
        })

        // Log to Google Sheets
        await addRecordToSheet({
            'Date': expense.createdAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            'Action': 'ADDED',
            'Expense ID': expense.id,
            'Creditor (Who made the expense?)': expense.creditor.name,
            'Debtor (Who owes money?)': expense.debtor.name,
            'Amount': expense.amount,
            'Description': expense.description || ''
        })
        revalidatePath('/')
        revalidatePath(`/profile/teacher/${creditorId}`)
        revalidatePath(`/profile/student/${debtorId}`)
        return { success: true, expense }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function editPerson(id: string, formData: FormData) {
    const name = formData.get('name') as String
    if (!name) return { error: 'Missing name' }

    try {
        const person = await prisma.person.update({
            where: { id },
            data: { name: name.trim() }
        })
        revalidatePath('/')
        revalidatePath('/add-expense')
        revalidatePath('/manage/teachers')
        revalidatePath('/manage/students')
        return { success: true, person }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function deletePerson(id: string) {
    try {
        await prisma.expense.deleteMany({
            where: { OR: [{ debtorId: id }, { creditorId: id }] }
        })
        await prisma.person.delete({
            where: { id }
        })
        revalidatePath('/')
        revalidatePath('/add-expense')
        revalidatePath('/manage/teachers')
        revalidatePath('/manage/students')
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function editExpense(id: string, formData: FormData) {
    const amountStr = formData.get('amount') as string
    const amount = parseFloat(amountStr)
    const description = formData.get('description') as string | undefined

    if (isNaN(amount) || amount === 0) return { error: 'Invalid amount' }

    try {
        const expense = await prisma.expense.update({
            where: { id },
            data: { amount, description: description || null },
            include: {
                debtor: true,
                creditor: true
            }
        })

        // Log edit to Google Sheets
        await addRecordToSheet({
            'Date': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            'Action': 'EDITED',
            'Expense ID': expense.id,
            'Creditor (Who made the expense?)': expense.creditor.name,
            'Debtor (Who owes money?)': expense.debtor.name,
            'Amount': expense.amount,
            'Description': expense.description || ''
        })
        revalidatePath('/')
        revalidatePath(`/profile/teacher/${expense.creditorId}`)
        revalidatePath(`/profile/student/${expense.debtorId}`)
        return { success: true, expense }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function deleteExpense(id: string) {
    try {
        const expense = await prisma.expense.delete({
            where: { id },
            include: {
                debtor: true,
                creditor: true
            }
        })

        // Log delete to Google Sheets
        await addRecordToSheet({
            'Date': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            'Action': 'DELETED',
            'Expense ID': expense.id,
            'Creditor (Who made the expense?)': expense.creditor.name,
            'Debtor (Who owes money?)': expense.debtor.name,
            'Amount': expense.amount,
            'Description': expense.description || ''
        })
        revalidatePath('/')
        // We could extract the debtor/creditor ID and revalidate profiles if needed.
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}
