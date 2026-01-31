'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { RelationshipBadge } from '@/components/RelationshipBadge'
import { calculateRelationshipScore } from '@/lib/relationship-score'

export default function DashboardPage() {
  const [contacts, setContacts] = useState([])
  const [stats, setStats] = useState({
    totalContacts: 0,
    recentInteractions: 0,
    contactsToReconnect: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch contacts with recent interactions
        const contactsResponse = await fetch('/api/contacts?reconnect=true&limit=5')
        const contactsData = await contactsResponse.json()
        setContacts(contactsData)

        // Calculate stats
        setStats({
          totalContacts: contactsData.length,
          recentInteractions: contactsData.filter((contact: any) => 
            contact.interactions && contact.interactions.length > 0
          ).length,
          contactsToReconnect: contactsData.filter((contact: any) => 
            !contact.interactions || contact.interactions.length === 0
          ).length
        })

        setIsLoading(false)
      } catch (err) {
        setError(err)
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) return <div>Loading dashboard...</div>
  if (error) return <div>Error loading dashboard</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Relationship Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Total Contacts</h2>
          <p className="text-4xl font-bold text-blue-600">{stats.totalContacts}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Interactions</h2>
          <p className="text-4xl font-bold text-green-600">{stats.recentInteractions}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Contacts to Reconnect</h2>
          <p className="text-4xl font-bold text-orange-600">{stats.contactsToReconnect}</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Contacts to Reconnect</h2>
          <Link 
            href="/contacts" 
            className="text-blue-500 hover:underline"
          >
            View All Contacts
          </Link>
        </div>

        {contacts.length === 0 ? (
          <p>No contacts to reconnect with. Great job staying in touch!</p>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact: any) => (
              <div 
                key={contact.id} 
                className="flex items-center justify-between border-b pb-4 last:border-b-0"
              >
                <div className="flex items-center space-x-4">
                  {contact.photoUrl ? (
                    <img 
                      src={contact.photoUrl} 
                      alt={`${contact.name}'s profile`} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {contact.name ? contact.name.charAt(0) : '?'}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">{contact.name}</h3>
                    {contact.job && contact.company && (
                      <p className="text-sm text-gray-500">
                        {contact.job} @ {contact.company}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <RelationshipBadge 
                    score={calculateRelationshipScore(contact)} 
                  />
                  <Link 
                    href={`/contacts/${contact.id}`} 
                    className="text-blue-500 hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}