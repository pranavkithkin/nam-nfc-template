import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding NAM Admin database...')

  // ─── Clear existing data ───
  await prisma.socialLink.deleteMany()
  await prisma.card.deleteMany()
  await prisma.company.deleteMany()
  await prisma.user.deleteMany()

  // ─── Users ───
  const adminPassword = await bcrypt.hash('admin1234', 10)
  const editorPassword = await bcrypt.hash('editor1234', 10)

  await prisma.user.createMany({
    data: [
      {
        email: 'admin@namuae.com',
        password: adminPassword,
        name: 'NAM Admin',
        role: 'SUPER_ADMIN',
      },
      {
        email: 'editor@namuae.com',
        password: editorPassword,
        name: 'NAM Editor',
        role: 'EDITOR',
      },
    ],
  })
  console.log('✅ Users seeded')

  // ─── Companies ───
  const apexVentures = await prisma.company.create({
    data: {
      name: 'Apex Ventures',
      industry: 'Investment & Asset Management',
      description:
        'A Dubai-based investment firm specialising in real estate, logistics, and high-growth tech startups across the GCC.',
      address: 'Office 2204, DIFC Gate Building, Dubai, UAE',
      mapUrl: 'https://maps.google.com/?q=DIFC+Dubai',
      website: 'https://apexventures.ae',
    },
  })

  const blueskyCreative = await prisma.company.create({
    data: {
      name: 'BlueSky Creative',
      industry: 'Branding & Digital Marketing',
      description:
        'Award-winning creative agency delivering brand identity, digital campaigns, and immersive experiences for luxury brands.',
      address: 'Unit 7, d3 Design District, Dubai, UAE',
      mapUrl: 'https://maps.google.com/?q=d3+Design+District+Dubai',
      website: 'https://blueskycreative.ae',
    },
  })
  console.log('✅ Companies seeded')

  // ─── Cards ───
  await prisma.card.create({
    data: {
      slug: 'sarah-alrashidi',
      status: 'ACTIVE',
      name: 'Sarah Al-Rashidi',
      title: 'Chief Executive Officer',
      bio: 'Driving sustainable growth across the GCC through strategic investments in people, technology, and opportunity.',
      phone: '+971 50 234 5678',
      email: 'sarah@apexventures.ae',
      website: 'https://apexventures.ae',
      location: 'DIFC, Dubai, UAE',
      colorPrimary: '#0a1628',
      colorSecondary: '#111d33',
      colorAccent: '#d4a853',
      colorAccentHover: '#f0c56e',
      companyId: apexVentures.id,
      socialLinks: {
        create: [
          { platform: 'linkedin', url: 'https://linkedin.com/in/sarah-alrashidi', label: 'LinkedIn', order: 0 },
          { platform: 'instagram', url: 'https://instagram.com/sarah.alrashidi', label: 'Instagram', order: 1 },
          { platform: 'whatsapp', url: 'https://wa.me/971502345678', label: 'WhatsApp', order: 2 },
          { platform: 'twitter', url: 'https://x.com/sarah_alrashidi', label: 'X / Twitter', order: 3 },
        ],
      },
    },
  })

  await prisma.card.create({
    data: {
      slug: 'omar-khalid',
      status: 'ACTIVE',
      name: 'Omar Khalid',
      title: 'Director of Sales',
      bio: 'Building partnerships and unlocking new markets across MENA with a decade of deal-making experience.',
      phone: '+971 55 987 6543',
      email: 'omar@apexventures.ae',
      website: 'https://apexventures.ae',
      location: 'DIFC, Dubai, UAE',
      colorPrimary: '#0a1628',
      colorSecondary: '#111d33',
      colorAccent: '#d4a853',
      colorAccentHover: '#f0c56e',
      companyId: apexVentures.id,
      socialLinks: {
        create: [
          { platform: 'linkedin', url: 'https://linkedin.com/in/omarkhalid', label: 'LinkedIn', order: 0 },
          { platform: 'whatsapp', url: 'https://wa.me/971559876543', label: 'WhatsApp', order: 1 },
          { platform: 'facebook', url: 'https://facebook.com/omarkhalid', label: 'Facebook', order: 2 },
        ],
      },
    },
  })

  await prisma.card.create({
    data: {
      slug: 'lina-jaber',
      status: 'DRAFT',
      name: 'Lina Jaber',
      title: 'Creative Director',
      bio: 'Crafting visual narratives that captivate audiences and elevate brands from concept to iconic.',
      phone: '+971 52 111 2233',
      email: 'lina@blueskycreative.ae',
      website: 'https://blueskycreative.ae',
      location: 'd3 Design District, Dubai, UAE',
      colorPrimary: '#0d1117',
      colorSecondary: '#161b22',
      colorAccent: '#58a6ff',
      colorAccentHover: '#79c0ff',
      companyId: blueskyCreative.id,
      socialLinks: {
        create: [
          { platform: 'instagram', url: 'https://instagram.com/linajaber.design', label: 'Instagram', order: 0 },
          { platform: 'behance', url: 'https://behance.net/linajaber', label: 'Behance', order: 1 },
          { platform: 'linkedin', url: 'https://linkedin.com/in/linajaber', label: 'LinkedIn', order: 2 },
        ],
      },
    },
  })

  console.log('✅ Cards seeded (3 cards across 2 companies)')
  console.log('\n🎉 Seed complete!\n')
  console.log('  Login credentials:')
  console.log('  Super Admin → admin@namuae.com   / admin1234')
  console.log('  Editor      → editor@namuae.com  / editor1234\n')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
