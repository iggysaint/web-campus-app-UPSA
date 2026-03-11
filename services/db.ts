
import { 
  initialAnnouncements, 
  initialBookings, 
  initialClubs, 
  initialPolls, 
  initialSchedules, 
  initialStudents,
  libraryFiles,
  currentUser
} from '../mockData';

const DB_KEY = 'merix_upsa_db';

export const db = {
  init: () => {
    if (!localStorage.getItem(DB_KEY)) {
      const initialDb = {
        announcements: initialAnnouncements,
        bookings: initialBookings,
        clubs: initialClubs,
        polls: initialPolls,
        schedules: initialSchedules,
        students: initialStudents,
        library: libraryFiles,
        user: currentUser
      };
      localStorage.setItem(DB_KEY, JSON.stringify(initialDb));
    }
  },

  get: (key: string) => {
    const data = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    return data[key] || [];
  },

  save: (key: string, value: any) => {
    const data = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    data[key] = value;
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  }
};
