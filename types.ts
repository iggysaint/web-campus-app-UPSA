
export type Role = 'student' | 'admin';
export type Gender = 'male' | 'female';
export type FileType = 'slides' | 'past_questions' | 'notes' | 'other' | 'books';
export type BookingStatus = 'pending' | 'booked' | 'rejected';
export type TargetType = 'all' | 'program' | 'course';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  gender: Gender;
  studentId?: string;
  program?: string;
  profileImage?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  category: 'URGENT' | 'ACADEMIC' | 'GENERAL' | 'EVENT';
  created_at: string; // ISO String for consistency
  target_type: TargetType;
  is_active: boolean;
  authorId: string; // Reference to Admin User
}

export interface ClassSchedule {
  id: string;
  course_id: string;
  course_name: string;
  instructor_name: string;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time: string; // HH:mm format
  end_time: string; // HH:mm format
  location: string;
  semester: string;
}

export interface Hostel {
  id: string;
  name: string;
  total_floors: number;
  description: string;
  image: string;
}

export interface HostelBooking {
  id: string;
  userId: string; // Reference to User
  userName: string; // Denormalized for quick display
  hostelId: string; // Reference to Hostel
  hostelName: string; // Denormalized
  roomNumber: number;
  price: number;
  status: BookingStatus;
  date: string; // ISO String
}

export interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  members: number;
  whatsapp_link: string;
  image: string;
}

export interface PollOption {
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: string[]; // Option names
  votes: Record<string, number>; // OptionName -> VoteCount
  totalVotes: number;
  hasVoted: boolean; // Computed for current user
  endDate: string; // ISO Date
  status: 'open' | 'closed';
  createdAt: string;
}

export interface LibraryFile {
  id: string;
  name: string;
  type: FileType;
  course: string;
  size: string;
  date: string;
  downloads: number;
  url?: string;
}

export interface HelpRequest {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  date: string;
}
