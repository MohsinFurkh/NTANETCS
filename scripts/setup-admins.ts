const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

const adminUsers = [
  {
    name: 'Mohsin Furkh',
    email: 'mohsinfurkh@gmail.com',
    password: 'Admin@123',
  },
  {
    name: 'Sayima Mukhtar',
    email: 'sayimamukhtar@gmail.com',
    password: 'Admin@123',
  },
];

async function main() {
  console.log('Starting admin setup...');

  for (const admin of adminUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: admin.email },
    });

    if (!existingUser) {
      const hashedPassword = await hash(admin.password, 12);
      await prisma.user.create({
        data: {
          name: admin.name,
          email: admin.email,
          password: hashedPassword,
          role: 'admin',
        },
      });
      console.log(`Created admin user: ${admin.email}`);
    } else {
      // Update existing user to be admin if not already
      if (existingUser.role !== 'admin') {
        await prisma.user.update({
          where: { email: admin.email },
          data: { role: 'admin' },
        });
        console.log(`Updated user to admin: ${admin.email}`);
      } else {
        console.log(`Admin user already exists: ${admin.email}`);
      }
    }
  }

  console.log('Admin setup completed!');
}

main()
  .catch((e) => {
    console.error('Error setting up admin users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 