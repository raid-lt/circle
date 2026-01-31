'use client'

import { useState } from 'react'
import { prisma } from '@/lib/prisma'
import { Contact } from '@prisma/client'
import { RelationshipBadge } from '@/components/RelationshipBadge'
import { calculateRelationshipScore } from '@/lib/relationship-score'
import Link from 'next/link'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch contacts on component mount
  React.useEffect(() => {
    async function fetchContacts() {
      try {
        const response = await fetch('/api/contacts')
        if (!response.ok) {
          throw new Error('Failed to fetch contacts')
        }
        const data = await response.json()
        setContacts(data)
        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        setIsLoading(false)
      }
    }

    fetchContacts()
  }, [])

  if (isLoading) return <div>Loading contacts...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Contacts</h1>
      
      <Link 
        href="/contacts/new" 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6 inline-block"
      >
        Add New Contact
      </Link>

      {contacts.length === 0 ? (
        <p>No contacts found. Add your first contact!</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <div 
              key={contact.id} 
              className="bg-white shadow rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-center space-x-4">
                {contact.photoUrl ? (
                  <img 
                    src={contact.photoUrl} 
                    alt={`${contact.name}'s profile`} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    {contact.name ? contact.name.charAt(0) : '?'}
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold">{contact.name}</h2>
                  <div className="text-sm text-gray-500 space-x-2">
                    {contact.job && <span>{contact.job}</span>}
                    {contact.company && <span>@ {contact.company}</span>}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <Link 
                  href={`/contacts/${contact.id}`} 
                  className="text-blue-500 hover:underline"
                >
                  View Details
                </Link>
                <RelationshipBadge 
                  score={calculateRelationshipScore(contact as any)} 
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}