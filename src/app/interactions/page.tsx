'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function InteractionsPage() {
  const [interactions, setInteractions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchInteractions() {
      try {
        // TODO: Replace with actual user ID from authentication
        const userId = 'default-user-id'
        
        const response = await fetch(`/api/interactions?userId=${userId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch interactions')
        }
        
        const data = await response.json()
        setInteractions(data)
        setIsLoading(false)
      } catch (err) {
        setError(err)
        setIsLoading(false)
      }
    }

    fetchInteractions()
  }, [])

  if (isLoading) return <div>Loading interactions...</div>
  if (error) return <div>Error loading interactions</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Interactions</h1>
        <Link 
          href="/interactions/new" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Log New Interaction
        </Link>
      </div>

      {interactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No interactions logged yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Start tracking your relationships by logging an interaction
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {interactions.map((interaction: any) => (
            <div 
              key={interaction.id} 
              className="bg-white shadow rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">
                  {interaction.type}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(interaction.date).toLocaleDateString()}
                </span>
              </div>
              
              <div className="mt-2">
                <p className="text-gray-600">{interaction.note}</p>
                
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-sm text-gray-500">With:</span>
                  {interaction.contacts.map((contact: any) => (
                    <span 
                      key={contact.contact.id} 
                      className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                    >
                      {contact.contact.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}