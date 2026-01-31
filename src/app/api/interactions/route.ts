import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/interactions - Log a new interaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      userId, 
      contactIds, 
      type, 
      date, 
      note 
    } = body

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate input
    if (!contactIds || contactIds.length === 0) {
      return NextResponse.json({ error: 'At least one contact is required' }, { status: 400 })
    }

    const interaction = await prisma.interaction.create({
      data: {
        userId,
        type,
        date: new Date(date || Date.now()),
        note,
        contacts: {
          create: contactIds.map((contactId: string) => ({ contactId }))
        }
      },
      include: {
        contacts: {
          include: {
            contact: true
          }
        }
      }
    })

    return NextResponse.json(interaction, { status: 201 })
  } catch (error) {
    console.error('Error logging interaction:', error)
    return NextResponse.json({ error: 'Failed to log interaction' }, { status: 500 })
  }
}

// GET /api/interactions - Retrieve interactions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const contactId = searchParams.get('contactId')
    const type = searchParams.get('type')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const interactions = await prisma.interaction.findMany({
      where: {
        userId,
        ...(contactId && {
          contacts: { 
            some: { contactId } 
          }
        }),
        ...(type && { type }),
        ...(startDate && endDate && {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        })
      },
      include: {
        contacts: {
          include: {
            contact: true
          }
        }
      },
      orderBy: { 
        date: 'desc' 
      }
    })

    return NextResponse.json(interactions)
  } catch (error) {
    console.error('Error fetching interactions:', error)
    return NextResponse.json({ error: 'Failed to fetch interactions' }, { status: 500 })
  }
}