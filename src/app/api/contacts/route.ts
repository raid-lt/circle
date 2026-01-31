import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/contacts - List all contacts
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') // TODO: Get from auth
  const groupId = searchParams.get('groupId')
  const activityId = searchParams.get('activityId')
  const search = searchParams.get('search')
  const archived = searchParams.get('archived') === 'true'
  const reconnect = searchParams.get('reconnect') === 'true'

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const contacts = await prisma.contact.findMany({
      where: {
        userId,
        archived,
        ...(groupId && {
          groups: { some: { groupId } }
        }),
        ...(activityId && {
          activities: { some: { activityId } }
        }),
        ...(search && {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { notes: { contains: search } },
          ]
        }),
      },
      include: {
        groups: { include: { group: true } },
        activities: { include: { activity: true } },
        interactions: {
          include: { interaction: true },
          orderBy: { interaction: { date: 'desc' } },
          take: 1,
        },
      },
      orderBy: { name: 'asc' },
    })

    // If reconnect filter, sort by days since last interaction
    if (reconnect) {
      const now = new Date()
      contacts.sort((a, b) => {
        const aLastInteraction = a.interactions[0]?.interaction.date
        const bLastInteraction = b.interactions[0]?.interaction.date
        
        if (!aLastInteraction && !bLastInteraction) return 0
        if (!aLastInteraction) return -1
        if (!bLastInteraction) return 1
        
        return new Date(aLastInteraction).getTime() - new Date(bLastInteraction).getTime()
      })
    }

    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
  }
}

// POST /api/contacts - Create a new contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, groupIds, activityIds, ...contactData } = body

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contact = await prisma.contact.create({
      data: {
        ...contactData,
        userId,
        groups: groupIds?.length ? {
          create: groupIds.map((groupId: string) => ({ groupId }))
        } : undefined,
        activities: activityIds?.length ? {
          create: activityIds.map((activityId: string) => ({ activityId }))
        } : undefined,
      },
      include: {
        groups: { include: { group: true } },
        activities: { include: { activity: true } },
      },
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 })
  }
}
