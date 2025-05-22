import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold mb-6">JUVO Health Assistant</h1>
      <p className="mb-8 text-lg">
        Access basic health advice via USSD or Voice
      </p>
      <div className="space-y-4 max-w-xs mx-auto">
        <Link
          to="/simulate"
          className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Simulate USSD
        </Link>
        <button className="block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 w-full">
          Voice Demo
        </button>
      </div>
    </div>
  )
}