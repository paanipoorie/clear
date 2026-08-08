import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client.js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

function getDirectConnectionString() {
  const urlStr = process.env.DATABASE_URL
  if (!urlStr) {
    throw new Error("DATABASE_URL is not set")
  }
  if (urlStr.startsWith('prisma+postgres://')) {
    const url = new URL(urlStr)
    const apiKey = url.searchParams.get('api_key')
    if (apiKey) {
      const decoded = Buffer.from(apiKey, 'base64').toString('utf-8')
      const data = JSON.parse(decoded)
      if (data.databaseUrl) {
        return data.databaseUrl
      }
    }
  }
  return urlStr
}

const pool = new pg.Pool({ connectionString: getDirectConnectionString() })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const defaultUsers = [
  { id: 'user1', username: 'Nishant', email: 'user1@clear.com', password: 'password', role: 'citizen', district: null, authKey: null },
  { id: 'user2', username: 'Abhyudaya', email: 'user2@clear.com', password: 'password', role: 'citizen', district: null, authKey: null },
  { id: 'user3', username: 'Naman', email: 'user3@clear.com', password: 'password', role: 'citizen', district: null, authKey: null },
  { id: 'user4', username: 'Aashmi', email: 'user4@clear.com', password: 'password', role: 'citizen', district: null, authKey: null },
  { id: 'municipal1', username: 'municipal1', email: 'municipal1@clear.gov', password: 'password', role: 'municipal', district: 'SAS NAGAR', authKey: 'HX291Z' },
  { id: 'municipal2', username: 'municipal2', email: 'municipal2@clear.gov', password: 'password', role: 'municipal', district: 'LUDHIANA', authKey: 'HX291Z' }
];

async function main() {
  const shouldClean = process.argv.includes('--clean');
  
  if (shouldClean) {
    console.log("Cleaning all existing tables (users and all mock data)...")
    await prisma.notification.deleteMany()
    await prisma.reportFollow.deleteMany()
    await prisma.reportUpvote.deleteMany()
    await prisma.comment.deleteMany()
    await prisma.timelineEvent.deleteMany()
    await prisma.notice.deleteMany()
    await prisma.report.deleteMany()
    await prisma.user.deleteMany()
    console.log("Cleanup finished.")
  }

  console.log("Seeding default users...")
  for (const u of defaultUsers) {
    const hashedPassword = await bcrypt.hash(u.password, 10)
    
    // Idempotent upsert by unique email
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        username: u.username,
        password: hashedPassword,
        role: u.role,
        district: u.district ? u.district.toUpperCase() : null,
        authKey: u.authKey || null
      },
      create: {
        id: u.id,
        username: u.username,
        email: u.email,
        password: hashedPassword,
        role: u.role,
        district: u.district ? u.district.toUpperCase() : null,
        authKey: u.authKey || null
      }
    });
  }

  console.log(`Successfully seeded ${defaultUsers.length} users.`)
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
