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
  { id: 'user1', username: 'Nishant', email: 'user1@clear.com', password: 'password', role: 'citizen' },
  { id: 'user2', username: 'Abhyudaya', email: 'user2@clear.com', password: 'password', role: 'citizen' },
  { id: 'user3', username: 'Naman', email: 'user3@clear.com', password: 'password', role: 'citizen' },
  { id: 'user4', username: 'Aashmi', email: 'user4@clear.com', password: 'password', role: 'citizen' },
  { id: 'municipal1', username: 'municipal1', email: 'municipal1@clear.gov', password: 'password', authKey: 'HX291Z', role: 'municipal', district: 'SAS NAGAR' },
  { id: 'municipal2', username: 'municipal2', email: 'municipal2@clear.gov', password: 'password', authKey: 'HX291A', role: 'municipal', district: 'LUDHIANA' }
];

const authorIdMapping: { [key: string]: string } = {
  'user': 'user1',
  'user-nishant': 'user1',
  'user-abhyudaya': 'user2',
  'user-amrit': 'user3',
  'user-rajesh': 'user3',
  'user-karan': 'user4',
  'user-simran': 'user4',
  'officer': 'municipal2',
  'municipal': 'municipal1',
  'officer-sas': 'municipal1',
  'officer-amritsar': 'municipal2'
};

