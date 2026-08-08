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

const postsData = [
  {
    title: "Hazardous chemical leakage in Industrial Phase 9",
    description: "Chemical containers leaking near the storm drain in Sector 66 industrial park. Corrosive fluid pooling on the ground.",
    location: "Punjab",
    subLocation: "SAS NAGAR",
    latitude: 30.6850,
    longitude: 76.7280,
    imageType: "default",
    images: ["/media/issues/chemicalwasteleakage.jpg"],
    links: [],
    upvotes: 34,
    status: "Resolved",
    internalNotes: "Hazardous response team dispatched. Sealed leak and neutralised soil.",
    resolutionNote: "Our chemical containment team successfully sealed the containers and cleaned up the spill using absorbent sand. The storm drain was verified clean.",
    resolutionImages: ["/media/issues/chemicalwasteleakage.jpg"],
    isAnonymous: false,
    authorId: "user1"
  },
  {
    title: "Construction debris dumped on protected wetlands",
    description: "Tons of brick, concrete, and metal debris dumped overnight near the wetlands. Appears to be from a commercial site.",
    location: "Punjab",
    subLocation: "SAS NAGAR",
    latitude: 30.6750,
    longitude: 76.7150,
    imageType: "default",
    images: ["/media/issues/constdebrisatprotectedland.jpg"],
    links: [],
    upvotes: 12,
    status: "In Progress",
    internalNotes: "Wetland conservation team notified. Cleanup contractor assigned.",
    resolutionNote: null,
    resolutionImages: [],
    isAnonymous: false,
    authorId: "user2",
    attachmentImage: "/media/issues/constdebrisatprotectedland.jpg",
    attachmentLink: "https://www.punjab.gov.in/environmental-notices"
  },
  {
    title: "Dead fish floating due to water contamination",
    description: "Large numbers of dead fish spotted floating in the lake. Highly likely due to illegal chemical discharge from upstream factories.",
    location: "Punjab",
    subLocation: "LUDHIANA",
    latitude: 30.9020,
    longitude: 75.8530,
    imageType: "default",
    images: ["/media/issues/deadfishwatercontamination.jpg"],
    links: [],
    upvotes: 45,
    status: "Review Queue",
    internalNotes: "",
    resolutionNote: null,
    resolutionImages: [],
    isAnonymous: true,
    authorId: "user3"
  },
  {
    title: "Toxic foam accumulation in the local canal",
    description: "Thick white foam covering the canal surface near the residential bridge. Strong chemical odor is spreading.",
    location: "Punjab",
    subLocation: "LUDHIANA",
    latitude: 30.8950,
    longitude: 75.8620,
    imageType: "default",
    images: ["/media/issues/foamcanal.jpg"],
    links: [],
    upvotes: 27,
    status: "Acknowledged",
    internalNotes: "Env inspection team has taken water samples for lab testing.",
    resolutionNote: null,
    resolutionImages: [],
    isAnonymous: false,
    authorId: "user4"
  },
  {
    title: "Illegal garbage dumping behind residential sector",
    description: "Massive pile of domestic waste and plastic packages dumped next to the park entrance. Attracting stray dogs and flies.",
    location: "Punjab",
    subLocation: "SAS NAGAR",
    latitude: 30.6900,
    longitude: 76.7320,
    imageType: "default",
    images: ["/media/issues/garbagedumping.jpg"],
    links: [],
    upvotes: 18,
    status: "Resolved",
    internalNotes: "Municipal cleanup crew dispatched. Removed garbage and cleaned area.",
    resolutionNote: "The sanitation team cleared the entire garbage pile and disinfected the area. Surveillance cameras will be installed to prevent future dumping.",
    resolutionImages: ["/media/issues/garbagedumping.jpg"],
    isAnonymous: false,
    authorId: "user1"
  },
  {
    title: "Oil spill spreading in the drainage canal",
    description: "Black oil sheen observed covering the water surface in the storm drain. Urgently needs containment before it reaches the main river.",
    location: "Punjab",
    subLocation: "PATIALA",
    latitude: 30.3420,
    longitude: 76.3880,
    imageType: "default",
    images: ["/media/issues/oilspilldrainagecanal.jpg"],
    links: [],
    upvotes: 8,
    status: "Review Queue",
    internalNotes: "",
    resolutionNote: null,
    resolutionImages: [],
    isAnonymous: true,
    authorId: "user2"
  },
  {
    title: "Open waste burning causing severe smoke and smog",
    description: "Dry leaves, plastic bags, and industrial waste being burned in an open field opposite the public school.",
    location: "Punjab",
    subLocation: "SAS NAGAR",
    latitude: 30.6720,
    longitude: 76.7260,
    imageType: "default",
    images: ["/media/issues/openwasteburning.jpg"],
    links: [],
    upvotes: 15,
    status: "Acknowledged",
    internalNotes: "Security patrol dispatched to identify the offenders.",
    resolutionNote: null,
    resolutionImages: [],
    isAnonymous: false,
    authorId: "user3"
  },
  {
    title: "Blocked storm drain overflowing onto street",
    description: "Severe blockages in the sewer drainage system causing wastewater to overflow onto the public street, causing traffic bottlenecks.",
    location: "Punjab",
    subLocation: "PATIALA",
    latitude: 30.3350,
    longitude: 76.3820,
    imageType: "default",
    images: ["/media/issues/overflowingdrain.jpg"],
    links: [],
    upvotes: 22,
    status: "In Progress",
    internalNotes: "Plumbing team dispatched with suction machine to clear blockage.",
    resolutionNote: null,
    resolutionImages: [],
    isAnonymous: false,
    authorId: "user4"
  },
  {
    title: "Unauthorized cutting of mature trees",
    description: "Several healthy mature trees are being cut down along the boundary wall of Phase 7 without any municipal permit or notice.",
    location: "Punjab",
    subLocation: "SAS NAGAR",
    latitude: 30.6800,
    longitude: 76.7200,
    imageType: "default",
    images: ["/media/issues/treecutwithoutauth.jpg"],
    links: [],
    upvotes: 29,
    status: "Review Queue",
    internalNotes: "",
    resolutionNote: null,
    resolutionImages: [],
    isAnonymous: false,
    authorId: "user1"
  }
];

