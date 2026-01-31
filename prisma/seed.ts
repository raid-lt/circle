import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create test user
  const user = await prisma.user.upsert({
    where: { email: 'demo@circle.app' },
    update: {},
    create: {
      email: 'demo@circle.app',
      name: 'Demo User',
    },
  })
  console.log('✓ Created user:', user.name)

  // Create groups
  const groups = await Promise.all([
    prisma.group.create({
      data: { userId: user.id, name: 'Family', color: '#ef4444' },
    }),
    prisma.group.create({
      data: { userId: user.id, name: 'Work', color: '#3b82f6' },
    }),
    prisma.group.create({
      data: { userId: user.id, name: 'College Friends', color: '#22c55e' },
    }),
    prisma.group.create({
      data: { userId: user.id, name: 'Gym Buddies', color: '#f59e0b' },
    }),
    prisma.group.create({
      data: { userId: user.id, name: 'Neighbors', color: '#8b5cf6' },
    }),
  ])
  console.log('✓ Created', groups.length, 'groups')

  // Create activities
  const activities = await Promise.all([
    prisma.activity.create({
      data: { userId: user.id, name: 'Coffee', emoji: '☕' },
    }),
    prisma.activity.create({
      data: { userId: user.id, name: 'Hiking', emoji: '🥾' },
    }),
    prisma.activity.create({
      data: { userId: user.id, name: 'Board Games', emoji: '🎲' },
    }),
    prisma.activity.create({
      data: { userId: user.id, name: 'Movies', emoji: '🎬' },
    }),
    prisma.activity.create({
      data: { userId: user.id, name: 'Tennis', emoji: '🎾' },
    }),
    prisma.activity.create({
      data: { userId: user.id, name: 'Dinner', emoji: '🍽️' },
    }),
  ])
  console.log('✓ Created', activities.length, 'activities')

  // Create contacts
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        userId: user.id,
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        phone: '+1 555-0101',
        location: 'San Francisco, CA',
        job: 'Product Manager',
        company: 'TechCorp',
        howWeMet: 'College roommate',
        birthday: new Date('1992-03-15'),
        notes: 'Loves Thai food and indie music',
        socials: JSON.stringify({ instagram: '@sarahc', linkedin: 'sarahchen' }),
      },
    }),
    prisma.contact.create({
      data: {
        userId: user.id,
        name: 'Marcus Johnson',
        email: 'marcus.j@example.com',
        phone: '+1 555-0102',
        location: 'Oakland, CA',
        job: 'Software Engineer',
        company: 'StartupXYZ',
        howWeMet: 'Work colleague at previous job',
        birthday: new Date('1990-07-22'),
        notes: 'Great at explaining complex topics. Into woodworking.',
      },
    }),
    prisma.contact.create({
      data: {
        userId: user.id,
        name: 'Emily Rodriguez',
        phone: '+1 555-0103',
        location: 'Berkeley, CA',
        howWeMet: 'Met at a hiking meetup',
        notes: 'Training for a marathon',
      },
    }),
    prisma.contact.create({
      data: {
        userId: user.id,
        name: 'James Park',
        email: 'jpark@example.com',
        location: 'San Jose, CA',
        job: 'Data Scientist',
        company: 'BigData Inc',
        howWeMet: 'Friend of Sarah',
        birthday: new Date('1988-11-30'),
      },
    }),
    prisma.contact.create({
      data: {
        userId: user.id,
        name: 'Mom',
        phone: '+1 555-0199',
        birthday: new Date('1965-05-12'),
        notes: 'Call every Sunday!',
      },
    }),
    prisma.contact.create({
      data: {
        userId: user.id,
        name: 'Alex Thompson',
        email: 'alex.t@example.com',
        location: 'Seattle, WA',
        job: 'Designer',
        howWeMet: 'Design conference 2023',
        notes: 'Moving to SF next year',
      },
    }),
  ])
  console.log('✓ Created', contacts.length, 'contacts')

  // Assign contacts to groups
  await Promise.all([
    // Sarah - College Friends, Work
    prisma.contactGroup.create({ data: { contactId: contacts[0].id, groupId: groups[2].id } }),
    prisma.contactGroup.create({ data: { contactId: contacts[0].id, groupId: groups[1].id } }),
    // Marcus - Work, Gym
    prisma.contactGroup.create({ data: { contactId: contacts[1].id, groupId: groups[1].id } }),
    prisma.contactGroup.create({ data: { contactId: contacts[1].id, groupId: groups[3].id } }),
    // Emily - Gym
    prisma.contactGroup.create({ data: { contactId: contacts[2].id, groupId: groups[3].id } }),
    // James - College Friends
    prisma.contactGroup.create({ data: { contactId: contacts[3].id, groupId: groups[2].id } }),
    // Mom - Family
    prisma.contactGroup.create({ data: { contactId: contacts[4].id, groupId: groups[0].id } }),
    // Alex - Work
    prisma.contactGroup.create({ data: { contactId: contacts[5].id, groupId: groups[1].id } }),
  ])
  console.log('✓ Assigned contacts to groups')

  // Assign contacts to activities
  await Promise.all([
    // Sarah - Coffee, Movies
    prisma.contactActivity.create({ data: { contactId: contacts[0].id, activityId: activities[0].id } }),
    prisma.contactActivity.create({ data: { contactId: contacts[0].id, activityId: activities[3].id } }),
    // Marcus - Board Games, Tennis
    prisma.contactActivity.create({ data: { contactId: contacts[1].id, activityId: activities[2].id } }),
    prisma.contactActivity.create({ data: { contactId: contacts[1].id, activityId: activities[4].id } }),
    // Emily - Hiking
    prisma.contactActivity.create({ data: { contactId: contacts[2].id, activityId: activities[1].id } }),
    // James - Coffee, Board Games
    prisma.contactActivity.create({ data: { contactId: contacts[3].id, activityId: activities[0].id } }),
    prisma.contactActivity.create({ data: { contactId: contacts[3].id, activityId: activities[2].id } }),
    // Alex - Coffee, Dinner
    prisma.contactActivity.create({ data: { contactId: contacts[5].id, activityId: activities[0].id } }),
    prisma.contactActivity.create({ data: { contactId: contacts[5].id, activityId: activities[5].id } }),
  ])
  console.log('✓ Assigned contacts to activities')

  // Create some interactions
  const now = new Date()
  await Promise.all([
    // Recent interaction with Sarah
    prisma.interaction.create({
      data: {
        userId: user.id,
        date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        type: 'MET_UP',
        note: 'Coffee at Blue Bottle',
        contacts: { create: { contactId: contacts[0].id } },
      },
    }),
    // Week-old interaction with Marcus
    prisma.interaction.create({
      data: {
        userId: user.id,
        date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        type: 'MET_UP',
        note: 'Tennis at the park',
        contacts: { create: { contactId: contacts[1].id } },
      },
    }),
    // Old interaction with Emily - needs reconnect
    prisma.interaction.create({
      data: {
        userId: user.id,
        date: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
        type: 'TEXT',
        note: 'Planned hiking trip but had to cancel',
        contacts: { create: { contactId: contacts[2].id } },
      },
    }),
    // Called Mom yesterday
    prisma.interaction.create({
      data: {
        userId: user.id,
        date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // Yesterday
        type: 'CALL',
        note: 'Weekly Sunday call',
        contacts: { create: { contactId: contacts[4].id } },
      },
    }),
  ])
  console.log('✓ Created interactions')

  console.log('\n✨ Seed completed!')
  console.log('\nDemo user email: demo@circle.app')
  console.log('User ID:', user.id)
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
