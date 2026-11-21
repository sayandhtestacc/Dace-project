import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  UserCheck,
  Utensils,
  Users,
  Building,
  ArrowRight,
  Check,
  Mail,
  GraduationCap,
  Sparkles,
  BookOpen,
  Briefcase,
  KeyRound,
  UserPlus,
} from 'lucide-react'
import { useStore } from '@/data/store'
import type { UserRole } from '@/data/types'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { CollegeLogo } from '@/components/ui/CollegeLogo'
import { DUK_SCHOOLS, parseDukEmail, generateDukEmail, type DukSchool } from '@/data/dukAcademics'

export default function Login() {
  const navigate = useNavigate()
  const { currentRole, currentStudentId, switchRole, switchStudent, students, addStudent, loginUser } = useStore()
  const { success, warning } = useToast()

  const [activeTab, setActiveTab] = useState<'email' | 'personas' | 'register'>('email')

  // Persona mode state
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole as UserRole)
  const [selectedStudent, setSelectedStudent] = useState<string>(currentStudentId)

  // University Email mode state
  const [emailInput, setEmailInput] = useState<string>('arjun.cs26@duk.ac.in')
  const parsedEmail = parseDukEmail(emailInput)

  // Scholar Registration state
  const [regName, setRegName] = useState<string>('Kavya Warrier')
  const [regSchool, setRegSchool] = useState<string>('SoCSE')
  const currentSchoolData: DukSchool = DUK_SCHOOLS[regSchool] || DUK_SCHOOLS.SoCSE
  const [regProgIndex, setRegProgIndex] = useState<number>(0)
  const currentProg = currentSchoolData.programmes[regProgIndex] || currentSchoolData.programmes[0]
  const [regSpec, setRegSpec] = useState<string>(currentProg.specializations ? currentProg.specializations[0] : 'General')
  const [regYear, setRegYear] = useState<number>(1)
  const [regIsEwyl, setRegIsEwyl] = useState<boolean>(true)

  const roles = [
    {
      id: 'student' as UserRole,
      title: 'Student Portal',
      desc: 'Raise complaints, book meals with refund cutoffs, show 30s rotating gate QR.',
      icon: UserCheck,
      dest: '/app',
      badge: 'Resident / Day Scholar',
    },
    {
      id: 'mess-manager' as UserRole,
      title: 'Mess Manager Desk',
      desc: 'View tomorrow’s exact meal headcounts, mark meals served, audit food waste KPI.',
      icon: Utensils,
      dest: '/admin/mess',
      badge: 'Catering Office',
    },
    {
      id: 'admin' as UserRole,
      title: 'Department Admin',
      desc: 'Triage, assign complaints to IT/Hostel/Academic depts, mark tickets resolved.',
      icon: Building,
      dest: '/admin/complaints',
      badge: 'Academic & Maintenance',
    },
    {
      id: 'security' as UserRole,
      title: 'Security Gate Post',
      desc: 'Monitor live campus occupancy, simulate gate scans, issue visitor passes.',
      icon: Shield,
      dest: '/admin/gate',
      badge: 'Main Gate 1 & 2',
    },
    {
      id: 'warden' as UserRole,
      title: 'Warden / Super Admin',
      desc: 'Consolidated campus overview, analytical charts, resolution turnaround times.',
      icon: Users,
      dest: '/admin',
      badge: 'Administration',
    },
  ]

  const handleEnterRole = () => {
    loginUser(selectedRole, selectedRole === 'student' ? selectedStudent : undefined)
    const targetObj = roles.find((r) => r.id === selectedRole)
    success(`Entered as ${targetObj?.title}`)
    navigate(targetObj?.dest || '/app')
  }

  const handleEnterByEmail = () => {
    if (!emailInput.trim()) {
      warning('Please enter your university email')
      return
    }

    // Try to find matching student in store
    const existing = students.find(
      (s) => s.email.toLowerCase() === emailInput.trim().toLowerCase()
    )

    if (existing) {
      loginUser('student', existing.id)
      success(`Authenticated as ${existing.name} (${existing.department})`)
      navigate('/app')
    } else {
      // Auto-create student from parsed DUK email
      const newId = addStudent({
        name: parsedEmail.nameGuess,
        email: emailInput.trim().toLowerCase(),
        school: parsedEmail.schoolCode,
        department: parsedEmail.departmentName,
        course: parsedEmail.suggestedProgramme,
        specialization: parsedEmail.suggestedSpecialization,
        degreeLevel: (parsedEmail.suggestedProgramme.startsWith('M.Tech')
          ? 'M.Tech'
          : parsedEmail.suggestedProgramme.startsWith('MBA')
          ? 'MBA'
          : parsedEmail.suggestedProgramme.startsWith('PhD')
          ? 'PhD'
          : 'M.Sc'),
        year: parsedEmail.yearOfStudy,
        walletBalance: 1500,
        isEwyl: parsedEmail.isEwylCandidate,
        campus: 'Technopark Phase IV',
        hostelBlock: 'Nila Hostel Block A',
        rollNo: `DUK/${parsedEmail.batchYear}/${parsedEmail.schoolCode}/${Math.floor(10 + Math.random() * 89)}`,
      })
      loginUser('student', newId)
      success(`Welcome to DUK Hub, ${parsedEmail.nameGuess}!`)
      navigate('/app')
    }
  }

  const handleRegisterNewScholar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!regName.trim()) {
      warning('Please provide scholar name')
      return
    }

    const genEmail = generateDukEmail(regName, regSchool, regYear === 1 ? 2027 : 2026)
    const schoolObj = DUK_SCHOOLS[regSchool] || DUK_SCHOOLS.SoCSE
    const chosenProg = schoolObj.programmes[regProgIndex] || schoolObj.programmes[0]

    const newId = addStudent({
      name: regName.trim(),
      email: genEmail,
      school: schoolObj.code,
      department: schoolObj.shortName,
      course: chosenProg.name,
      specialization: regSpec,
      degreeLevel: chosenProg.degree,
      year: regYear,
      walletBalance: 2000,
      isEwyl: regIsEwyl,
      campus: 'Technopark Phase IV',
      hostelBlock: 'Periyar Hostel Block B',
      rollNo: `DUK/2025/${schoolObj.code}/${Math.floor(100 + Math.random() * 899)}`,
    })

    loginUser('student', newId)
    success(`Account created for ${regName} (${genEmail})`)
    navigate('/app')
  }

  const quickEmailPills = [
    { label: 'SoCSE (AI)', email: 'arjun.cs26@duk.ac.in', school: 'SoCSE' },
    { label: 'SoDS (BioAI)', email: 'ananya.sods26@duk.ac.in', school: 'SoDS' },
    { label: 'SoESA (VLSI)', email: 'rahul.soesa26@duk.ac.in', school: 'SoESA' },
    { label: 'SoI (Ecology)', email: 'kavya.soi25@duk.ac.in', school: 'SoI' },
    { label: 'SoDiHLA (MBA)', email: 'rohit.mba26@duk.ac.in', school: 'SoDiHLA' },
  ]

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-[#141320] flex items-center justify-center p-4 sm:p-6 pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-3xl bg-white rounded-[28px] p-6 sm:p-10 border border-[#2B2644]/8 shadow-[0_24px_60px_-24px_rgba(43,38,68,0.18)]"
      >
        {/* Institutional Branding Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <CollegeLogo variant="full" size="md" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2B2644]/5 text-[#2B2644] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#2B2644]" />
            <span>Digital Access for Community Empowerment (DACE-I)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#141320] tracking-tight">
            DUK Hub Authentication
          </h1>
          <p className="text-xs sm:text-sm text-[#64677A] mt-1 max-w-lg mx-auto">
            Unified single-sign-on for all 5 schools of Digital University Kerala at Technopark Phase IV.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex rounded-2xl bg-[#F5F6FA] p-1.5 mb-6 border border-[#2B2644]/8">
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'email'
                ? 'bg-white text-[#2B2644] shadow-xs'
                : 'text-[#64677A] hover:text-[#141320]'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Institutional Email</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('personas')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'personas'
                ? 'bg-white text-[#2B2644] shadow-xs'
                : 'text-[#64677A] hover:text-[#141320]'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Role Switcher</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'register'
                ? 'bg-white text-[#2B2644] shadow-xs'
                : 'text-[#64677A] hover:text-[#141320]'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Scholar ID</span>
          </button>
        </div>

        {/* TAB 1: Institutional Email */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-[#2B2644] uppercase tracking-wider block mb-2">
                Enter University Email (@duk.ac.in)
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. arjun.cs26@duk.ac.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F5F6FA] border border-[#2B2644]/12 text-sm text-[#141320] focus:outline-none focus:border-[#2B2644] focus:ring-2 focus:ring-[#2B2644]/10 transition-all font-mono"
                />
                <Mail className="w-4 h-4 text-[#64677A] absolute left-3.5 top-3.5" />
              </div>
              <p className="text-[11px] text-[#64677A] mt-1.5">
                Format: <code className="bg-[#2B2644]/6 px-1.5 py-0.5 rounded text-[#2B2644] font-mono">&lt;name&gt;.&lt;school_code&gt;&lt;year&gt;@duk.ac.in</code>
              </p>
            </div>

            {/* Quick 1-click test pills for the 5 schools */}
            <div>
              <span className="text-[11px] font-bold text-[#64677A] uppercase tracking-wider block mb-2">
                1-Click Preset by School:
              </span>
              <div className="flex flex-wrap gap-2">
                {quickEmailPills.map((pill) => (
                  <button
                    key={pill.school}
                    type="button"
                    onClick={() => setEmailInput(pill.email)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                      emailInput === pill.email
                        ? 'bg-[#2B2644] text-white border-[#2B2644]'
                        : 'bg-[#F5F6FA] text-[#2B2644] border-[#2B2644]/12 hover:bg-[#E9ECF6]'
                    }`}
                  >
                    <span className="font-bold">{pill.school}</span>
                    <span className="opacity-80 font-mono text-[11px]">({pill.label})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Real-Time Academic Parsing Card */}
            <div className="p-4 rounded-2xl bg-[#E9ECF6]/60 border border-[#2B2644]/10">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#2B2644]/10 mb-3">
                <span className="text-xs font-bold text-[#2B2644] uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-[#2B2644]" />
                  Verified DUK Academic Match
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#2B2644] text-white px-2 py-0.5 rounded-full">
                  {parsedEmail.schoolCode}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-[#64677A] uppercase font-bold tracking-wider block">School</span>
                  <span className="font-semibold text-[#141320]">{parsedEmail.schoolName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64677A] uppercase font-bold tracking-wider block">Programme</span>
                  <span className="font-semibold text-[#141320]">{parsedEmail.suggestedProgramme}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64677A] uppercase font-bold tracking-wider block">Specialization</span>
                  <span className="text-[#141320]">{parsedEmail.suggestedSpecialization}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64677A] uppercase font-bold tracking-wider block">Batch & Status</span>
                  <span className="text-[#141320]">
                    Class of {parsedEmail.batchYear} · Year {parsedEmail.yearOfStudy}
                    {parsedEmail.isEwylCandidate && (
                      <span className="ml-1.5 text-[9px] font-bold bg-[#2B2644]/10 text-[#2B2644] px-1.5 py-0.5 rounded">
                        EWYL Scholar
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleEnterByEmail}
              variant="primary"
              size="lg"
              className="w-full"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Student Portal
            </Button>
          </div>
        )}

        {/* TAB 2: Persona Selector */}
        {activeTab === 'personas' && (
          <div className="space-y-6">
            <div className="space-y-3">
              {roles.map((r) => {
                const isSelected = selectedRole === r.id
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    className={`p-4 rounded-[20px] border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#2B2644] bg-[#F5F6FA] shadow-xs'
                        : 'border-[#2B2644]/8 hover:bg-[#F5F6FA]/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#2B2644] text-white' : 'bg-[#2B2644]/6 text-[#2B2644]'
                        }`}
                      >
                        <r.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-[#141320]">{r.title}</h4>
                          <span className="text-[10px] font-medium text-[#64677A] bg-[#2B2644]/6 px-2 py-0.5 rounded-full">
                            {r.badge}
                          </span>
                        </div>
                        <p className="text-xs text-[#64677A] mt-0.5">{r.desc}</p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                        isSelected ? 'border-[#2B2644] bg-[#2B2644] text-white' : 'border-[#2B2644]/20'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Student Selector if student role selected */}
            {selectedRole === 'student' && (
              <div className="p-4 rounded-2xl bg-[#E9ECF6]/60 border border-[#2B2644]/10">
                <label className="text-xs font-bold text-[#2B2644] uppercase tracking-wider block mb-2">
                  Select Demo Scholar Identity
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-white border border-[#2B2644]/12 text-[#141320] outline-none"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.school || 'SoCSE'} · {s.course || s.department} (₹{s.walletBalance})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Button
              onClick={handleEnterRole}
              variant="primary"
              size="lg"
              className="w-full"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Enter Selected Role Workspace
            </Button>
          </div>
        )}

        {/* TAB 3: Create Scholar ID */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterNewScholar} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#2B2644] uppercase tracking-wider block mb-1.5">
                  Scholar Full Name
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Sandra Pillai"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F6FA] border border-[#2B2644]/12 text-sm text-[#141320] focus:outline-none focus:border-[#2B2644]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2B2644] uppercase tracking-wider block mb-1.5">
                  School Selection
                </label>
                <select
                  value={regSchool}
                  onChange={(e) => {
                    setRegSchool(e.target.value)
                    setRegProgIndex(0)
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F6FA] border border-[#2B2644]/12 text-sm text-[#141320] focus:outline-none focus:border-[#2B2644]"
                >
                  {Object.values(DUK_SCHOOLS).map((sch) => (
                    <option key={sch.code} value={sch.code}>
                      {sch.code} — {sch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#2B2644] uppercase tracking-wider block mb-1.5">
                  Academic Programme
                </label>
                <select
                  value={regProgIndex}
                  onChange={(e) => {
                    const idx = Number(e.target.value)
                    setRegProgIndex(idx)
                    const p = currentSchoolData.programmes[idx]
                    if (p && p.specializations) {
                      setRegSpec(p.specializations[0])
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F6FA] border border-[#2B2644]/12 text-sm text-[#141320] focus:outline-none focus:border-[#2B2644]"
                >
                  {currentSchoolData.programmes.map((prog, idx) => (
                    <option key={prog.name} value={idx}>
                      {prog.name} ({prog.degree})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#2B2644] uppercase tracking-wider block mb-1.5">
                  Specialization
                </label>
                <select
                  value={regSpec}
                  onChange={(e) => setRegSpec(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F6FA] border border-[#2B2644]/12 text-sm text-[#141320] focus:outline-none focus:border-[#2B2644]"
                >
                  {(currentProg.specializations || ['General']).map((sp) => (
                    <option key={sp} value={sp}>
                      {sp}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#2B2644] uppercase tracking-wider block mb-1.5">
                  Year of Study
                </label>
                <select
                  value={regYear}
                  onChange={(e) => setRegYear(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F6FA] border border-[#2B2644]/12 text-sm text-[#141320] focus:outline-none focus:border-[#2B2644]"
                >
                  <option value={1}>Year 1 (Junior PG / Doctoral)</option>
                  <option value={2}>Year 2 (Senior PG)</option>
                  <option value={3}>PhD Scholar (Research Fellow)</option>
                </select>
              </div>

              <div className="flex flex-col justify-end pb-1">
                <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-xl bg-[#F5F6FA] border border-[#2B2644]/10 hover:bg-[#E9ECF6]/50">
                  <input
                    type="checkbox"
                    checked={regIsEwyl}
                    onChange={(e) => setRegIsEwyl(e.target.checked)}
                    className="w-4 h-4 accent-[#2B2644] rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#2B2644] block">Earn While You Learn (EWYL)</span>
                    <span className="text-[10px] text-[#64677A]">Campus lab stipend & project fellowship</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#E9ECF6]/50 border border-[#2B2644]/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#64677A] uppercase tracking-wider block">Generated Institutional Email</span>
                <span className="font-mono text-xs font-bold text-[#2B2644]">
                  {generateDukEmail(regName, regSchool, regYear === 1 ? 2027 : 2026)}
                </span>
              </div>
              <span className="text-[10px] bg-white px-2 py-1 rounded text-[#2B2644] font-medium border border-[#2B2644]/10">
                Technopark Phase IV
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Create Account & Enter Portal
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  )
}
