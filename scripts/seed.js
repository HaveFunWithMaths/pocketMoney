const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Starting seed...')

    const teachers = ['Ninad Pr', 'Brajesh Pr', 'Tirumala Pr']

    for (const t of teachers) {
        await prisma.person.upsert({
            where: { id: t }, // We'll just rely on creating if they don't exist by name
            update: {},
            create: {
                name: t,
                role: 'TEACHER'
            }
        }).catch(async () => {
            // Upsert fail fallback if no unique constraint on name
            const exists = await prisma.person.findFirst({ where: { name: t } })
            if (!exists) {
                await prisma.person.create({ data: { name: t, role: 'TEACHER' } })
                console.log(`Created teacher: ${t}`)
            } else {
                console.log(`Teacher already exists: ${t}`)
            }
        })
    }

    console.log('Seed finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
