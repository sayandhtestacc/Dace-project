/**
 * Digital University Kerala (KUDSIT) — Academic Structure & Email Parser
 * Institutional context for Schools, Programmes, Research Centres, and Email Schema.
 */

export interface DukProgramme {
  name: string
  degree: 'M.Tech' | 'M.Sc' | 'MBA' | 'MA' | 'PhD'
  specializations?: string[]
  durationYears: number
}

export interface DukSchool {
  code: 'SoCSE' | 'SoESA' | 'SoDS' | 'SoI' | 'SoDiHLA'
  name: string
  shortName: string
  emailSuffixes: string[]
  focus: string
  programmes: DukProgramme[]
  labs: string[]
}

export const DUK_SCHOOLS: Record<string, DukSchool> = {
  SoCSE: {
    code: 'SoCSE',
    name: 'School of Computer Science & Engineering',
    shortName: 'Computer Science & Engineering',
    emailSuffixes: ['cs', 'socse', 'cse'],
    focus: 'Theoretical computer science, computational intelligence, systems & cybersecurity.',
    programmes: [
      {
        name: 'M.Tech Computer Science & Engineering',
        degree: 'M.Tech',
        specializations: ['Artificial Intelligence', 'Cyber Security Engineering'],
        durationYears: 2,
      },
      {
        name: 'M.Sc Computer Science',
        degree: 'M.Sc',
        specializations: ['Artificial Intelligence', 'Cyber Security', 'Data Analytics'],
        durationYears: 2,
      },
      {
        name: 'M.Sc Advanced Artificial Intelligence',
        degree: 'M.Sc',
        specializations: ['Deep Learning', 'Edge AI'],
        durationYears: 1,
      },
      {
        name: 'PhD in Computer Science & AI',
        degree: 'PhD',
        specializations: ['AI', 'Cybersecurity', 'e-Governance'],
        durationYears: 3,
      },
    ],
    labs: ['Kairali AI Chip Centre', 'Cisco ThingQbator', 'KBA Blockchain Lab'],
  },
  SoESA: {
    code: 'SoESA',
    name: 'School of Electronic Systems & Automation',
    shortName: 'Electronic Systems & Automation',
    emailSuffixes: ['soesa', 'vlsi', 'ece'],
    focus: 'Applied research, VLSI hardware architecture, edge electronics & embedded systems.',
    programmes: [
      {
        name: 'M.Tech Electronics Engineering',
        degree: 'M.Tech',
        specializations: ['VLSI Design'],
        durationYears: 2,
      },
      {
        name: 'M.Sc Electronics Engineering',
        degree: 'M.Sc',
        specializations: ['VLSI and Embedded Systems'],
        durationYears: 2,
      },
      {
        name: 'M.Sc Applied Physics',
        degree: 'M.Sc',
        specializations: ['Applied Materials'],
        durationYears: 2,
      },
      {
        name: 'PhD in Electronic Hardware & VLSI',
        degree: 'PhD',
        specializations: ['Analogue/Mixed-Signal', 'Kairali Microarchitecture'],
        durationYears: 3,
      },
    ],
    labs: ['Digital Science Park ARM Lab', 'C V Raman Laboratory', 'Maker Village'],
  },
  SoDS: {
    code: 'SoDS',
    name: 'School of Digital Sciences',
    shortName: 'Digital Sciences',
    emailSuffixes: ['sods', 'ds', 'data'],
    focus: 'STEM data science, biological AI, financial analytics & computational modeling.',
    programmes: [
      {
        name: 'M.Sc Data Science & Computational Modelling',
        degree: 'M.Sc',
        specializations: ['Computational STEM'],
        durationYears: 2,
      },
      {
        name: 'M.Sc Data Science & BioAI',
        degree: 'M.Sc',
        specializations: ['Bioinformatics & Genomics'],
        durationYears: 2,
      },
      {
        name: 'M.Sc Data Science & Geoinformatics',
        degree: 'M.Sc',
        specializations: ['Earth Observation & GIS'],
        durationYears: 2,
      },
      {
        name: 'M.Sc Data Science & Fintech',
        degree: 'M.Sc',
        specializations: ['Algorithmic Trading & Blockchain'],
        durationYears: 2,
      },
      {
        name: 'M.Sc Data Science & Product Development',
        degree: 'M.Sc',
        specializations: ['Industry Product Engineering'],
        durationYears: 2,
      },
    ],
    labs: ['BioAI Computational Cluster', 'Product Development Vertical (CMM Level 3)'],
  },
  SoI: {
    code: 'SoI',
    name: 'School of Informatics',
    shortName: 'Informatics',
    emailSuffixes: ['soi', 'sol', 'info', 'eco'],
    focus: 'Ecological informatics, earth observation, bioacoustics & sustainability.',
    programmes: [
      {
        name: 'M.Sc Ecology',
        degree: 'M.Sc',
        specializations: ['Ecological Informatics'],
        durationYears: 2,
      },
      {
        name: 'M.Sc Environmental Science',
        degree: 'M.Sc',
        specializations: [
          'Environmental Data Science',
          'Ecological Informatics',
          'Sustainability Studies',
          'Environmental Communication',
        ],
        durationYears: 2,
      },
      {
        name: 'M.Sc Environmental Sustainability',
        degree: 'M.Sc',
        specializations: ['Climate Analytics'],
        durationYears: 1,
      },
    ],
    labs: ['Bioacoustics & Ecological Informatics Hub', 'Western Ghats Biodiversity Observatory'],
  },
  SoDiHLA: {
    code: 'SoDiHLA',
    name: 'School of Digital Humanities & Liberal Arts',
    shortName: 'Digital Humanities & Liberal Arts',
    emailSuffixes: ['sodihla', 'mba', 'dh'],
    focus: 'Digital culture, data-driven business leadership & social science innovation.',
    programmes: [
      {
        name: 'MBA (Regular)',
        degree: 'MBA',
        specializations: [
          'AI & Business Analytics',
          'Marketing Analytics',
          'Finance & Fintech',
          'Operations & Supply Chain',
          'Systems & HR',
        ],
        durationYears: 2,
      },
      {
        name: 'MBA for Working Professionals',
        degree: 'MBA',
        specializations: ['Technology Management'],
        durationYears: 2,
      },
      {
        name: 'MBA in Supply Chain Management and Logistics',
        degree: 'MBA',
        specializations: ['Maritime & Logistics Analytics'],
        durationYears: 2,
      },
      {
        name: 'MA Digital Humanities',
        degree: 'MA',
        specializations: ['Computational Culture & Heritage'],
        durationYears: 2,
      },
    ],
    labs: ['Digital Heritage Studio', 'Enterprise Analytics Lab'],
  },
}

