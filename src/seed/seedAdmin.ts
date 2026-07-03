// import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

async function main() {
    const adminEmail = 'admin12@ecospark.com';
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
            profileImage: 'https://i.ibb.co/4pDNDk1/avatar.png', // default profile image
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




// #################################################################################################




// import bcrypt from 'bcryptjs';
// import { prisma } from '../lib/prisma';

// async function main() {
//     const adminEmail = 'admin10@ecospark.com';
//     const adminPassword = 'admin123';
//     const saltRounds = 10;

//     // check existing admin
//     const existingAdmin = await prisma.user.findUnique({
//         where: { email: adminEmail },
//     });

//     if (existingAdmin) {
//         console.log('Admin already exists!');
//         return;
//     }

//     const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

//     const admin = await prisma.user.create({
//         data: {
//             name: 'EcoSpark Admin',
//             email: adminEmail,
//             password: hashedPassword,
//             role: 'ADMIN',
//             status: 'ACTIVE', // নিশ্চিত করার জন্য সরাসরি 'ACTIVE' স্টেটাস দেওয়া হলো
//             profileImage: 'https://i.ibb.co/4pDNDk1/avatar.png',
//         },
//     });

//     console.log('Admin created successfully:', admin);
// }

// main()
//     .catch((e) => {
//         console.error(e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });