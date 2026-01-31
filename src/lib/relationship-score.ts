import { Contact, Interaction } from '@prisma/client'

type ContactWithInteractions = Contact & {
  interactions: { interaction: Interaction }[]
}

/**
 * Calculate relationship score (0-100) based on:
 * - Profile completeness (0-50 points)
 * - Interaction recency (0-30 points)
 * - Interaction frequency in last 180 days (0-20 points)
 */
export function calculateRelationshipScore(contact: ContactWithInteractions): number {
  const completenessScore = calculateCompletenessScore(contact)
  const recencyScore = calculateRecencyScore(contact.interactions)
  const frequencyScore = calculateFrequencyScore(contact.interactions)
  
  return Math.round(completenessScore + recencyScore + frequencyScore)
}

function calculateCompletenessScore(contact: Contact): number {
  const fields = [
    contact.name,
    contact.birthday,
    contact.phone,
    contact.email,
    contact.location,
    contact.job,
    contact.company,
    contact.photoUrl,
    contact.howWeMet,
    contact.notes,
  ]
  
  const filledFields = fields.filter(f => f !== null && f !== undefined && f !== '').length
  const maxFields = fields.length
  
  return (filledFields / maxFields) * 50
}

function calculateRecencyScore(interactions: { interaction: Interaction }[]): number {
  if (interactions.length === 0) return 0
  
  const now = new Date()
  const mostRecent = interactions
    .map(i => new Date(i.interaction.date))
    .sort((a, b) => b.getTime() - a.getTime())[0]
  
  const daysSince = Math.floor((now.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24))
  
  // 30 points if seen today, decays to 0 at 180+ days
  if (daysSince <= 0) return 30
  if (daysSince >= 180) return 0
  
  return Math.round(30 * (1 - daysSince / 180))
}

function calculateFrequencyScore(interactions: { interaction: Interaction }[]): number {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  
  const recentInteractions = interactions.filter(
    i => new Date(i.interaction.date) >= sixMonthsAgo
  ).length
  
  // 20 points for 10+ interactions, scales linearly
  if (recentInteractions >= 10) return 20
  
  return Math.round((recentInteractions / 10) * 20)
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Close'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Moderate'
  if (score >= 20) return 'Acquaintance'
  return 'Distant'
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-blue-600'
  if (score >= 40) return 'text-yellow-600'
  if (score >= 20) return 'text-orange-600'
  return 'text-gray-500'
}
