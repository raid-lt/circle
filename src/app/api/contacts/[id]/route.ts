import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type RouteParams = { params: Promise<{ id: string }> }

// GET /api/contacts/[id] - Get a single contact
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  
  try {
    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        groups: { include: { group: true } },
        activities: { include: { activity: true } },
        interactions: {
          include: { interaction: true },
          orderBy: { interaction: { date: 'desc' } },
        },
      },
    })

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Error fetching contact:', error)
    return NextResponse.json({ error: 'Failed to fetch contact' }, { status: 500 })
  }
}

// PATCH /api/contacts/[id] - Update a contact
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  
  try {
    const body = await request.json()
    const { groupIds, activityIds, ...contactData } = body

    // Update contact and relations in a transaction
    const contact = await prisma.$transaction(async (tx) => {
      // Update basic contact data
      const updated = await tx.contact.update({
        where: { id },
        data: contactData,
      })

      // Update groups if provided
      if (groupIds !== undefined) {
        await tx.contactGroup.deleteMany({ where: { contactId: id } })
        if (groupIds.length > 0) {
          await tx.contactGroup.createMany({
            data: groupIds.map((groupId: string) => ({ contactId: id, groupId }))
          })
        }
      }

      // Update activities if provided
      if (activityIds !== undefined) {
        await tx.contactActivity.deleteMany({ where: { contactId: id } })
        if (activityIds.length > 0) {
          await tx.contactActivity.createMany({
            data: activityIds.map((activityId: string) => ({ contactId: id, activityId }))
          })
        }
      }

      // Return updated contact with relations
      return tx.contact.findUnique({
        where: { id },
        include: {
          groups: { include: { group: true } },
          activities: { include: { activity: true } },
        },
      })
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 })
  }
}

// DELETE /api/contacts/[id] - Delete a contact
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  
  try {
    await prisma.contact.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 })
  }
}
