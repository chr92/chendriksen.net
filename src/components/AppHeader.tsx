import Link from 'next/link'

export default function AppHeader() {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">chendriksen</Link>
        <nav>
          <Link href="/work" className="mr-4">Work</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  )
} 