async function main() {
  console.log("Starting seeding...")

  // Clean existing tables to avoid duplicate key violations on re-seeding
  await prisma.notification.deleteMany()
  await prisma.reportFollow.deleteMany()
  await prisma.reportUpvote.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.timelineEvent.deleteMany()
  await prisma.notice.deleteMany()
  await prisma.report.deleteMany()
  await prisma.user.deleteMany()

  // 1. Seed Users
  const userMap = new Map()
  for (const u of defaultUsers) {
    const hashedPassword = await bcrypt.hash(u.password, 10)
    const user = await prisma.user.create({
      data: {
        id: u.id,
        username: u.username,
        email: u.email,
        password: hashedPassword,
        role: u.role,
        district: u.district || null,
        authKey: u.authKey || null,
      }
    })
    userMap.set(u.id, user.id)
  }
  console.log(`Seeded ${defaultUsers.length} users.`)

  // 2. Seed Issues/Reports
  const issuesData = [
    {
      id: 1,
      title: "Illegal dumping behind residential area",
      location: "Punjab",
      subLocation: "SAS NAGAR",
      description: "Piles of trash bags and plastic debris accumulating behind the residential block, causing odor and attracting stray animals.",
      images: ["/media/issues/garbage.jpeg"],
      imageType: "dumping",
      upvotes: 42,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: "Acknowledged",
      internalNotes: "Assigned to the Sector 4 cleanliness squad. Cleanup scheduled for Friday morning.",
      resolutionImages: [],
      resolutionNote: "",
      timeline: [
        { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
        { status: "Acknowledged", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22) }
      ],
      authorId: "user-abhyudaya",
      comments: [
        { authorId: "user-karan", text: "This has been building up for two weeks. Needs immediate collection." },
        { authorId: "user-simran", text: "Contacted local council last Tuesday but no action taken yet." }
      ]
    },
    {
      id: 2,
      title: "open waste burning causing the smoke",
      location: "Punjab",
      subLocation: "LUDHIANA",
      description: "Dry leaves and plastic waste being burned in the open field opposite the public school, causing severe smoke and breathing difficulties.",
      images: [],
      imageType: "burning",
      upvotes: 28,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      status: "Review Queue",
      internalNotes: "",
      resolutionImages: [],
      resolutionNote: "",
      timeline: [
        { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12) }
      ],
      authorId: "user",
      comments: [
        { authorId: "user-amrit", text: "This happens every evening around 5 PM. It's a major health hazard." }
      ]
    },
    {
      id: 3,
      title: "Unclogged drain overflowing onto main road",
      location: "Punjab",
      subLocation: "PATIALA",
      description: "Monsoon clogging in the sewer drainage system leading to wastewater overflowing onto the public street, creating a traffic bottleneck and hygiene issue.",
      images: [],
      imageType: "water",
      upvotes: 15,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
      status: "In Progress",
      internalNotes: "Contracted plumbing team dispatched to clear blockages.",
      resolutionImages: [],
      resolutionNote: "",
      timeline: [
        { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6) },
        { status: "Acknowledged", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) },
        { status: "In Progress", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4) }
      ],
      authorId: "user-nishant",
      comments: []
    },
    {
      id: 4,
      title: "Hazardous chemical leakage in industrial park",
      location: "Punjab",
      subLocation: "LUDHIANA",
      description: "Chemical containers leaking near the storm drain in sector 4. Corrosive fluid pooling on the ground.",
      images: [],
      imageType: "default",
      upvotes: 65,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      status: "Resolved",
      internalNotes: "Hazardous response team dispatched. Sealed leak and neutralised soil.",
      resolutionImages: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60"],
      resolutionNote: "Our chemical containment team successfully sealed the containers and cleaned up the spill using absorbent sand. The storm drain was verified clean.",
      timeline: [
        { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
        { status: "Acknowledged", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46) },
        { status: "In Progress", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 40) },
        { status: "Resolved", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) }
      ],
      authorId: "officer",
      comments: [
        { authorId: "user-rajesh", text: "Reported this to safety officer yesterday." }
      ]
    },
    {
      id: 5,
      title: "Massive pile of garbage dumped next to Sector 70 park",
      location: "Punjab",
      subLocation: "SAS NAGAR",
      description: "Someone has dumped a huge pile of domestic waste and plastic packages right at the entrance of Sector 70 public park. It is attracting stray dogs and flies, creating an extremely unhygienic environment for children.",
      images: ["/media/issues/garbage dumping.jpeg"],
      imageType: "dumping",
      upvotes: 18,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
      status: "Review Queue",
      internalNotes: "",
      resolutionImages: [],
      resolutionNote: "",
      timeline: [
        { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18) }
      ],
      authorId: "user-amrit",
      comments: [
        { authorId: "user-simran", text: "This is horrible, we need this cleared before the weekend." },
        { authorId: "user-karan", text: "I saw a commercial mini-truck dumping this last night. We need CCTV cameras here." }
      ]
    },
    {
      id: 6,
      title: "Unauthorised mass cutting of trees along Phase 7 boundary wall",
      location: "Punjab",
      subLocation: "SAS NAGAR",
      description: "Several healthy neem and eucalyptus trees are being cut down along the boundary wall of Phase 7 without any municipal authorization or notices. Please investigate immediately.",
      images: ["/media/issues/tree mass cut.jpeg"],
      imageType: "default",
      upvotes: 35,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
      status: "In Progress",
      internalNotes: "Forestry officer dispatched. Work has been temporarily halted pending permit verification.",
      resolutionImages: [],
      resolutionNote: "",
      timeline: [
        { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4) },
        { status: "Acknowledged", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3) },
        { status: "In Progress", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) }
      ],
      authorId: "user-karan",
      comments: [
        { authorId: "user-abhyudaya", text: "This is illegal! Thank you for raising this." },
        { authorId: "user-nishant", text: "Forestry dept needs to check this." }
      ]
    },
    {
      id: 7,
      title: "Blocked storm drain causing water accumulation in Sector 62",
      location: "Punjab",
      subLocation: "SAS NAGAR",
      description: "A storm drain is completely clogged with plastic bottles and dry leaves near Sector 62 main junction. Rainwater has accumulated, forming a large pool that blocks traffic.",
      images: ["/media/issues/water.jpeg"],
      imageType: "water",
      upvotes: 45,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      status: "Resolved",
      internalNotes: "Drainage team cleared the blockage using suction machines. Verified clean.",
      resolutionImages: ["/media/issues/water2.jpeg"],
      resolutionNote: "Our maintenance team unclogged the municipal storm drain and drained all accumulated water. Flow is now fully restored.",
      timeline: [
        { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
        { status: "Acknowledged", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46) },
        { status: "In Progress", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 40) },
        { status: "Resolved", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) }
      ],
      authorId: "user-simran",
      comments: [
        { authorId: "user-karan", text: "Water is slowly entering the ground floor shops." }
      ]
    },
    {
      id: 8,
      title: "Tree branches hanging dangerously low over Sector 71 road",
      location: "Punjab",
      subLocation: "SAS NAGAR",
      description: "A large branch of a mango tree is hanging low over the Sector 71 secondary road, posing a hazard for high trucks.",
      images: ["/media/issues/tress cut.jpeg"],
      imageType: "default",
      upvotes: 5,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
      status: "Rejected",
      rejectionReason: "The tree is located inside private property, not on municipal land. The owner has been notified to trim the branches.",
      rejectedAt: new Date(Date.now() - 1000 * 60 * 60 * 10),
      resolutionImages: [],
      resolutionNote: "",
      timeline: [
        { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20) },
        { status: "Rejected", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10) }
      ],
      authorId: "user-abhyudaya",
      comments: []
    },
    {
      id: 9,
      title: "Commercial waste dumping behind Sector 55 market",
      location: "Punjab",
      subLocation: "SAS NAGAR",
      description: "Large wooden crates and packaging plastic from retail shops are dumped behind Sector 55 market daily, blocking the fire escape.",
      images: ["/media/issues/garbage dumping.jpeg"],
      imageType: "dumping",
      upvotes: 12,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      status: "Pending Review",
      rejectionReason: "Considered minor littering. Advised local merchants association.",
      rejectedAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
      appealMessage: "This is NOT minor littering! It completely blocks the fire exit of three major shops. This is a critical safety hazard. Please check the photos again.",
      additionalImages: ["/media/issues/garbage.jpeg"],
      appealedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      resolutionImages: [],
      resolutionNote: "",
      timeline: [
        { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
        { status: "Rejected", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36) },
        { status: "Pending Review", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) }
      ],
      authorId: "user-amrit",
      comments: []
    },
    {
      id: 10,
      title: "Pothole leakage causing muddy street in Sector 68",
      location: "Punjab",
      subLocation: "SAS NAGAR",
      description: "A broken waterline under the main Sector 68 street is bubbling up water, creating a large muddy pothole. It is dangerous for two-wheelers and ruins road quality.",
      images: ["/media/issues/water.jpeg"],
      imageType: "water",
      upvotes: 14,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      status: "Review Queue",
      internalNotes: "",
      resolutionImages: [],
      resolutionNote: "",
      timeline: [
        { status: "Review Queue", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) }
      ],
      authorId: "user-nishant",
      comments: []
    }
  ]

  for (const issue of issuesData) {
    const authorId = userMap.get(authorIdMapping[issue.authorId] || issue.authorId)
    if (!authorId) {
      console.warn(`No author mapping for ${issue.authorId}`)
      continue
    }

    const createdReport = await prisma.report.create({
      data: {
        id: issue.id,
        title: issue.title,
        location: issue.location,
        subLocation: issue.subLocation,
        description: issue.description,
        images: issue.images,
        imageType: issue.imageType,
        upvotes: issue.upvotes,
        createdAt: issue.createdAt,
        status: issue.status,
        internalNotes: issue.internalNotes,
        resolutionImages: issue.resolutionImages,
        resolutionNote: issue.resolutionNote || null,
        rejectionReason: issue.rejectionReason || null,
        rejectedAt: issue.rejectedAt || null,
        appealMessage: issue.appealMessage || null,
        additionalImages: issue.additionalImages,
        appealedAt: issue.appealedAt || null,
        latitude: 30.7333, // default center lat
        longitude: 76.7794, // default center lng
        isAnonymous: false,
        authorId: authorId,
      }
    })

    // Seed timeline events
    for (const t of issue.timeline) {
      await prisma.timelineEvent.create({
        data: {
          reportId: createdReport.id,
          status: t.status,
          timestamp: t.timestamp
        }
      })
    }

    // Seed comments
    for (const c of issue.comments) {
      const commenterId = userMap.get(authorIdMapping[c.authorId] || c.authorId)
      if (commenterId) {
        await prisma.comment.create({
          data: {
            reportId: createdReport.id,
            authorId: commenterId,
            text: c.text,
          }
        })
      }
    }
  }
  console.log(`Seeded reports, comments, and timeline events.`)

  // 3. Seed Notices
  const noticesData = [
    {
      title: "Air Quality Advisory - PM2.5 Alert",
      description: "Due to seasonal stubble burning and low wind speeds, air quality in Ludhiana has dropped to 'Poor'. Senior citizens and children are advised to limit outdoor exposure.",
      location: "Punjab",
      subLocation: "LUDHIANA",
      type: "Warning",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      authorId: "officer" // officer of Ludhiana
    },
    {
      title: "Cleanliness Drive: Sector 32",
      description: "The Municipal Corporation is organizing a community waste cleaning and sorting drive this Sunday. Cleanup tools and refreshments will be provided.",
      location: "Punjab",
      subLocation: "SAS NAGAR",
      type: "Drive / Campaign",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      authorId: "municipal" // officer of SAS NAGAR
    }
  ]

  for (const n of noticesData) {
    const authorId = userMap.get(authorIdMapping[n.authorId] || n.authorId)
    if (authorId) {
      await prisma.notice.create({
        data: {
          title: n.title,
          description: n.description,
          location: n.location,
          subLocation: n.subLocation,
          type: n.type,
          createdAt: n.createdAt,
          expiryDate: n.expiryDate,
          authorId: authorId,
        }
      })
    }
  }
  console.log(`Seeded notices.`)

  // 4. Seed some follows and upvotes for user
  const mainUser = userMap.get('user1')
  if (mainUser) {
    // Follow Issue 4, 6, 7, 9, 10
    const followedIssues = [4, 6, 7, 9, 10]
    for (const reportId of followedIssues) {
      await prisma.reportFollow.create({
        data: {
          userId: mainUser,
          reportId: reportId
        }
      })
    }
  }

  console.log("Seeding complete successfully!")
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
