import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F6FA] text-[#141320] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <span className="text-7xl font-extrabold tracking-tight bg-gradient-to-r from-[#2B2644] to-[#C5CBE8] bg-clip-text text-transparent">
          404
        </span>
        <h1 className="text-2xl font-semibold text-[#141320] mt-4 mb-2">Page Not Found</h1>
        <p className="text-sm text-[#64677A] mb-8 leading-relaxed">
          The requested campus route does not exist. Use the shortcuts below to return to the interactive showcase.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/">
            <Button variant="outline" size="md" iconLeft={<ArrowLeft className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/app">
            <Button variant="primary" size="md" iconLeft={<Compass className="w-4 h-4" />}>
              Open Portal
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
