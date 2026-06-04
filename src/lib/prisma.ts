// import "dotenv/config";
// import { PrismaPg } from '@prisma/adapter-pg'
// import { PrismaClient } from '../../generated/prisma/client'

// const connectionString = `${process.env.DATABASE_URL}`

// const adapter = new PrismaPg({ connectionString })
// const prisma = new PrismaClient({ adapter })

// export { prisma }

import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
// ভুল পাথ: '../../generated/prisma/client'
// সঠিক পাথ:
import { PrismaClient } from '../../generated/prisma'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }
