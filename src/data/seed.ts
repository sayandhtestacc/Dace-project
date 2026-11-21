/**
 * DUK Hub — Seed Data Generator
 * All fake data, relative to Date.now() for fresh timestamps.
 */
import type {
  Student, Complaint, ComplaintComment, DayMenu, MenuItem,
  MealBooking, WalletTxn, GateLog, Notification, Visitor,
} from './types'
import { generateRefId, getInitials } from '../lib/format'

const SEED_VERSION = 'duk-hub-v2'
const now = Date.now()
const hour = 3600000
const day = 86400000

function id(): string {
  return Math.random().toString(36).substring(2, 11)
}

// ─── Students ───
export const students: Student[] = [
  {
    id: 'stu-01',
    name: 'Arjun Menon',
    school: 'SoCSE',
    department: 'Computer Science & Engineering',
    course: 'M.Tech Computer Science & Engineering',
    specialization: 'Artificial Intelligence',
    degreeLevel: 'M.Tech',
    year: 2,
    email: 'arjun.cs26@duk.ac.in',
    qrToken: 'QR-ARJUN-01',
    avatarInitials: 'AM',
    walletBalance: 1850,
    isEwyl: true,
    rollNo: 'DUK/2024/MTECH/CS/012',
    campus: 'Technopark Phase IV',
    hostelBlock: 'Nila Block A, Room 204',
  },
  {
    id: 'stu-02',
    name: 'Ananya Nair',
    school: 'SoDS',
    department: 'Digital Sciences',
    course: 'M.Sc Data Science & BioAI',
    specialization: 'Bioinformatics & Genomics',
    degreeLevel: 'M.Sc',
    year: 2,
    email: 'ananya.sods26@duk.ac.in',
    qrToken: 'QR-ANANYA-02',
    avatarInitials: 'AN',
    walletBalance: 2400,
    isEwyl: false,
    rollNo: 'DUK/2024/MSC/DS/008',
    campus: 'Technopark Phase IV',
    hostelBlock: 'Periyar Block B, Room 310',
  },
  {
    id: 'stu-03',
    name: 'Rahul Krishnan',
    school: 'SoESA',
    department: 'Electronic Systems & Automation',
    course: 'M.Tech Electronics Engineering',
    specialization: 'VLSI Design',
    degreeLevel: 'M.Tech',
    year: 2,
    email: 'rahul.soesa26@duk.ac.in',
    qrToken: 'QR-RAHUL-03',
    avatarInitials: 'RK',
    walletBalance: 980,
    isEwyl: true,
    rollNo: 'DUK/2024/MTECH/VLSI/019',
    campus: 'Technopark Phase IV',
    hostelBlock: 'Nila Block B, Room 112',
  },
  {
    id: 'stu-04',
    name: 'Kavya Warrier',
    school: 'SoI',
    department: 'Informatics',
    course: 'M.Sc Ecology',
    specialization: 'Ecological Informatics',
    degreeLevel: 'M.Sc',
    year: 1,
    email: 'kavya.soi25@duk.ac.in',
    qrToken: 'QR-KAVYA-04',
    avatarInitials: 'KW',
    walletBalance: 1200,
    isEwyl: false,
    rollNo: 'DUK/2025/MSC/ECO/005',
    campus: 'Technopark Phase IV',
    hostelBlock: 'Periyar Block A, Room 104',
  },
  {
    id: 'stu-05',
    name: 'Rohit Thomas',
    school: 'SoDiHLA',
    department: 'Digital Humanities & Liberal Arts',
    course: 'MBA (Regular)',
    specialization: 'AI & Business Analytics',
    degreeLevel: 'MBA',
    year: 2,
    email: 'rohit.mba26@duk.ac.in',
    qrToken: 'QR-ROHIT-05',
    avatarInitials: 'RT',
    walletBalance: 3100,
    isEwyl: false,
    rollNo: 'DUK/2024/MBA/031',
    campus: 'Technopark Phase IV',
    hostelBlock: 'Day Scholar (Trivandrum City)',
  },
  {
    id: 'stu-06',
    name: 'Devi Lakshmi',
    school: 'SoCSE',
    department: 'Computer Science & Engineering',
    course: 'M.Sc Computer Science',
    specialization: 'Cyber Security',
    degreeLevel: 'M.Sc',
    year: 2,
    email: 'devi.cs26@duk.ac.in',
    qrToken: 'QR-DEVI-06',
    avatarInitials: 'DL',
    walletBalance: 750,
    isEwyl: false,
    rollNo: 'DUK/2024/MSC/CS/017',
    campus: 'Technopark Phase IV',
    hostelBlock: 'Periyar Block A, Room 218',
  },
  {
    id: 'stu-07',
    name: 'Arun Kumar',
    school: 'SoDS',
    department: 'Digital Sciences',
    course: 'M.Sc Data Science & Computational Modelling',
    specialization: 'Computational STEM',
    degreeLevel: 'M.Sc',
    year: 1,
    email: 'arun.sods25@duk.ac.in',
    qrToken: 'QR-ARUN-07',
    avatarInitials: 'AK',
    walletBalance: 2050,
    isEwyl: false,
    rollNo: 'DUK/2025/MSC/DS/014',
    campus: 'Technopark Phase IV',
    hostelBlock: 'Nila Block A, Room 302',
  },
  {
    id: 'stu-08',
    name: 'Priya Mohan',
    school: 'SoESA',
    department: 'Electronic Systems & Automation',
    course: 'M.Sc Electronics Engineering',
    specialization: 'VLSI and Embedded Systems',
    degreeLevel: 'M.Sc',
    year: 2,
    email: 'priya.soesa26@duk.ac.in',
    qrToken: 'QR-PRIYA-08',
    avatarInitials: 'PM',
    walletBalance: 1600,
    isEwyl: true,
    rollNo: 'DUK/2024/MSC/ECE/009',
    campus: 'Technopark Phase IV',
    hostelBlock: 'Periyar Block B, Room 102',
  },
  {
    id: 'stu-09',
    name: 'Sreehari Raj',
    school: 'SoCSE',
    department: 'Computer Science & Engineering',
    course: 'M.Tech Computer Science & Engineering',
    specialization: 'Cyber Security Engineering',
    degreeLevel: 'M.Tech',
    year: 1,
    email: 'sreehari.cs27@duk.ac.in',
    qrToken: 'QR-SREEHARI-09',
    avatarInitials: 'SR',
    walletBalance: 90,
    isEwyl: false,
    rollNo: 'DUK/2025/MTECH/CS/028',
    campus: 'Technopark Phase IV',
    hostelBlock: 'Nila Block B, Room 215',
  },
  {
    id: 'stu-10',
    name: 'Meera Krishnan',
    school: 'SoDiHLA',
    department: 'Digital Humanities & Liberal Arts',
    course: 'MA Digital Humanities',
    specialization: 'Computational Culture & Heritage',
    degreeLevel: 'MA',
    year: 1,
    email: 'meera.sodihla25@duk.ac.in',
    qrToken: 'QR-MEERA-10',
    avatarInitials: 'MK',
    walletBalance: 1450,
    isEwyl: false,
    rollNo: 'DUK/2025/MA/DH/003',
    campus: 'Technopark Phase IV',
    hostelBlock: 'Periyar Block A, Room 114',
  },
  {
    id: 'stu-11',
    name: 'Vivek Nambisan',
    school: 'SoCSE',
    department: 'Computer Science & Engineering',
    course: 'PhD in Computer Science & AI',
    specialization: 'Kairali Microarchitecture & Edge AI',
    degreeLevel: 'PhD',
    year: 3,
    email: 'vivek.phd23@duk.ac.in',
    qrToken: 'QR-VIVEK-11',
    avatarInitials: 'VN',
    walletBalance: 2700,
    isEwyl: true,
    rollNo: 'DUK/2023/PHD/CS/002',
    campus: 'Technopark Phase IV',
    hostelBlock: 'Scholar Quarters Q-04',
  },
  {
    id: 'stu-12',
    name: 'Roshni George',
    school: 'SoDS',
    department: 'Digital Sciences',
    course: 'M.Sc Data Science & Fintech',
    specialization: 'Algorithmic Trading & Blockchain',
    degreeLevel: 'M.Sc',
    year: 2,
    email: 'roshni.sods26@duk.ac.in',
    qrToken: 'QR-ROSHNI-12',
    avatarInitials: 'RG',
    walletBalance: 1900,
    isEwyl: true,
    rollNo: 'DUK/2024/MSC/FIN/011',
    campus: 'Technopark Phase IV',
    hostelBlock: 'Periyar Block B, Room 205',
  },
]

