'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/Navigation'

// For demo purposes - in production this would come from auth
const DEMO_USER_ID = 'demo'

type Activity = {
  id: string
  name: string
  emoji: string | null
  _count: { contacts: number }
}

const EMOJIS = ['☕', '🥾', '🎲', '🎬', '🎾', '🍽️', '🎮', '📚', '🏋️', '🎵', '✈️', '🍺', '🧘', '🎨', '🏊', '⚽']

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [formData, setFormData] = useState({ name: '', emoji: EMOJIS[0] })
  const [saving, setSaving] = useState(false)

  // Fetch activities
  useEffect(() => {
    fetchActivities()
  }, [])

  async function fetchActivities() {
    try {
      const res = await fetch(`/api/activities?userId=${DEMO_USER_ID}`)
      if (res.ok) {
        const data = await res.json()
        setActivities(data)
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  function openCreateModal() {
    setEditingActivity(null)
    setFormData({ name: '', emoji: EMOJIS[0] })
    setShowModal(true)
  }

  function openEditModal(activity: Activity) {
    setEditingActivity(activity)
    setFormData({ name: activity.name, emoji: activity.emoji || EMOJIS[0] })
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      if (editingActivity) {
        // Update
        const res = await fetch(`/api/activities/${editingActivity.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, userId: DEMO_USER_ID }),
        })
        if (res.ok) {
          fetchActivities()
          setShowModal(false)
        }
      } else {
        // Create
        const res = await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, userId: DEMO_USER_ID }),
        })
        if (res.ok) {
          fetchActivities()
          setShowModal(false)
        }
      }
    } catch (error) {
      console.error('Error saving activity:', error)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(activity: Activity) {
    if (!confirm(`Delete "${activity.name}"? This will remove it from all contacts.`)) {
      return
    }

    try {
      const res = await fetch(`/api/activities/${activity.id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchActivities()
      }
    } catch (error) {
      console.error('Error deleting activity:', error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Activities</h1>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + New Activity
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading...</div>
        ) : activities.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-slate-200 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No activities yet</h2>
            <p className="text-slate-500 mb-6">
              Create activities to tag contacts with shared interests (e.g., Coffee, Hiking, Board Games).
            </p>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Create Your First Activity
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl">
                      {activity.emoji || '🎯'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{activity.name}</h3>
                      <p className="text-sm text-slate-500">
                        {activity._count.contacts} contact{activity._count.contacts !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(activity)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(activity)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editingActivity ? 'Edit Activity' : 'New Activity'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Coffee, Hiking, Board Games"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Emoji
                </label>
                <div className="flex gap-2 flex-wrap">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, emoji })}
                      className={`w-10 h-10 rounded-lg text-xl transition-all ${
                        formData.emoji === emoji 
                          ? 'bg-blue-100 ring-2 ring-blue-400' 
                          : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  {saving ? 'Saving...' : editingActivity ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