async function main() {
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

  console.log("Seeding default users...")
  for (const u of defaultUsers) {
    const hashedPassword = await bcrypt.hash(u.password, 10)
    
    await prisma.user.create({
      data: {
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

  console.log("Seeding 9 reports...")
  for (const p of postsData) {
    const report = await prisma.report.create({
      data: {
        title: p.title,
        description: p.description,
        location: p.location,
        subLocation: p.subLocation,
        latitude: p.latitude,
        longitude: p.longitude,
        imageType: p.imageType,
        images: p.images,
        links: p.links,
        upvotes: p.upvotes,
        status: p.status,
        internalNotes: p.internalNotes,
        resolutionNote: p.resolutionNote,
        resolutionImages: p.resolutionImages,
        isAnonymous: p.isAnonymous,
        authorId: p.authorId
      }
    });

    if (p.attachmentImage || p.attachmentLink) {
      await prisma.reportAttachment.create({
        data: {
          reportId: report.id,
          contributorId: report.authorId,
          attachmentImage: p.attachmentImage,
          attachmentLink: p.attachmentLink
        }
      });
    }

    // Create default follow and upvote by author
    await prisma.reportFollow.create({
      data: {
        userId: p.authorId,
        reportId: report.id
      }
    });

    await prisma.reportUpvote.create({
      data: {
        userId: p.authorId,
        reportId: report.id
      }
    });

    // Create TimelineEvents depending on the status
    const now = new Date();
    if (p.status === "Review Queue") {
      await prisma.timelineEvent.create({
        data: {
          reportId: report.id,
          status: "Review Queue",
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2)
        }
      });
    } else if (p.status === "Acknowledged") {
      await prisma.timelineEvent.create({
        data: {
          reportId: report.id,
          status: "Review Queue",
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 5)
        }
      });
      await prisma.timelineEvent.create({
        data: {
          reportId: report.id,
          status: "Acknowledged",
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 4)
        }
      });
    } else if (p.status === "In Progress") {
      await prisma.timelineEvent.create({
        data: {
          reportId: report.id,
          status: "Review Queue",
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 6)
        }
      });
      await prisma.timelineEvent.create({
        data: {
          reportId: report.id,
          status: "Acknowledged",
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 5)
        }
      });
      await prisma.timelineEvent.create({
        data: {
          reportId: report.id,
          status: "In Progress",
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 4)
        }
      });
    } else if (p.status === "Resolved") {
      await prisma.timelineEvent.create({
        data: {
          reportId: report.id,
          status: "Review Queue",
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24)
        }
      });
      await prisma.timelineEvent.create({
        data: {
          reportId: report.id,
          status: "Acknowledged",
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 22)
        }
      });
      await prisma.timelineEvent.create({
        data: {
          reportId: report.id,
          status: "In Progress",
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 20)
        }
      });
      await prisma.timelineEvent.create({
        data: {
          reportId: report.id,
          status: "Resolved",
          timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 10)
        }
      });
    }
  }

  // Seed some comments to make the reports active
  console.log("Seeding comments...")
  const dbReports = await prisma.report.findMany();
  
  const report1 = dbReports.find(r => r.title.includes("chemical"));
  if (report1) {
    await prisma.comment.create({
      data: {
        reportId: report1.id,
        authorId: "user2",
        text: "I passed by Phase 9 yesterday. The chemical smell was very strong. Glad it's resolved.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8)
      }
    });
    await prisma.comment.create({
      data: {
        reportId: report1.id,
        authorId: "user3",
        text: "Thanks to the municipal officer for the quick cleanup!",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6)
      }
    });
  }

  const report3 = dbReports.find(r => r.title.includes("Dead fish"));
  if (report3) {
    await prisma.comment.create({
      data: {
        reportId: report3.id,
        authorId: "user1",
        text: "This is a serious environmental threat. Upstream industrial outlets must be audited.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3)
      }
    });
  }

  const report5 = dbReports.find(r => r.title.includes("garbage dumping"));
  if (report5) {
    await prisma.comment.create({
      data: {
        reportId: report5.id,
        authorId: "user4",
        text: "Finally, this eyesore has been cleared! Hopefully, people stop dumping here.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
      }
    });
  }

  console.log("Successfully seeded reports, comments, upvotes, follows, and timeline events.")
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
