import { getScoreLabel, getScoreColor } from '@/lib/relationship-score'

interface RelationshipBadgeProps {
  score: number
  className?: string
}

export function RelationshipBadge({ score, className }: RelationshipBadgeProps) {
  const label = getScoreLabel(score)
  const color = getScoreColor(score)

  return (
    <span 
      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${color} ${className}`}
      title={`Relationship Score: ${score}`}
    >
      {label}
    </span>
  )
}