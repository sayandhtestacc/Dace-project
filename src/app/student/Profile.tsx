import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Building,
  GraduationCap,
  QrCode,
  RotateCw,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Sparkles,
  BookOpen,
  MapPin,
  Phone,
  Briefcase,
} from 'lucide-react'
import { useStore } from '@/data/store'
import { generateQRMatrix, renderQRToSVG } from '@/lib/qr'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { CollegeLogo } from '@/components/ui/CollegeLogo'
import { DUK_SCHOOLS, type DukSchool } from '@/data/dukAcademics'

export default function Profile() {
  const { currentStudentId, students, resetDemoData, switchStudent, updateStudentProfile } = useStore()
  const { success, info } = useToast()

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0]

  const [name, setName] = useState(currentStudent.name)
  const [email, setEmail] = useState(currentStudent.email)
  const [school, setSchool] = useState<string>(currentStudent.school || 'SoCSE')
  const [course, setCourse] = useState<string>(currentStudent.course || 'M.Tech Computer Science & Engineering')
  const [specialization, setSpecialization] = useState<string>(currentStudent.specialization || 'Artificial Intelligence')
  const [degreeLevel, setDegreeLevel] = useState<string>(currentStudent.degreeLevel || 'M.Tech')
  const [year, setYear] = useState<number>(currentStudent.year || 2)
  const [isEwyl, setIsEwyl] = useState<boolean>(Boolean(currentStudent.isEwyl))
  const [hostelBlock, setHostelBlock] = useState<string>(currentStudent.hostelBlock || 'Nila Hostel Block A')
  const [rollNo, setRollNo] = useState<string>(currentStudent.rollNo || 'DUK/2024/MTECH/CS/012')
  const [isFlipped, setIsFlipped] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)

  // Sync state whenever active student changes
  useEffect(() => {
    if (currentStudent) {
      setName(currentStudent.name)
      setEmail(currentStudent.email)
      setSchool(currentStudent.school || 'SoCSE')
      setCourse(currentStudent.course || 'M.Tech Computer Science & Engineering')
      setSpecialization(currentStudent.specialization || 'Artificial Intelligence')
      setDegreeLevel(currentStudent.degreeLevel || 'M.Tech')
      setYear(currentStudent.year || 2)
      setIsEwyl(Boolean(currentStudent.isEwyl))
      setHostelBlock(currentStudent.hostelBlock || 'Nila Hostel Block A')
      setRollNo(currentStudent.rollNo || `DUK/2024/${currentStudent.school || 'CS'}/012`)
    }
  }, [currentStudentId])

  const currentSchoolData: DukSchool = DUK_SCHOOLS[school] || DUK_SCHOOLS.SoCSE

  // Generate Digital ID QR
  const idQr = generateQRMatrix(currentStudent.id, 99999999)
  const idQrSvg = renderQRToSVG(idQr, 7)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateStudentProfile(currentStudent.id, {
      name,
      email,
      school,
      department: currentSchoolData.shortName,
      course,
      specialization,
      degreeLevel: degreeLevel as any,
      year,
      isEwyl,
      hostelBlock,
      rollNo,
    })
    success('Academic credentials and profile updated!')
  }

  const handleReset = () => {
    resetDemoData()
    setIsResetModalOpen(false)
    success('Demo data restored to clean seed state!')
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1">
          Identity & Student Governance
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#141320] tracking-tight">
          Student Digital Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#64677A] mt-1">
          Verified academic credentials across all 5 schools, interactive digital ID card, and demonstration sandbox controls.
        </p>
      </div>

      {/* Side-by-side in grid-cols-1 lg:grid-cols-12 gap-8 (5 cols for ID card, 7 cols for settings) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: 5 COLS (Smart Digital Student ID with 3D Flip) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#64677A] uppercase tracking-wider">
              Smart Digital Student ID
            </span>
            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              className="text-xs text-[#2B2644] hover:underline flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{isFlipped ? 'Show Front' : 'Flip Card'}</span>
            </button>
          </div>

          <div className="perspective-[1200px] w-full">
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-[460px] [transform-style:preserve-3d] cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* CARD FRONT: Dark #2B2644 Student Digital ID card */}
              <div className="absolute inset-0 w-full h-full rounded-[24px] bg-[#2B2644] text-white p-7 flex flex-col justify-between shadow-xl border border-white/10 [backface-visibility:hidden]">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <CollegeLogo size="xs" />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold tracking-wider leading-none">DIGITAL UNIVERSITY KERALA</span>
                        <span className="text-[8px] text-[#C5CBE8] tracking-widest uppercase mt-0.5">Technopark Phase IV</span>
                      </div>
                    </div>
                    <span className="text-[9px] text-[#E9ECF6] font-bold uppercase tracking-wider bg-white/15 px-2.5 py-0.5 rounded-full border border-white/15">
                      {currentStudent.school || 'SoCSE'}
                    </span>
                  </div>

                  <div className="flex items-start gap-4 mt-5">
                    <div className="w-16 h-16 rounded-[18px] bg-gradient-to-tr from-[#C5CBE8] to-white text-[#2B2644] flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                      {currentStudent.avatarInitials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-white leading-tight truncate">{currentStudent.name}</h3>
                      <p className="text-xs text-[#C5CBE8] font-medium mt-0.5 line-clamp-1">
                        {currentStudent.course || currentStudent.department}
                      </p>
                      <p className="text-[11px] text-white/70 mt-0.5 truncate">
                        Spec: {currentStudent.specialization || 'General'}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span className="text-[10px] text-white/90 bg-white/10 px-2 py-0.5 rounded font-medium">
                          Year {currentStudent.year} · {currentStudent.degreeLevel || 'PG'}
                        </span>
                        {currentStudent.isEwyl && (
                          <span className="text-[9px] text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">
                            EWYL Scholar
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl p-2.5 border border-white/10 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="text-[9px] text-[#C5CBE8] uppercase font-bold tracking-wider block">Roll Number</span>
                      <span className="font-mono font-bold text-white">{currentStudent.rollNo || 'DUK/2024/MTECH/012'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-[#C5CBE8] uppercase font-bold tracking-wider block">Residence</span>
                      <span className="text-white/90 text-[10px] font-medium truncate max-w-[120px] block">
                        {currentStudent.hostelBlock || 'Technopark IV'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] text-[#C5CBE8] uppercase block font-bold tracking-wider">
                        Passkey Signature
                      </span>
                      <span className="text-xs font-mono font-bold text-white">{currentStudent.qrToken}</span>
                    </div>
                    <div className="w-11 h-11 bg-white rounded-[10px] p-1 flex items-center justify-center shadow-xs">
                      <QrCode className="w-9 h-9 text-[#2B2644]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD BACK: White institutional certification */}
              <div className="absolute inset-0 w-full h-full rounded-[24px] bg-white text-[#141320] p-7 flex flex-col justify-between shadow-xl border border-[#2B2644]/12 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                <div>
                  <div className="pb-3 border-b border-[#2B2644]/8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CollegeLogo size="xs" />
                      <span className="text-xs font-bold text-[#2B2644]">OFFICIAL CAMPUS CREDENTIAL</span>
                    </div>
                    <span className="text-[10px] text-[#64677A]">KUDSIT</span>
                  </div>

                  <div className="my-3 space-y-2 text-xs">
                    <div>
                      <span className="text-[9px] text-[#64677A] uppercase font-bold tracking-wider block">Institutional Email</span>
                      <span className="text-[#141320] font-mono text-[11px] font-semibold">{currentStudent.email}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#64677A] uppercase font-bold tracking-wider block">School & Faculty</span>
                      <span className="text-[#141320] font-medium">{currentSchoolData.name}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#64677A] uppercase font-bold tracking-wider block">Campus Jurisdiction</span>
                      <span className="text-[#141320]">Technopark Phase IV, Mangalapuram, Trivandrum - 695317</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#64677A] uppercase font-bold tracking-wider block">Emergency Helpline</span>
                      <span className="text-[#141320] font-mono">0471-2788000 · security@duk.ac.in</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#2B2644]/8 text-center">
                  <span className="text-[9px] text-[#64677A] block italic mb-1.5">
                    "Curating a responsible digital world"
                  </span>
                  <div className="h-7 w-full bg-[#11101D] rounded-[6px] flex items-center justify-center">
                    <span className="text-[9px] font-mono text-white tracking-[0.25em]">|||| | |||||| || |||||</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          <p className="text-[11px] text-center text-[#64677A] pt-1">
            Click card or "Flip Card" to inspect institutional barcode
          </p>
        </div>

        {/* RIGHT COLUMN: 7 COLS (Settings & Academic Selection Form) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-[24px] p-6 sm:p-8 space-y-6 border border-[#2B2644]/8 shadow-[0_8px_30px_rgba(43,38,68,0.05)]">
            <div className="flex items-center justify-between pb-3 border-b border-[#2B2644]/8">
              <div>
                <h3 className="text-base font-bold text-[#141320]">Academic Details & Settings</h3>
                <p className="text-xs text-[#64677A]">
                  Select school, course, and research specialization to calibrate demo identity.
                </p>
              </div>
              <Badge variant="purple">{school}</Badge>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#F5F6FA] border border-[#2B2644]/12 text-[#141320] outline-none focus:border-[#2B2644]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1.5">
                    Institutional Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#F5F6FA] border border-[#2B2644]/12 text-[#141320] outline-none focus:border-[#2B2644] font-mono"
                  />
                </div>
              </div>

              {/* School & Degree */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1.5">
                    DUK School (Faculty)
                  </label>
                  <select
                    value={school}
                    onChange={(e) => {
                      const newSch = e.target.value
                      setSchool(newSch)
                      const schData = DUK_SCHOOLS[newSch] || DUK_SCHOOLS.SoCSE
                      const firstProg = schData.programmes[0]
                      setCourse(firstProg.name)
                      setDegreeLevel(firstProg.degree)
                      setSpecialization(firstProg.specializations ? firstProg.specializations[0] : 'General')
                    }}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#F5F6FA] border border-[#2B2644]/12 text-[#141320] outline-none focus:border-[#2B2644]"
                  >
                    {Object.values(DUK_SCHOOLS).map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.code} — {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1.5">
                    Course / Programme
                  </label>
                  <select
                    value={course}
                    onChange={(e) => {
                      const newCourse = e.target.value
                      setCourse(newCourse)
                      const found = currentSchoolData.programmes.find((p) => p.name === newCourse)
                      if (found) {
                        setDegreeLevel(found.degree)
                        setSpecialization(found.specializations ? found.specializations[0] : 'General')
                      }
                    }}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#F5F6FA] border border-[#2B2644]/12 text-[#141320] outline-none focus:border-[#2B2644]"
                  >
                    {currentSchoolData.programmes.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name} ({p.degree})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Specialization & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1.5">
                    Specialization
                  </label>
                  <select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#F5F6FA] border border-[#2B2644]/12 text-[#141320] outline-none focus:border-[#2B2644]"
                  >
                    {((currentSchoolData.programmes.find((p) => p.name === course)?.specializations) || ['General']).map((sp) => (
                      <option key={sp} value={sp}>
                        {sp}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1.5">
                    Year of Study
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#F5F6FA] border border-[#2B2644]/12 text-[#141320] outline-none focus:border-[#2B2644]"
                  >
                    <option value={1}>Year 1 (Junior PG / Doctoral)</option>
                    <option value={2}>Year 2 (Senior PG)</option>
                    <option value={3}>PhD Scholar (Research Fellow)</option>
                  </select>
                </div>
              </div>

              {/* Roll No, Hostel, and EWYL checkbox */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1.5">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#F5F6FA] border border-[#2B2644]/12 text-[#141320] outline-none focus:border-[#2B2644] font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#64677A] uppercase tracking-wider block mb-1.5">
                    Campus Residence
                  </label>
                  <input
                    type="text"
                    value={hostelBlock}
                    onChange={(e) => setHostelBlock(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[#F5F6FA] border border-[#2B2644]/12 text-[#141320] outline-none focus:border-[#2B2644]"
                    placeholder="e.g. Nila Block A, Room 204"
                  />
                </div>
              </div>

              {/* EWYL Checkbox */}
              <div className="p-3.5 rounded-xl bg-[#F5F6FA] border border-[#2B2644]/10">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEwyl}
                    onChange={(e) => setIsEwyl(e.target.checked)}
                    className="w-4 h-4 accent-[#2B2644] rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#2B2644] block">
                      Earn While You Learn (EWYL) Research Scholar
                    </span>
                    <span className="text-[11px] text-[#64677A]">
                      Enables official campus project fellowship stipend and lab overtime clearance.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="primary" size="md" type="submit">
                  Save Profile Changes
                </Button>
              </div>
            </form>

            {/* Switch Student Identity selector */}
            <div className="pt-6 border-t border-[#2B2644]/8 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#141320]">Switch Student Persona</h4>
                <Badge variant="purple">{students.length} Seeded Scholars</Badge>
              </div>
              <p className="text-xs text-[#64677A]">
                Select any registered scholar across the 5 DUK schools to inspect their personalized complaints, wallet balance, and gate activity.
              </p>
              <select
                value={currentStudentId}
                onChange={(e) => {
                  switchStudent(e.target.value)
                  info(`Switched student persona`)
                }}
                className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl bg-[#F5F6FA] border border-[#2B2644]/12 text-[#141320] outline-none font-medium"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.school || 'SoCSE'} · {s.course || s.department} (₹{s.walletBalance})
                  </option>
                ))}
              </select>
            </div>

            {/* Reset All Demo Data button */}
            <div className="pt-6 border-t border-[#2B2644]/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-red-700">Reset Demo State</h4>
                <p className="text-xs text-[#64677A]">
                  Clear localStorage and restore initial authentic DUK seed data.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsResetModalOpen(true)}
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                Reset Demo Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset Demo Data?"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-[#64677A]">
            This will wipe all complaints, new bookings, and gate entries created in this session and restore the authentic Digital University Kerala demonstration dataset.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleReset}
              className="bg-red-700 hover:bg-red-800"
            >
              Confirm Reset
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
