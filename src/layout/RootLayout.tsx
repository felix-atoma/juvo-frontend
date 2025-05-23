import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">JUVO Health Assistant</h1>
      </header>
      <main className="container mx-auto p-4 flex-1">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white p-4">
        <p>© {new Date().getFullYear()} JUVO Health</p>
      </footer>
    </div>
  )
}