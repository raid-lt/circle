import Link from 'next/link'

type Contact = {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  location?: string | null
  job?: string | null
  company?: string | null
  photoUrl?: string | null
  groups?: { group: { id: string; name: string; color?: string | null } }[]
  activities?: { activity: { id: string; name: string; emoji?: string | null } }[]
  interactions?: { interaction: { date: string | Date } }[]
}

export function ContactCard({ contact }: { contact: Contact }) {
  const lastInteraction = contact.interactions?.[0]?.interaction
  const daysSinceContact = lastInteraction 
    ? Math.floor((Date.now() - new Date(lastInteraction.date).getTime()) / (1000 * 60 * 60 * 24))
    : null

  const needsReconnect = daysSinceContact !== null && daysSinceContact > 30

  // Generate initials for avatar
  const initials = contact.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Link
      href={`/contacts/${contact.id}`}
      className="block bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium flex-shrink-0">
          {contact.photoUrl ? (
            <img
              src={contact.photoUrl}
              alt={contact.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 truncate">{contact.name}</h3>
            {needsReconnect && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                🔄 {daysSinceContact}d ago
              </span>
            )}
          </div>

          {/* Subtitle */}
          {(contact.job || contact.company) && (
            <p className="text-sm text-slate-500 truncate">
              {contact.job}{contact.job && contact.company && ' at '}{contact.company}
            </p>
          )}

          {/* Contact info */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-600">
            {contact.email && (
              <span className="truncate">📧 {contact.email}</span>
            )}
            {contact.phone && (
              <span className="whitespace-nowrap">📱 {contact.phone}</span>
            )}
            {contact.location && (
              <span className="truncate">📍 {contact.location}</span>
            )}
          </div>

          {/* Groups & Activities */}
          <div className="flex flex-wrap gap-2 mt-3">
            {contact.groups?.slice(0, 3).map(({ group }) => (
              <span
                key={group.id}
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  backgroundColor: group.color ? `${group.color}20` : '#e2e8f0',
                  color: group.color || '#475569',
                }}
              >
                {group.name}
              </span>
            ))}
            {contact.activities?.slice(0, 3).map(({ activity }) => (
              <span
                key={activity.id}
                className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600"
              >
                {activity.emoji} {activity.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