// ─── Complaints ───
export function generateComplaints(): Complaint[] {
  return [
    {
      id: id(), refId: 'CMP-A7F3E1', studentId: 'stu-01', category: 'Technical',
      title: 'Wi-Fi AP degraded in Kabani Block — 2nd Floor Computing Lab',
      description: 'The Wi-Fi access point near Room 204 in Kabani Academic Block has packet drops since yesterday morning. Scholars in the SoCSE computing lab cannot connect to the server cluster. Affecting model training schedules.',
      photoUrl: null, priority: 'Urgent', status: 'In Progress', assignedTo: 'IT Department',
      isAnonymous: false, upvotes: 14, createdAt: now - 2 * hour, resolvedAt: null, rating: null,
      comments: [
        { id: id(), author: 'Arjun Menon', authorRole: 'student', content: 'This has been happening intermittently for the past week, but now latency spikes over 800ms.', createdAt: now - 2 * hour + 300000 },
        { id: id(), author: 'IT Support', authorRole: 'admin', content: 'We have identified the faulty access point on Switch-KAB-02. A replacement Cisco AP is being configured now.', createdAt: now - 1 * hour },
      ],
    },
    {
      id: id(), refId: 'CMP-B2D9C4', studentId: 'stu-03', category: 'Hostel',
      title: 'Geyser heating coil tripped — Nila Hostel Block A, Room 112',
      description: 'The geyser in the common bathroom on the 1st floor of Nila Hostel Block A has stopped heating water. Cold water showers in the morning are uncomfortable during early VLSI lab hours.',
      photoUrl: null, priority: 'Normal', status: 'Assigned', assignedTo: 'Maintenance',
      isAnonymous: false, upvotes: 9, createdAt: now - 18 * hour, resolvedAt: null, rating: null,
      comments: [
        { id: id(), author: 'Maintenance Dept', authorRole: 'admin', content: 'Acknowledged. Campus electrical team will replace the geyser thermostat tomorrow between 10 AM and 12 PM.', createdAt: now - 12 * hour },
      ],
    },
    {
      id: id(), refId: 'CMP-C5E8A2', studentId: 'stu-06', category: 'Mess',
      title: 'RO filtration filter indicator overdue — Technopark IV Central Mess',
      description: 'The RO water dispenser near the South Dining Hall counter is showing red on the filter lifespan indicator. Water taste is noticeably hard. Requesting timely cartridge replacement.',
      photoUrl: null, priority: 'Urgent', status: 'Submitted', assignedTo: null,
      isAnonymous: false, upvotes: 18, createdAt: now - 4 * hour, resolvedAt: null, rating: null,
      comments: [],
    },
    {
      id: id(), refId: 'CMP-D1F4B7', studentId: 'stu-02', category: 'Academic',
      title: '4K Projector HDMI artifacting — Kabani Lecture Hall 3 (LH-3)',
      description: 'The overhead laser projector in LH-3 flickers with purple color fringes when displaying molecular structure graphics. BioAI seminars are scheduled here tomorrow afternoon.',
      photoUrl: null, priority: 'Normal', status: 'Resolved', assignedTo: 'AV Department',
      isAnonymous: false, upvotes: 6, createdAt: now - 5 * day, resolvedAt: now - 2 * day, rating: 5,
      comments: [
        { id: id(), author: 'AV Department', authorRole: 'admin', content: 'High-speed 4K fiber HDMI patch cable has been installed and color calibration verified.', createdAt: now - 3 * day },
        { id: id(), author: 'Ananya Nair', authorRole: 'student', content: 'Confirmed — tested with PyMOL display this morning, perfectly crisp. Thank you!', createdAt: now - 2 * day },
      ],
    },
    {
      id: id(), refId: 'CMP-E3A6D9', studentId: 'stu-08', category: 'Technical',
      title: 'Workstation WS-09 CUDA driver kernel panic — SoCSE Kairali AI Lab',
      description: 'Workstation 09 in the Kairali Computing Lab crashes with a kernel panic whenever PyTorch loads CUDA drivers. Affecting SoCSE research students training LLM quantization weights.',
      photoUrl: null, priority: 'Normal', status: 'In Progress', assignedTo: 'IT Department',
      isAnonymous: false, upvotes: 5, createdAt: now - 36 * hour, resolvedAt: null, rating: null,
      comments: [],
    },
    {
      id: id(), refId: 'CMP-F7B2E5', studentId: 'stu-10', category: 'Other',
      title: 'Solar bollard light malfunctioning along Digital Science Park walkway',
      description: 'The solar walkway light between Kabani Academic Block and Maker Village is flickering dark after 7:30 PM. Path gets pitch black for scholars walking to evening lab shifts.',
      photoUrl: null, priority: 'Low', status: 'Submitted', assignedTo: null,
      isAnonymous: true, upvotes: 7, createdAt: now - 48 * hour, resolvedAt: null, rating: null,
      comments: [],
    },
    {
      id: id(), refId: 'CMP-G9C1F8', studentId: 'stu-05', category: 'Hostel',
      title: 'AC duct airflow restricted — Periyar Hostel Study Room 2',
      description: 'The secondary air conditioning unit in Periyar Block B study hall is blowing ambient air and making a vibrating hum. Room is packed with MBA finance scholars preparing project pitches.',
      photoUrl: null, priority: 'Normal', status: 'Resolved', assignedTo: 'Maintenance',
      isAnonymous: false, upvotes: 3, createdAt: now - 7 * day, resolvedAt: now - 4 * day, rating: 5,
      comments: [
        { id: id(), author: 'Maintenance Dept', authorRole: 'admin', content: 'Filter serviced and refrigerant topped up. Thermostat set to 24°C.', createdAt: now - 5 * day },
        { id: id(), author: 'Rohit Thomas', authorRole: 'student', content: 'Cool and quiet now. Thank you maintenance team!', createdAt: now - 4 * day },
      ],
    },
    {
      id: id(), refId: 'CMP-H4D7A3', studentId: 'stu-12', category: 'Academic',
      title: 'Attendance discrepancy for CS701 (Advanced AI) — Semester III',
      description: 'My biometric attendance log shows 74% for CS701, but 2 approved industry hackathon attendances with Dr. Elizabeth have not been credited yet.',
      photoUrl: null, priority: 'Urgent', status: 'Assigned', assignedTo: 'Academic Office',
      isAnonymous: false, upvotes: 2, createdAt: now - 8 * hour, resolvedAt: null, rating: null,
      comments: [],
    },
    {
      id: id(), refId: 'CMP-I6E9B1', studentId: 'stu-04', category: 'Mess',
      title: 'Request for Kerala traditional brown rice option in South Dining Block',
      description: 'Several students from the School of Informatics request having Matta rice alongside white rice during lunch hours for balanced nutrition.',
      photoUrl: null, priority: 'Normal', status: 'Submitted', assignedTo: null,
      isAnonymous: false, upvotes: 22, createdAt: now - 6 * hour, resolvedAt: null, rating: null,
      comments: [],
    },
  ]
}

// ─── Mess Menu ───
export function generateWeeklyMenu(): DayMenu[] {
  const menuData: { meals: Omit<MenuItem, 'price'>[] }[] = [
    { meals: [
      { mealType: 'Breakfast', items: ['Idli', 'Sambar', 'Coconut Chutney', 'Banana'], isVeg: true },
      { mealType: 'Lunch', items: ['Rice', 'Fish Curry', 'Thoran', 'Rasam', 'Papad'], isVeg: false },
      { mealType: 'Dinner', items: ['Chapati', 'Paneer Butter Masala', 'Dal Fry', 'Salad'], isVeg: true },
    ]},
    { meals: [
      { mealType: 'Breakfast', items: ['Dosa', 'Tomato Chutney', 'Potato Masala', 'Tea'], isVeg: true },
      { mealType: 'Lunch', items: ['Rice', 'Chicken Curry', 'Avial', 'Buttermilk', 'Pickle'], isVeg: false },
      { mealType: 'Dinner', items: ['Parotta', 'Egg Roast', 'Vegetable Stew', 'Payasam'], isVeg: false },
    ]},
    { meals: [
      { mealType: 'Breakfast', items: ['Puttu', 'Kadala Curry', 'Pappadam', 'Boiled Egg'], isVeg: false },
      { mealType: 'Lunch', items: ['Rice', 'Sambar', 'Cabbage Thoran', 'Curd', 'Mango Pickle'], isVeg: true },
      { mealType: 'Dinner', items: ['Fried Rice', 'Gobi Manchurian', 'Tomato Soup', 'Ice Cream'], isVeg: true },
    ]},
    { meals: [
      { mealType: 'Breakfast', items: ['Appam', 'Veg Stew', 'Banana', 'Coffee'], isVeg: true },
      { mealType: 'Lunch', items: ['Rice', 'Prawn Masala', 'Beans Mezhukkupuratti', 'Rasam'], isVeg: false },
      { mealType: 'Dinner', items: ['Chapati', 'Chole Masala', 'Jeera Rice', 'Raita'], isVeg: true },
    ]},
    { meals: [
      { mealType: 'Breakfast', items: ['Upma', 'Coconut Chutney', 'Vada', 'Tea'], isVeg: true },
      { mealType: 'Lunch', items: ['Biriyani (Chicken)', 'Raita', 'Salad', 'Pappad'], isVeg: false },
      { mealType: 'Dinner', items: ['Roti', 'Mushroom Masala', 'Mixed Veg', 'Sweet'], isVeg: true },
    ]},
    { meals: [
      { mealType: 'Breakfast', items: ['Poori', 'Potato Curry', 'Pickle', 'Milk'], isVeg: true },
      { mealType: 'Lunch', items: ['Rice', 'Fish Fry', 'Sambar', 'Olan', 'Papad'], isVeg: false },
      { mealType: 'Dinner', items: ['Noodles', 'Manchurian', 'Fried Rice', 'Soup'], isVeg: true },
    ]},
    { meals: [
      { mealType: 'Breakfast', items: ['Idiyappam', 'Egg Curry', 'Coconut Milk', 'Fruits'], isVeg: false },
      { mealType: 'Lunch', items: ['Rice', 'Veg Kurma', 'Parippu', 'Buttermilk', 'Achaar'], isVeg: true },
      { mealType: 'Dinner', items: ['Chapati', 'Butter Chicken', 'Dal Tadka', 'Gulab Jamun'], isVeg: false },
    ]},
  ]

  const prices: Record<string, number> = { Breakfast: 30, Lunch: 60, Dinner: 50 }
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return menuData.map((dayData, i) => {
    const date = new Date(today.getTime() + i * day)
    return {
      date: date.toISOString().split('T')[0],
      dayName: dayNames[date.getDay()],
      meals: dayData.meals.map(m => ({
        ...m,
        price: prices[m.mealType],
      })),
    }
  })
}

// ─── Meal Bookings ───
export function generateMealBookings(): MealBooking[] {
  return [
    { id: id(), studentId: 'stu-01', date: new Date(now).toISOString().split('T')[0], mealType: 'Breakfast', status: 'served', price: 30, bookedAt: now - 14 * hour },
    { id: id(), studentId: 'stu-01', date: new Date(now).toISOString().split('T')[0], mealType: 'Lunch', status: 'booked', price: 60, bookedAt: now - 10 * hour },
    { id: id(), studentId: 'stu-02', date: new Date(now).toISOString().split('T')[0], mealType: 'Breakfast', status: 'served', price: 30, bookedAt: now - 15 * hour },
    { id: id(), studentId: 'stu-02', date: new Date(now).toISOString().split('T')[0], mealType: 'Lunch', status: 'booked', price: 60, bookedAt: now - 9 * hour },
    { id: id(), studentId: 'stu-02', date: new Date(now).toISOString().split('T')[0], mealType: 'Dinner', status: 'booked', price: 50, bookedAt: now - 8 * hour },
    { id: id(), studentId: 'stu-03', date: new Date(now).toISOString().split('T')[0], mealType: 'Lunch', status: 'booked', price: 60, bookedAt: now - 11 * hour },
    { id: id(), studentId: 'stu-05', date: new Date(now).toISOString().split('T')[0], mealType: 'Breakfast', status: 'skipped', price: 30, bookedAt: now - 16 * hour },
    { id: id(), studentId: 'stu-05', date: new Date(now).toISOString().split('T')[0], mealType: 'Dinner', status: 'booked', price: 50, bookedAt: now - 7 * hour },
  ]
}

// ─── Wallet Transactions ───
export function generateWalletTxns(): WalletTxn[] {
  return [
    { id: id(), studentId: 'stu-01', amount: 2000, type: 'topup', description: 'Initial top-up', createdAt: now - 10 * day, balanceAfter: 2000 },
    { id: id(), studentId: 'stu-01', amount: -60, type: 'deduction', description: 'Lunch booking', createdAt: now - 10 * hour, balanceAfter: 1940 },
    { id: id(), studentId: 'stu-01', amount: -30, type: 'deduction', description: 'Breakfast booking', createdAt: now - 14 * hour, balanceAfter: 1910 },
    { id: id(), studentId: 'stu-01', amount: -60, type: 'deduction', description: 'Lunch booking', createdAt: now - 2 * day, balanceAfter: 1850 },
    { id: id(), studentId: 'stu-03', amount: 1500, type: 'topup', description: 'Initial top-up', createdAt: now - 15 * day, balanceAfter: 1500 },
    { id: id(), studentId: 'stu-03', amount: -60, type: 'deduction', description: 'Lunch booking', createdAt: now - 11 * hour, balanceAfter: 1040 },
    { id: id(), studentId: 'stu-03', amount: 50, type: 'refund', description: 'Dinner skip refund', createdAt: now - 1 * day, balanceAfter: 1100 },
    { id: id(), studentId: 'stu-09', amount: 500, type: 'topup', description: 'Initial top-up', createdAt: now - 20 * day, balanceAfter: 500 },
    { id: id(), studentId: 'stu-09', amount: -60, type: 'deduction', description: 'Lunch booking', createdAt: now - 3 * day, balanceAfter: 150 },
    { id: id(), studentId: 'stu-09', amount: -60, type: 'deduction', description: 'Lunch booking', createdAt: now - 1 * day, balanceAfter: 90 },
  ]
}

// ─── Gate Logs ───
export function generateGateLogs(): GateLog[] {
  const purposes = ['Class', 'Library', 'Lab', 'Project work', 'Hostel', 'Event', 'Other']
  const destinations = [
    'Kabani Academic Block',
    'Central Library (24h Reading Room)',
    'Kairali AI Chip Lab',
    'Maker Village VLSI Lab',
    'Nila Hostel Block',
    'Periyar Hostel Block',
    'Digital Science Park Shuttle Post',
    'Central Dining Block',
  ]

  const currently_inside: GateLog[] = [
    { id: id(), studentId: 'stu-01', studentName: 'Arjun Menon', department: 'Computer Science & Engineering', entryTime: now - 2 * hour, exitTime: null, purpose: 'Lab', destination: 'Kairali AI Chip Lab' },
    { id: id(), studentId: 'stu-02', studentName: 'Ananya Nair', department: 'Digital Sciences', entryTime: now - 4 * hour, exitTime: null, purpose: 'Class', destination: 'Kabani Academic Block' },
    { id: id(), studentId: 'stu-03', studentName: 'Rahul Krishnan', department: 'Electronic Systems & Automation', entryTime: now - 1 * hour, exitTime: null, purpose: 'Lab', destination: 'Maker Village VLSI Lab' },
    { id: id(), studentId: 'stu-04', studentName: 'Kavya Warrier', department: 'Informatics', entryTime: now - 3 * hour, exitTime: null, purpose: 'Library', destination: 'Central Library (24h Reading Room)' },
    { id: id(), studentId: 'stu-05', studentName: 'Rohit Thomas', department: 'Digital Humanities & Liberal Arts', entryTime: now - 30 * 60000, exitTime: null, purpose: 'Class', destination: 'Kabani Academic Block' },
    { id: id(), studentId: 'stu-08', studentName: 'Priya Mohan', department: 'Electronic Systems & Automation', entryTime: now - 5 * hour, exitTime: null, purpose: 'Project work', destination: 'Maker Village VLSI Lab' },
    { id: id(), studentId: 'stu-11', studentName: 'Vivek Nambisan', department: 'Computer Science & Engineering', entryTime: now - 6 * hour, exitTime: null, purpose: 'Lab', destination: 'Kairali AI Chip Lab' },
    { id: id(), studentId: 'stu-12', studentName: 'Roshni George', department: 'Digital Sciences', entryTime: now - 45 * 60000, exitTime: null, purpose: 'Library', destination: 'Central Library (24h Reading Room)' },
  ]

  const closed: GateLog[] = Array.from({ length: 17 }, (_, i) => {
    const stuIdx = (i % students.length)
    const stu = students[stuIdx]
    const entryOffset = (i + 1) * 2 * hour + Math.random() * hour
    const duration = 30 * 60000 + Math.random() * 4 * hour
    return {
      id: id(),
      studentId: stu.id,
      studentName: stu.name,
      department: stu.department,
      entryTime: now - entryOffset - duration,
      exitTime: now - entryOffset,
      purpose: purposes[i % purposes.length],
      destination: destinations[i % destinations.length],
    }
  })

  return [...currently_inside, ...closed]
}

