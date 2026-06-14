// import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

async function main() {
    const adminEmail = 'admin@ecospark.com';
    const adminPassword = 'admin123';
    const saltRounds = 10;

    // check existing admin
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (existingAdmin) {
        console.log('Admin already exists!');
        return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    const admin = await prisma.user.create({
        data: {
            name: 'EcoSpark Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'ADMIN',
            img: 'https://i.ibb.co/4pDNDk1/avatar.png', // default profile image
        },
    });

    console.log('Admin created successfully:', admin);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });