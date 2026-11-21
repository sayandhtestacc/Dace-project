import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  ThumbsUp,
  Clock,
  ArrowRight,
  X,
  AlertCircle,
  CheckCircle,
  EyeOff,
} from 'lucide-react'
import { useStore } from '@/data/store'
import type { ComplaintCategory, ComplaintStatus } from '@/data/types'
import { relativeTime } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { useToast } from '@/components/ui/Toast'

export default function ComplaintsList() {
  const { complaints, upvoteComplaint, currentStudentId } = useStore()
  const { success } = useToast()

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'resolved'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory | 'all'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'upvotes'>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const categories: (ComplaintCategory | 'all')[] = ['all', 'Technical', 'Hostel', 'Academic', 'Mess', 'Other']

  // Filter complaints
  const filtered = complaints.filter((c) => {
    // Tab filter
    if (activeTab === 'active' && c.status === 'Resolved') return false
    if (activeTab === 'resolved' && c.status !== 'Resolved') return false

    // Category filter
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchTitle = c.title.toLowerCase().includes(q)
      const matchRef = c.refId.toLowerCase().includes(q)
      const matchDesc = c.description.toLowerCase().includes(q)
      if (!matchTitle && !matchRef && !matchDesc) return false
    }

    return true
  })

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return b.createdAt - a.createdAt
    if (sortBy === 'oldest') return a.createdAt - b.createdAt
    if (sortBy === 'upvotes') return b.upvotes - a.upvotes
    return 0
  })

  const handleUpvote = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    upvoteComplaint(id)
    success('Upvoted complaint (+1)')
  }

  const activeFilterCount = (selectedCategory !== 'all' ? 1 : 0) + (searchQuery ? 1 : 0)

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1">
            Module A · Grievance Redressal
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#141320] tracking-tight">
            Complaint Tracker
          </h1>
          <p className="text-xs sm:text-sm text-[#64677A] mt-1">
            Report technical faults, hostel repairs, and campus services with transparent status timelines.
          </p>
        </div>

        <Link to="/app/complaints/new">
          <Button variant="primary" size="md" iconLeft={<Plus className="w-4 h-4" />}>
            File New Complaint
          </Button>
        </Link>
      </div>

      {/* Control Bar: Tabs, Search, Sort, View Toggle */}
      <div className="bg-white p-4 sm:p-5 rounded-[24px] border border-[rgba(43,38,68,0.08)] shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Tabs */}
          <Tabs
            tabs={[
              { id: 'all', label: 'All Issues', count: complaints.length },
              {
                id: 'active',
                label: 'Active',
                count: complaints.filter((c) => c.status !== 'Resolved').length,
              },
              {
                id: 'resolved',
                label: 'Resolved',
                count: complaints.filter((c) => c.status === 'Resolved').length,
              },
            ]}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as any)}
          />

          {/* Search Bar & Grid/List */}
          <div className="flex items-center gap-3 flex-1 lg:max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#64677A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keyword or ref (e.g. CMP-A7F3E1)..."
                className="w-full h-10 pl-10 pr-4 text-xs rounded-full bg-[#F5F6FA] border border-[rgba(43,38,68,0.08)] text-[#141320] outline-none focus:border-[#2B2644]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64677A] hover:text-[#141320]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-10 px-3 text-xs rounded-full bg-[#F5F6FA] border border-[rgba(43,38,68,0.08)] text-[#141320] outline-none"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="upvotes">Most upvoted</option>
            </select>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center p-1 bg-[#F5F6FA] rounded-full border border-[rgba(43,38,68,0.08)]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-xs text-[#2B2644]' : 'text-[#64677A]'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-full transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-xs text-[#2B2644]' : 'text-[#64677A]'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills & Active Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[rgba(43,38,68,0.06)]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#64677A] uppercase mr-1">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs rounded-full transition-all capitalize font-medium ${
                  selectedCategory === cat
                    ? 'bg-[#2B2644] text-white'
                    : 'bg-[#F5F6FA] text-[#64677A] hover:bg-[rgba(43,38,68,0.08)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSearchQuery('')
              }}
              className="text-xs text-red-600 hover:underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Complaints List / Grid */}
      {sorted.length === 0 ? (
        <Card variant="elevated" className="p-12 text-center">
          <AlertCircle className="w-12 h-12 text-[#64677A]/40 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#141320]">No complaints found</h3>
          <p className="text-xs text-[#64677A] mt-1 max-w-sm mx-auto">
            No complaints match your active filter criteria. Try resetting filters or raise a new request.
          </p>
          <Link to="/app/complaints/new" className="mt-4 inline-block">
            <Button variant="primary" size="sm" iconLeft={<Plus className="w-4 h-4" />}>
              File Complaint
            </Button>
          </Link>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map((c) => (
            <Link key={c.id} to={`/app/complaints/${c.id}`} className="block group">
              <Card
                variant="elevated"
                className="p-5 h-full flex flex-col justify-between group-hover:border-[#2B2644]/30"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-medium text-[#64677A]">
                      {c.refId}
                    </span>
                    <Badge
                      variant={
                        c.status === 'Resolved'
                          ? 'success'
                          : c.status === 'In Progress'
                          ? 'warning'
                          : c.status === 'Assigned'
                          ? 'info'
                          : 'purple'
                      }
                      pulse={c.status === 'In Progress'}
                    >
                      {c.status}
                    </Badge>
                  </div>

                  <h3 className="text-sm font-semibold text-[#141320] group-hover:text-[#2B2644] transition-colors line-clamp-2">
                    {c.title}
                  </h3>
                  <p className="text-xs text-[#64677A] mt-2 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[rgba(43,38,68,0.06)] flex items-center justify-between text-[11px] text-[#64677A]">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#F5F6FA] font-medium text-[#2B2644]">
                      {c.category}
                    </span>
                    {c.isAnonymous && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-full">
                        <EyeOff className="w-3 h-3" /> Anon
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => handleUpvote(e, c.id)}
                      className="flex items-center gap-1 text-xs hover:text-[#2B2644] transition-colors"
                      title="Upvote issue"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{c.upvotes}</span>
                    </button>
                    <span>{relativeTime(c.createdAt)}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-[24px] border border-[rgba(43,38,68,0.08)] overflow-hidden shadow-xs divide-y divide-[rgba(43,38,68,0.06)]">
          {sorted.map((c) => (
            <Link
              key={c.id}
              to={`/app/complaints/${c.id}`}
              className="flex items-center justify-between p-4 hover:bg-[#F5F6FA] transition-colors group"
            >
              <div className="flex items-center gap-4 flex-1 pr-4">
                <span className="text-xs font-mono text-[#64677A] shrink-0 w-24">
                  {c.refId}
                </span>
                <Badge
                  variant={
                    c.status === 'Resolved'
                      ? 'success'
                      : c.status === 'In Progress'
                      ? 'warning'
                      : c.status === 'Assigned'
                      ? 'info'
                      : 'purple'
                  }
                  pulse={c.status === 'In Progress'}
                  className="shrink-0"
                >
                  {c.status}
                </Badge>
                <div className="truncate">
                  <h4 className="text-sm font-semibold text-[#141320] group-hover:text-[#2B2644] truncate">
                    {c.title}
                  </h4>
                  <p className="text-xs text-[#64677A] truncate mt-0.5">
                    {c.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 text-xs text-[#64677A]">
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-[#F5F6FA] font-medium text-[#2B2644]">
                  {c.category}
                </span>
                <button
                  onClick={(e) => handleUpvote(e, c.id)}
                  className="flex items-center gap-1 hover:text-[#2B2644]"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{c.upvotes}</span>
                </button>
                <span className="text-[11px]">{relativeTime(c.createdAt)}</span>
                <ArrowRight className="w-4 h-4 text-[#64677A] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