// ─── Notifications ───
export function generateNotifications(): Notification[] {
  return [
    { id: id(), title: 'Complaint Update', message: 'Your complaint "Wi-Fi not working in Block B" has been assigned to IT Department.', type: 'update', read: false, createdAt: now - 1 * hour, link: '/app/complaints' },
    { id: id(), title: 'Meal Reminder', message: 'Tomorrow\'s lunch booking closes at 8:00 PM today. Book now to avoid missing out.', type: 'reminder', read: false, createdAt: now - 2 * hour, link: '/app/mess' },
    { id: id(), title: 'Low Wallet Balance', message: 'Your mess wallet balance is below ₹100. Top up to continue booking meals.', type: 'alert', read: false, createdAt: now - 3 * hour, link: '/app/mess/wallet' },
    { id: id(), title: 'Gate Entry Logged', message: 'Your campus entry at 2:30 PM has been recorded. Purpose: Lab.', type: 'update', read: true, createdAt: now - 4 * hour, link: '/app/gate/history' },
    { id: id(), title: 'Complaint Resolved', message: 'Your complaint "Projector malfunction in LH-3" has been resolved. Rate your experience.', type: 'update', read: true, createdAt: now - 2 * day, link: '/app/complaints' },
    { id: id(), title: 'Scheduled Maintenance', message: 'Campus Wi-Fi will undergo maintenance on Saturday 10 PM to Sunday 6 AM.', type: 'alert', read: false, createdAt: now - 5 * hour },
  ]
}

// ─── Visitors ───
export function generateVisitors(): Visitor[] {
  return [
    { id: id(), name: 'Suresh Kumar', phone: '9876543210', hostStudentId: 'stu-01', hostStudentName: 'Arjun Menon', validUntil: now + 4 * hour, purpose: 'Parent visit' },
    { id: id(), name: 'Dr. Ramachandran', phone: '9845612378', hostStudentId: 'stu-02', hostStudentName: 'Meera Krishnan', validUntil: now + 2 * hour, purpose: 'Guest lecture' },
  ]
}

// ─── Seed initializer ───
export interface SeedData {
  seedVersion: string
  seededAt: number
  isAuthenticated: boolean
  students: Student[]
  complaints: Complaint[]
  weeklyMenu: DayMenu[]
  mealBookings: MealBooking[]
  walletTxns: WalletTxn[]
  gateLogs: GateLog[]
  notifications: Notification[]
  visitors: Visitor[]
  currentRole: string
  currentStudentId: string
}

export function createSeedData(): SeedData {
  return {
    seedVersion: SEED_VERSION,
    seededAt: Date.now(),
    isAuthenticated: false,
    students,
    complaints: generateComplaints(),
    weeklyMenu: generateWeeklyMenu(),
    mealBookings: generateMealBookings(),
    walletTxns: generateWalletTxns(),
    gateLogs: generateGateLogs(),
    notifications: generateNotifications(),
    visitors: generateVisitors(),
    currentRole: 'student',
    currentStudentId: 'stu-01',
  }
}
