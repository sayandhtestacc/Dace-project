import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wrench,
  Home,
  GraduationCap,
  Utensils,
  HelpCircle,
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check,
  EyeOff,
  AlertTriangle,
} from 'lucide-react'
import { useStore } from '@/data/store'
import type { ComplaintCategory, ComplaintPriority } from '@/data/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'

export default function ComplaintNew() {
  const navigate = useNavigate()
  const { currentStudentId, addComplaint, complaintDraft, saveComplaintDraft, clearComplaintDraft } = useStore()
  const { success, warning } = useToast()

  const [step, setStep] = useState<number>(1)
  const [category, setCategory] = useState<ComplaintCategory>('Technical')
  const [conditionalField, setConditionalField] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [priority, setPriority] = useState<ComplaintPriority>('Normal')
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const [submittedRef, setSubmittedRef] = useState<string | null>(null)
  const [copied, setCopied] = useState<boolean>(false)

  // Restore draft if available
  useEffect(() => {
    if (complaintDraft) {
      if (complaintDraft.category) setCategory(complaintDraft.category)
      if (complaintDraft.title) setTitle(complaintDraft.title)
      if (complaintDraft.description) setDescription(complaintDraft.description)
      if (complaintDraft.priority) setPriority(complaintDraft.priority)
      if (complaintDraft.isAnonymous !== undefined) setIsAnonymous(complaintDraft.isAnonymous)
    }
  }, [])

  // Auto-save draft on change
  useEffect(() => {
    saveComplaintDraft({
      step,
      category,
      title,
      description,
      priority,
      isAnonymous,
    })
  }, [step, category, title, description, priority, isAnonymous, saveComplaintDraft])

  const categoryOptions: { id: ComplaintCategory; title: string; desc: string; icon: React.FC<{ className?: string }>; prompt: string }[] = [
    {
      id: 'Technical',
      title: 'Technical / IT',
      desc: 'Kairali AI cluster, ThingQbator, Lab workstations, Kabani Wi-Fi APs, Portal bugs.',
      icon: Wrench,
      prompt: 'Lab / Device affected (e.g. Kairali Lab WS-09, Kabani AP-2, ThingQbator)',
    },
    {
      id: 'Hostel',
      title: 'Hostel Facilities',
      desc: 'Nila Block (Men), Periyar Block (Women), Scholar Quarters, geysers, study room AC.',
      icon: Home,
      prompt: 'Hostel Block & Room number (e.g. Nila Block A - 204)',
    },
    {
      id: 'Academic',
      title: 'Academic Issues',
      desc: 'Lecture hall laser projectors (LH 1-6), biometric attendance, lab slot clash.',
      icon: GraduationCap,
      prompt: 'Course Code & Faculty (e.g. CS701 - Advanced AI, LH-3)',
    },
    {
      id: 'Mess',
      title: 'Mess & Food',
      desc: 'Technopark IV South Dining Block, meal quality, RO filter, hygiene, catering staff.',
      icon: Utensils,
      prompt: 'Dining session & counter (e.g. South Dining Block - Lunch)',
    },
    {
      id: 'Other',
      title: 'General Campus',
      desc: 'Digital Science Park walkways, Technopark IV shuttles, 24h Central Library, solar lighting.',
      icon: HelpCircle,
      prompt: 'Campus location landmark (e.g. Maker Village walkway, Main Gate 1)',
    },
  ]

  const activeCategoryObj = categoryOptions.find((c) => c.id === category) || categoryOptions[0]

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (!title.trim() || title.length < 8) {
      warning('Please enter a descriptive title (at least 8 characters)')
      setStep(2)
      return
    }

    const ref = addComplaint({
      studentId: currentStudentId,
      category,
      title,
      description: conditionalField ? `[${conditionalField}] ${description}` : description,
      photoUrl: photoPreview,
      priority,
      isAnonymous,
      assignedTo: null,
    })

    setSubmittedRef(ref)
    clearComplaintDraft()
    success('Complaint submitted successfully!')
  }

  const handleCopyRef = () => {
    if (submittedRef) {
      navigator.clipboard.writeText(submittedRef)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Submitted Screen (Success with Confetti & Animated Checkmark)
  if (submittedRef) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[28px] p-8 sm:p-12 border border-[rgba(43,38,68,0.08)] shadow-2xl relative overflow-hidden"
        >
          {/* Pulsing Indigo Circle + Drawing Checkmark */}
          <div className="w-20 h-20 mx-auto rounded-full bg-[#E9ECF6] flex items-center justify-center mb-6 relative">
            <span className="absolute inset-0 rounded-full bg-[#2B2644]/20 animate-ping" />
            <CheckCircle2 className="w-10 h-10 text-[#2B2644] relative z-10" />
          </div>

          <h2 className="text-2xl font-bold text-[#141320]">Grievance Registered</h2>
          <p className="text-xs sm:text-sm text-[#64677A] mt-2 max-w-sm mx-auto">
            Your complaint has been queued for department assignment. Track real-time progress on your dashboard.
          </p>

          {/* Reference ID Card */}
          <div className="my-8 p-4 rounded-[18px] bg-[#F5F6FA] border border-[rgba(43,38,68,0.1)] flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] text-[#64677A] uppercase font-bold tracking-wider block">
                Tracking Reference ID
              </span>
              <span className="text-lg font-mono font-bold text-[#2B2644]">{submittedRef}</span>
            </div>
            <button
              onClick={handleCopyRef}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-white border border-[rgba(43,38,68,0.15)] text-[#141320] hover:bg-[#2B2644] hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/app/complaints">
              <Button variant="primary" size="md">
                View My Complaints
              </Button>
            </Link>
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setSubmittedRef(null)
                setStep(1)
                setTitle('')
                setDescription('')
                setPhotoPreview(null)
              }}
            >
              File Another Request
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-4 pb-16">
      {/* Step Breadcrumb / Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-[#64677A] mb-2">
          <span>STEP {step} OF 4</span>
          <span>
            {step === 1 && 'Select Category'}
            {step === 2 && 'Issue Details'}
            {step === 3 && 'Attachments'}
            {step === 4 && 'Review & Submit'}
          </span>
        </div>
        <div className="h-2 w-full bg-[rgba(43,38,68,0.06)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#2B2644]"
            initial={{ width: '25%' }}
            animate={{ width: `${step * 25}%` }}
            transition={{ type: 'spring', damping: 25 }}
          />
        </div>
      </div>

      <div className="bg-white rounded-[28px] p-6 sm:p-10 border border-[rgba(43,38,68,0.08)] shadow-sm">
        {/* STEP 1: CATEGORY SELECTION */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[#141320]">What is the issue regarding?</h2>
              <p className="text-xs text-[#64677A] mt-1">
                Select a category to route this directly to the responsible team.
              </p>
            </div>

            <div className="space-y-3">
              {categoryOptions.map((cat) => {
                const isSelected = category === cat.id
                return (
                  <div
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-4 rounded-[20px] border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#2B2644] bg-[#F5F6FA] shadow-xs'
                        : 'border-[rgba(43,38,68,0.08)] hover:bg-[#F5F6FA]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-[#2B2644] text-white' : 'bg-[rgba(43,38,68,0.06)] text-[#2B2644]'
                        }`}
                      >
                        <cat.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#141320]">{cat.title}</h4>
                        <p className="text-xs text-[#64677A] mt-0.5">{cat.desc}</p>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-[#2B2644]" />}
                  </div>
                )
              })}
            </div>

            {/* Conditional Sub-Field */}
            <div className="pt-2">
              <Input
                label={activeCategoryObj.prompt}
                value={conditionalField}
                onChange={(e) => setConditionalField(e.target.value)}
                hint="Specific hardware, classroom, or room number"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(2)}
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Details
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: TITLE, DESCRIPTION, PRIORITY, ANONYMOUS */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[#141320]">Describe the issue</h2>
              <p className="text-xs text-[#64677A] mt-1">
                Provide clear facts so campus engineers can resolve it efficiently.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Complaint Title (minimum 8 characters)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={80}
                hint="e.g. Wi-Fi router reboot loop on Block B 2nd floor"
              />

              <Textarea
                label="Detailed Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={4}
                hint="Explain when the issue started and how it affects campus activities."
              />

              {/* Priority Pills */}
              <div>
                <label className="text-xs font-semibold text-[#141320] block mb-2">Priority Level</label>
                <div className="flex gap-2">
                  {(['Low', 'Normal', 'Urgent'] as ComplaintPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`px-4 py-2 text-xs rounded-full font-medium transition-all ${
                        priority === p
                          ? p === 'Urgent'
                            ? 'bg-red-600 text-white'
                            : 'bg-[#2B2644] text-white'
                          : 'bg-[#F5F6FA] text-[#64677A] hover:bg-[rgba(43,38,68,0.08)]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Anonymous Submission Toggle */}
              <div className="p-4 rounded-[18px] bg-[#F5F6FA] border border-[rgba(43,38,68,0.08)] flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <EyeOff className="w-5 h-5 text-[#2B2644] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-[#141320]">Anonymous Submission</h4>
                    <p className="text-[11px] text-[#64677A] mt-0.5 leading-relaxed">
                      Your identity will be masked on public dashboards. Administrators will only see the complaint content and category.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-5 h-5 accent-[#2B2644] mt-1 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button variant="ghost" size="md" onClick={() => setStep(1)} iconLeft={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                disabled={title.trim().length < 8}
                onClick={() => setStep(3)}
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Upload Photo
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: PHOTO ATTACHMENT */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[#141320]">Add Visual Evidence (Optional)</h2>
              <p className="text-xs text-[#64677A] mt-1">
                Attach a photo to help technicians diagnose equipment or physical damage.
              </p>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragOver(true)
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleFileDrop}
              className={`p-8 rounded-[20px] border-2 border-dashed text-center transition-all ${
                isDragOver
                  ? 'border-[#2B2644] bg-[#E9ECF6]/60'
                  : 'border-[rgba(43,38,68,0.2)] bg-[#F5F6FA] hover:border-[#2B2644]'
              }`}
            >
              {photoPreview ? (
                <div className="relative inline-block">
                  <img
                    src={photoPreview}
                    alt="Uploaded preview"
                    className="max-h-48 rounded-[14px] shadow-sm object-cover"
                  />
                  <button
                    onClick={() => setPhotoPreview(null)}
                    className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-600 text-white text-xs shadow-md"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-white shadow-xs flex items-center justify-center text-[#2B2644]">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#141320]">
                      Drag and drop image here, or{' '}
                      <label className="text-[#2B2644] underline cursor-pointer">
                        browse files
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileInput}
                          className="hidden"
                        />
                      </label>
                    </p>
                    <p className="text-xs text-[#64677A] mt-1">PNG, JPG up to 5MB (Saved to demo storage)</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button variant="ghost" size="md" onClick={() => setStep(2)} iconLeft={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <Button variant="primary" size="md" onClick={() => setStep(4)} iconRight={<ArrowRight className="w-4 h-4" />}>
                Review Summary
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: REVIEW & SUBMIT */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[#141320]">Review Before Submitting</h2>
              <p className="text-xs text-[#64677A] mt-1">
                Confirm grievance details. A unique tracking ID will be generated upon submission.
              </p>
            </div>

            <div className="p-5 rounded-[20px] bg-[#F5F6FA] border border-[rgba(43,38,68,0.08)] space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="purple">{category}</Badge>
                <Badge variant={priority === 'Urgent' ? 'error' : 'neutral'}>
                  {priority} Priority
                </Badge>
              </div>

              <div>
                <span className="text-[10px] text-[#64677A] uppercase font-bold block">Title</span>
                <h3 className="text-sm font-bold text-[#141320]">{title}</h3>
              </div>

              {conditionalField && (
                <div>
                  <span className="text-[10px] text-[#64677A] uppercase font-bold block">Specific Location</span>
                  <p className="text-xs text-[#141320]">{conditionalField}</p>
                </div>
              )}

              <div>
                <span className="text-[10px] text-[#64677A] uppercase font-bold block">Description</span>
                <p className="text-xs text-[#64677A] leading-relaxed">{description || 'No extra notes provided.'}</p>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#64677A] pt-2 border-t border-[rgba(43,38,68,0.06)]">
                <span>Mode: {isAnonymous ? '🔒 Anonymous' : 'Identified'}</span>
                <span>Attachment: {photoPreview ? '1 Photo attached' : 'None'}</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button variant="ghost" size="md" onClick={() => setStep(3)} iconLeft={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
              <Button variant="primary" size="md" onClick={handleSubmit}>
                Submit Complaint
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
