import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const teachers = [
        { name: 'Ninad Pr', role: 'TEACHER' },
        { name: 'Brajesh Pr', role: 'TEACHER' },
        { name: 'Thirumala Pr', role: 'TEACHER' },
        { name: 'Saurabh Pr', role: 'TEACHER' },
    ]

    console.log(`Start seeding ...`)
    for (const t of teachers) {
        const existing = await prisma.person.findFirst({ where: { name: t.name, role: 'TEACHER' } })
        if (!existing) {
            const person = await prisma.person.create({
                data: t,
            })
            console.log(`Created teacher with id: ${person.id} and name: ${person.name}`)
        } else {
            console.log(`Teacher ${t.name} already exists.`)
        }
    }
    console.log(`Seeding finished.`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
