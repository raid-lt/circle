'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NewInteractionPage() {
  const [contacts, setContacts] = useState([])
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [type, setType] = useState('CALL')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchContacts() {
      try {
        // TODO: Replace with actual user ID from authentication
        const userId = 'default-user-id'
        
        const response = await fetch(`/api/contacts?userId=${userId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch contacts')
        }
        
        const data = await response.json()
        setContacts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      }
    }

    fetchContacts()
  }, [])

  const handleContactToggle = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (selectedContacts.length === 0) {
      setError('Please select at least one contact')
      return
    }

    try {
      // TODO: Replace with actual user ID from authentication
      const userId = 'default-user-id'

      const response = await fetch('/api/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          contactIds: selectedContacts,
          type,
          date,
          note,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to log interaction')
      }

      // Redirect to interactions page after successful creation
      router.push('/interactions')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Log New Interaction</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="contacts" className="block text-sm font-medium text-gray-700 mb-2">
            Select Contacts
          </label>
          <div className="grid grid-cols-3 gap-2">
            {contacts.map((contact: any) => (
              <button
                key={contact.id}
                type="button"
                onClick={() => handleContactToggle(contact.id)}
                className={`
                  py-2 px-3 rounded-md text-sm 
                  ${selectedContacts.includes(contact.id) 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                `}
              >
                {contact.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Interaction Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="CALL">Call</option>
            <option value="TEXT">Text</option>
            <option value="MET_UP">Met Up</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="Optional notes about the interaction"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Log Interaction
          </button>
        </div>
      </form>
    </div>
  )
}