
import { User, Announcement, ClassSchedule, Hostel, Club, Poll, LibraryFile, HostelBooking } from './types';

export let currentUser: User = {
  id: 'u1',
  name: 'Sarah Johnson',
  email: 'admin@upsa.edu.gh',
  role: 'admin',
  gender: 'female',
  studentId: 'STU2024001',
  program: 'Computer Science',
  profileImage: 'https://picsum.photos/200/200?random=1',
  createdAt: '2024-01-01T00:00:00Z'
};

export const initialStudents: User[] = [
  { id: 'u1', name: 'Sarah Johnson', email: 'admin@upsa.edu.gh', role: 'admin', gender: 'female', studentId: 'STU001', program: 'CS', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'u2', name: 'John Doe', email: 'student@upsa.edu.gh', role: 'student', gender: 'male', studentId: 'STU002', program: 'Business', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'u3', name: 'Ama Serwaa', email: 'ama@edu.gh', role: 'student', gender: 'female', studentId: 'STU003', program: 'Law', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'u4', name: 'Kofi Mensah', email: 'kofi@edu.gh', role: 'student', gender: 'male', studentId: 'STU004', program: 'Accounting', createdAt: '2024-01-01T00:00:00Z' }
];

export const initialBookings: HostelBooking[] = [
  { id: 'b1', userId: 'u2', userName: 'John Doe', hostelId: 'h1', hostelName: 'Hostel A', roomNumber: 201, price: 2650, status: 'pending', date: '2024-03-08' },
  { id: 'b2', userId: 'u3', userName: 'Ama Serwaa', hostelId: 'h2', hostelName: 'Hostel B', roomNumber: 315, price: 3850, status: 'booked', date: '2024-03-07' }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'a1',
    title: 'Student ID Card Renewal',
    message: 'All students whose ID cards expire this semester must visit the Student Affairs office for renewal. Deadline: March 20th.',
    category: 'URGENT',
    created_at: '2024-03-08T10:00:00Z',
    target_type: 'all',
    is_active: true,
    authorId: 'u1'
  },
  {
    id: 'a2',
    title: 'Mid-Semester Examinations',
    message: 'Mid-semester examinations will commence on March 15th, 2024. All students are expected to be present 30 minutes before.',
    category: 'ACADEMIC',
    created_at: '2024-03-01T10:00:00Z',
    target_type: 'all',
    is_active: true,
    authorId: 'u1'
  }
];

export const initialSchedules: ClassSchedule[] = [
  {
    id: 's1',
    course_id: 'CS401',
    course_name: 'Computer Networks',
    instructor_name: 'Dr. Fatima Ibrahim',
    day_of_week: 'Wednesday',
    start_time: '08:00',
    end_time: '10:00',
    location: 'Lab 2, Ground Floor',
    semester: '1st SEM 2024'
  }
];

export const hostels: Hostel[] = [
  {
    id: 'h1',
    name: 'Hostel A',
    total_floors: 7,
    description: 'Premium hostel with 7 floors of modern amenities',
    image: 'https://picsum.photos/400/300?random=10'
  },
  {
    id: 'h2',
    name: 'Hostel B',
    total_floors: 9,
    description: 'Spacious 9-floor hostel with excellent ventilation',
    image: 'https://picsum.photos/400/300?random=11'
  },
  {
    id: 'h3',
    name: 'Hostel C',
    total_floors: 9,
    description: 'Contemporary 9-floor student residence',
    image: 'https://picsum.photos/400/300?random=12'
  }
];

export const initialClubs: Club[] = [
  {
    id: 'c1',
    name: 'Tech Innovation Club',
    description: 'Exploring cutting-edge technologies.',
    category: 'Technology',
    members: 245,
    whatsapp_link: 'https://chat.whatsapp.com/example1',
    image: 'https://picsum.photos/400/200?random=20'
  },
  {
    id: 'c2',
    name: 'Debate Society',
    description: 'Sharpen your public speaking skills.',
    category: 'Academic',
    members: 110,
    whatsapp_link: 'https://chat.whatsapp.com/example2',
    image: 'https://picsum.photos/400/200?random=21'
  }
];

export const initialPolls: Poll[] = [
  {
    id: 'p1',
    question: 'Who should be the next SRC President?',
    options: ['John Mahama', 'Kojo Oppong', 'Abena Mansa'],
    votes: { 'John Mahama': 45, 'Kojo Oppong': 32, 'Abena Mansa': 23 },
    totalVotes: 100,
    hasVoted: false,
    endDate: '2024-04-15',
    status: 'open',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const libraryFiles: LibraryFile[] = [
  {
    id: 'f1',
    name: 'Accounting Past Questions 2023.pdf',
    type: 'past_questions',
    course: 'BA101',
    size: '2.0 MB',
    date: 'Feb 28, 2024',
    downloads: 198
  }
];
