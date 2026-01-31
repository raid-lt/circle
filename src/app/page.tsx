import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Circle
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Keep track of your relationships. Know who to reconnect with, 
            who&apos;s into what activities, and never let good friendships fade.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="border border-slate-500 hover:border-slate-400 text-slate-300 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-slate-800/50 p-6 rounded-xl">
            <div className="text-3xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Organize Your People
            </h3>
            <p className="text-slate-400">
              Group friends by circles — work, gym, school, hobbies. 
              Tag them with activities they enjoy.
            </p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-xl">
            <div className="text-3xl mb-4">🔄</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Never Lose Touch
            </h3>
            <p className="text-slate-400">
              See who you haven&apos;t connected with in a while. 
              Log interactions to track your relationships.
            </p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-xl">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Find the Right People
            </h3>
            <p className="text-slate-400">
              Planning something? Filter by activity to see who&apos;d be 
              into concerts, climbing, or grabbing a drink.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