export interface ParsedDukEmail {
  isValidDukEmail: boolean
  rawEmail: string
  username: string
  nameGuess: string
  schoolCode: 'SoCSE' | 'SoESA' | 'SoDS' | 'SoI' | 'SoDiHLA'
  schoolName: string
  departmentName: string
  batchYear: number
  yearOfStudy: number
  suggestedProgramme: string
  suggestedSpecialization: string
  isEwylCandidate: boolean
}

/**
 * Parses university emails following the DUK format:
 * example: arjun.cs26@duk.ac.in
 * format: <name>.<department_code><batch_2digit_year>@duk.ac.in
 */
export function parseDukEmail(email: string): ParsedDukEmail {
  const clean = email.trim().toLowerCase()
  const isDuk = clean.endsWith('@duk.ac.in') || clean.endsWith('@demo.duk.ac.in')

  // Extract local part before @
  const localPart = clean.split('@')[0] || ''
  const parts = localPart.split('.')

  let username = parts[0] || 'scholar'
  let codeAndBatch = parts.length > 1 ? parts[1] : parts[0]

  // Extract trailing 2 digits (e.g. 26 -> 2026, 25 -> 2025)
  const yearMatch = codeAndBatch.match(/(\d{2})$/)
  let batchYear = 2026
  let deptSub = codeAndBatch

  if (yearMatch) {
    batchYear = 2000 + parseInt(yearMatch[1], 10)
    deptSub = codeAndBatch.replace(/(\d{2})$/, '')
  }

  // Calculate year of study (assuming current academic year is 2025-2026)
  // Class of 2026 -> graduating this year = Year 2
  // Class of 2027 -> Year 1
  let yearOfStudy = 2
  if (batchYear >= 2027) yearOfStudy = 1
  if (batchYear <= 2025) yearOfStudy = 2

  // Match school by department code
  let detectedSchool: DukSchool = DUK_SCHOOLS.SoCSE

  if (['cs', 'cse', 'socse', 'ai'].includes(deptSub)) {
    detectedSchool = DUK_SCHOOLS.SoCSE
  } else if (['soesa', 'vlsi', 'ece', 'electronics'].includes(deptSub)) {
    detectedSchool = DUK_SCHOOLS.SoESA
  } else if (['sods', 'ds', 'data', 'bioai'].includes(deptSub)) {
    detectedSchool = DUK_SCHOOLS.SoDS
  } else if (['soi', 'sol', 'info', 'eco', 'env'].includes(deptSub)) {
    detectedSchool = DUK_SCHOOLS.SoI
  } else if (['sodihla', 'mba', 'dh', 'mgmt'].includes(deptSub)) {
    detectedSchool = DUK_SCHOOLS.SoDiHLA
  } else {
    // Fallback: check if username has keywords
    if (clean.includes('sods') || clean.includes('data')) detectedSchool = DUK_SCHOOLS.SoDS
    else if (clean.includes('soesa') || clean.includes('ece')) detectedSchool = DUK_SCHOOLS.SoESA
    else if (clean.includes('soi') || clean.includes('sol')) detectedSchool = DUK_SCHOOLS.SoI
    else if (clean.includes('mba') || clean.includes('sodihla')) detectedSchool = DUK_SCHOOLS.SoDiHLA
  }

  const nameGuess = username
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const prog = detectedSchool.programmes[0]
  const spec = prog.specializations ? prog.specializations[0] : 'General'

  return {
    isValidDukEmail: isDuk,
    rawEmail: email,
    username,
    nameGuess: nameGuess || 'DUK Scholar',
    schoolCode: detectedSchool.code,
    schoolName: detectedSchool.name,
    departmentName: detectedSchool.shortName,
    batchYear,
    yearOfStudy,
    suggestedProgramme: prog.name,
    suggestedSpecialization: spec,
    isEwylCandidate: yearOfStudy >= 2,
  }
}

/**
 * Helper to generate authentic DUK email address
 */
export function generateDukEmail(name: string, schoolCode: string, batchYear = 2026): string {
  const cleanName = name.trim().toLowerCase().replace(/\s+/g, '.')
  const school = DUK_SCHOOLS[schoolCode] || DUK_SCHOOLS.SoCSE
  const suffix = school.emailSuffixes[0]
  const shortYear = String(batchYear).slice(-2)
  return `${cleanName}.${suffix}${shortYear}@duk.ac.in`
}
