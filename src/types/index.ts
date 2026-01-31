import { Contact, Group, Activity, Interaction, InteractionType } from '@prisma/client'

// Contact with relations
export type ContactWithRelations = Contact & {
  groups: { group: Group }[]
  activities: { activity: Activity }[]
  interactions: { interaction: Interaction }[]
}

// For creating/updating contacts
export type ContactInput = {
  name: string
  birthday?: Date | null
  phone?: string | null
  email?: string | null
  location?: string | null
  job?: string | null
  company?: string | null
  socials?: Record<string, string> | null
  photoUrl?: string | null
  howWeMet?: string | null
  pronouns?: string | null
  notes?: string | null
  groupIds?: string[]
  activityIds?: string[]
}

// For creating interactions
export type InteractionInput = {
  date: Date
  type: InteractionType
  note?: string | null
  contactIds: string[]
}

// Reconnect view item
export type ReconnectContact = ContactWithRelations & {
  relationshipScore: number
  daysSinceLastInteraction: number | null
  lastInteractionDate: Date | null
}

// Filter options
export type ContactFilters = {
  groupId?: string
  activityId?: string
  archived?: boolean
  search?: string
}

export { InteractionType }
