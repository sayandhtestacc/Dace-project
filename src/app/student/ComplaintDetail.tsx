import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  ThumbsDown,
  ThumbsUp,
  Star,
  Printer,
  Copy,
  Check,
  Building,
} from 'lucide-react'
import { useStore } from '@/data/store'
import { relativeTime } from '@/lib/format'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

export default function ComplaintDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { complaints, addComplaintComment, rateComplaint, updateComplaintStatus, currentStudentId, currentRole } = useStore()
  const { success, info } = useToast()

  const [commentText, setCommentText] = useState('')
  const [copied, setCopied] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const complaint = complaints.find((c) => c.id === id)

  if (!complaint) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <h2 className="text-xl font-bold text-[#141320]">Complaint Not Found</h2>
        <p className="text-xs text-[#64677A] mt-1 mb-6">
          The requested complaint identifier does not exist.
        </p>
        <Link to="/app/complaints">
          <Button variant="primary" size="sm">
            Back to Complaints
          </Button>
        </Link>
      </div>
    )
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    addComplaintComment(complaint.id, {
      author: currentRole === 'admin' ? 'Campus Admin' : 'Student',
      authorRole: currentRole as any,
      content: commentText.trim(),
    })

    setCommentText('')
    success('Comment posted')
  }

  const handleCopyRef = () => {
    navigator.clipboard.writeText(complaint.refId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    info('Reference ID copied to clipboard')
  }

  const handleRating = (stars: number) => {
    rateComplaint(complaint.id, stars)
    if (stars <= 2) {
      info('Complaint marked as Reopened due to low satisfaction')
    } else {
      success('Thank you for rating resolution quality')
    }
  }

  // Stages for timeline
  const stages = [
    { label: 'Submitted', done: true, time: complaint.createdAt, actor: 'Student' },
    {
      label: 'Assigned',
      done: ['Assigned', 'In Progress', 'Resolved'].includes(complaint.status),
      time: complaint.createdAt + 1800000,
      actor: complaint.assignedTo || 'Pending assignment',
    },
    {
      label: 'In Progress',
      done: ['In Progress', 'Resolved'].includes(complaint.status),
      time: complaint.createdAt + 7200000,
      actor: complaint.assignedTo || 'Technician',
    },
    {
      label: 'Resolved',
      done: complaint.status === 'Resolved',
      time: complaint.resolvedAt || null,
      actor: complaint.assignedTo || 'Department Staff',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header & Back Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/app/complaints"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64677A] hover:text-[#141320]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Complaints</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyRef}
            iconLeft={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Copied' : complaint.refId}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.print()}
            iconLeft={<Printer className="w-3.5 h-3.5" />}
          >
            Print
          </Button>
        </div>
      </div>

      {/* Main Ticket Card */}
      <Card variant="elevated" className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[rgba(43,38,68,0.06)]">
          <div className="flex items-center gap-2">
            <Badge variant="purple">{complaint.category}</Badge>
            <Badge variant={complaint.priority === 'Urgent' ? 'error' : 'neutral'}>
              {complaint.priority} Priority
            </Badge>
            {complaint.isAnonymous && (
              <Badge variant="warning">Anonymous Mode</Badge>
            )}
          </div>

          <Badge
            variant={complaint.status === 'Resolved' ? 'success' : complaint.status === 'In Progress' ? 'warning' : 'neutral'}
            pulse={complaint.status === 'In Progress'}
            size="md"
          >
            {complaint.status}
          </Badge>
        </div>

        <div className="py-6">
          <h1 className="text-xl sm:text-2xl font-bold text-[#141320] leading-snug">
            {complaint.title}
          </h1>
          <p className="text-xs text-[#64677A] mt-1">
            Logged {relativeTime(complaint.createdAt)} · Ref: {complaint.refId}
          </p>

          <p className="text-sm text-[#141320] mt-4 leading-relaxed whitespace-pre-wrap">
            {complaint.description}
          </p>

          {/* Photo attachment if available */}
          {complaint.photoUrl && (
            <div className="mt-6">
              <span className="text-xs font-semibold text-[#64677A] block mb-2">Attached Image:</span>
              <img
                src={complaint.photoUrl}
                alt="Complaint attachment"
                className="max-h-60 rounded-[16px] border border-[rgba(43,38,68,0.1)] object-cover"
              />
            </div>
          )}
        </div>

        {/* 21. Vertical Status Timeline */}
        <div className="pt-6 border-t border-[rgba(43,38,68,0.06)]">
          <h3 className="text-xs font-bold text-[#141320] uppercase tracking-wider mb-6">
            Resolution Progress Timeline
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[rgba(43,38,68,0.1)]">
            {stages.map((st, i) => (
              <div key={st.label} className="relative flex items-start gap-4">
                <span
                  className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                    st.done ? 'bg-[#2B2644] ring-2 ring-[#2B2644]/20' : 'bg-[#C5CBE8]'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${st.done ? 'text-[#141320]' : 'text-[#64677A]'}`}>
                      {st.label}
                    </span>
                    {st.actor && (
                      <span className="text-[11px] text-[#64677A]">({st.actor})</span>
                    )}
                  </div>
                  {st.time && (
                    <span className="text-[10px] text-[#64677A] block mt-0.5">
                      {relativeTime(st.time)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 30. Post-completion satisfaction rating prompt */}
        {complaint.status === 'Resolved' && (
          <div className="mt-8 p-6 rounded-[20px] bg-[#E9ECF6]/60 border border-[rgba(43,38,68,0.1)] text-center">
            <h4 className="text-sm font-semibold text-[#141320]">
              Are you satisfied with this resolution?
            </h4>
            <p className="text-xs text-[#64677A] mt-1 mb-4">
              Rate the work done. Submitting a low rating automatically re-opens the ticket.
            </p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`p-2 rounded-full transition-transform hover:scale-110 ${
                    complaint.rating && complaint.rating >= star
                      ? 'text-amber-500'
                      : 'text-[#64677A]/40 hover:text-amber-400'
                  }`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
            {complaint.rating && (
              <span className="text-xs font-medium text-emerald-700 block mt-2">
                Rated: {complaint.rating} / 5 stars
              </span>
            )}
          </div>
        )}
      </Card>

      {/* 27. Live Comment & Reply Thread */}
      <Card variant="elevated" className="p-6 sm:p-8">
        <h3 className="text-base font-semibold text-[#141320] mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#2B2644]" />
          <span>Updates & Discussion ({complaint.comments.length})</span>
        </h3>

        <div className="space-y-3 mb-6">
          {complaint.comments.length === 0 ? (
            <p className="text-xs text-[#64677A] py-4 text-center">
              No comments posted yet. Add a query or status note below.
            </p>
          ) : (
            complaint.comments.map((cm) => (
              <div
                key={cm.id}
                className={`p-4 rounded-[18px] border ${
                  cm.authorRole === 'admin'
                    ? 'bg-[#E9ECF6]/50 border-[rgba(43,38,68,0.1)]'
                    : 'bg-[#F5F6FA] border-[rgba(43,38,68,0.06)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#141320] flex items-center gap-1.5">
                    {cm.author}
                    {cm.authorRole === 'admin' && (
                      <span className="text-[10px] bg-[#2B2644] text-white px-1.5 py-0.2 rounded-full font-normal">
                        Staff
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-[#64677A]">{relativeTime(cm.createdAt)}</span>
                </div>
                <p className="text-xs text-[#141320] leading-relaxed mt-1">{cm.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Add Comment Input */}
        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add an update or response note..."
            className="flex-1 h-11 px-4 text-xs rounded-full bg-[#F5F6FA] border border-[rgba(43,38,68,0.1)] text-[#141320] outline-none focus:border-[#2B2644]"
          />
          <Button variant="primary" size="md" type="submit" iconRight={<Send className="w-3.5 h-3.5" />}>
            Send
          </Button>
        </form>
      </Card>
    </div>
  )
}
