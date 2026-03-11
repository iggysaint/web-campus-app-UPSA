
import { db } from './db';
import { logger } from './logger';
import { validate } from './validation';

const LATENCY = 400; // Simulated network delay

const delay = () => new Promise(resolve => setTimeout(resolve, LATENCY));

const handleRequest = async <T>(operation: () => Promise<T>, name: string): Promise<T> => {
  logger.info(`API Call: ${name} started`);
  try {
    await delay();
    const result = await operation();
    logger.info(`API Call: ${name} success`);
    return result;
  } catch (error: any) {
    logger.error(`API Call: ${name} failed`, error);
    throw error;
  }
};

export const api = {
  auth: {
    login: (email: string, password: string) => handleRequest(async () => {
      if (!validate.email(email)) throw new Error('Invalid email format');
      if (password.length < 6) throw new Error('Password must be at least 6 characters');

      const students = db.get('students');
      // Simple mock credential check
      const user = students.find((s: any) => s.email === email);
      
      if (!user || password !== 'password123') {
        throw new Error('Invalid email or password');
      }

      db.save('user', user);
      return user;
    }, 'Auth.login'),
    logout: () => {
      db.save('user', null);
    }
  },

  announcements: {
    getAll: () => handleRequest(async () => db.get('announcements'), 'Announcements.getAll'),
    create: (item: any) => handleRequest(async () => {
      validate.announcement(item);
      const items = db.get('announcements');
      const newItem = { 
        ...item, 
        id: crypto.randomUUID(), 
        created_at: new Date().toISOString(), 
        is_active: true 
      };
      db.save('announcements', [newItem, ...items]);
      return newItem;
    }, 'Announcements.create'),
    delete: (id: string) => handleRequest(async () => {
      const items = db.get('announcements');
      db.save('announcements', items.filter((i: any) => i.id !== id));
    }, 'Announcements.delete')
  },

  schedules: {
    getAll: () => handleRequest(async () => db.get('schedules'), 'Schedules.getAll'),
    create: (item: any) => handleRequest(async () => {
      validate.schedule(item);
      const items = db.get('schedules');
      const newItem = { ...item, id: crypto.randomUUID() };
      db.save('schedules', [newItem, ...items]);
      return newItem;
    }, 'Schedules.create'),
    delete: (id: string) => handleRequest(async () => {
      const items = db.get('schedules');
      db.save('schedules', items.filter((i: any) => i.id !== id));
    }, 'Schedules.delete')
  },

  clubs: {
    getAll: () => handleRequest(async () => db.get('clubs'), 'Clubs.getAll'),
    create: (item: any) => handleRequest(async () => {
      if (!item.name?.trim()) throw new Error('Club name is required');
      if (!item.description?.trim()) throw new Error('Description is required');
      const items = db.get('clubs');
      const newItem = { 
        ...item, 
        id: crypto.randomUUID(),
        members: Math.floor(Math.random() * 100) + 1,
        whatsapp_link: item.whatsapp || 'https://chat.whatsapp.com/invite/merix'
      };
      db.save('clubs', [newItem, ...items]);
      return newItem;
    }, 'Clubs.create'),
    delete: (id: string) => handleRequest(async () => {
      const items = db.get('clubs');
      db.save('clubs', items.filter((i: any) => i.id !== id));
    }, 'Clubs.delete')
  },

  polls: {
    getAll: () => handleRequest(async () => db.get('polls'), 'Polls.getAll'),
    create: (item: any) => handleRequest(async () => {
      validate.poll(item);
      const items = db.get('polls');
      const newItem = { 
        ...item, 
        id: crypto.randomUUID(), 
        votes: {}, 
        totalVotes: 0, 
        hasVoted: false, 
        status: 'open',
        createdAt: new Date().toISOString()
      };
      db.save('polls', [newItem, ...items]);
      return newItem;
    }, 'Polls.create'),
    vote: (pollId: string, option: string) => handleRequest(async () => {
      const items = db.get('polls');
      const updated = items.map((p: any) => {
        if (p.id === pollId) {
          if (p.hasVoted) throw new Error('You have already voted in this poll');
          if (p.status === 'closed') throw new Error('This poll is closed');
          return {
            ...p,
            hasVoted: true,
            totalVotes: (p.totalVotes || 0) + 1,
            votes: { ...p.votes, [option]: (p.votes[option] || 0) + 1 }
          };
        }
        return p;
      });
      db.save('polls', updated);
    }, 'Polls.vote'),
    delete: (id: string) => handleRequest(async () => {
      const items = db.get('polls');
      db.save('polls', items.filter((i: any) => i.id !== id));
    }, 'Polls.delete'),
    toggleStatus: (id: string) => handleRequest(async () => {
      const items = db.get('polls');
      db.save('polls', items.map((i: any) => i.id === id ? { ...i, status: i.status === 'open' ? 'closed' : 'open' } : i));
    }, 'Polls.toggleStatus')
  },

  bookings: {
    getAll: () => handleRequest(async () => db.get('bookings'), 'Bookings.getAll'),
    create: (item: any) => handleRequest(async () => {
      if (!item.hostelId || !item.roomNumber) throw new Error('Hostel and room selection required');
      const items = db.get('bookings');
      const newItem = { 
        ...item, 
        id: crypto.randomUUID(), 
        status: 'pending', 
        date: new Date().toISOString() 
      };
      db.save('bookings', [newItem, ...items]);
      return newItem;
    }, 'Bookings.create'),
    updateStatus: (id: string, status: string) => handleRequest(async () => {
      const items = db.get('bookings');
      db.save('bookings', items.map((i: any) => i.id === id ? { ...i, status } : i));
    }, 'Bookings.updateStatus')
  },

  library: {
    getAll: () => handleRequest(async () => db.get('library'), 'Library.getAll'),
    create: (item: any) => handleRequest(async () => {
      if (!item.name?.trim() || !item.course?.trim()) throw new Error('File name and course are required');
      const items = db.get('library');
      const newItem = { 
        ...item, 
        id: crypto.randomUUID(), 
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        downloads: 0,
        size: item.size || '1.0 MB'
      };
      db.save('library', [newItem, ...items]);
      return newItem;
    }, 'Library.create'),
    delete: (id: string) => handleRequest(async () => {
      const items = db.get('library');
      db.save('library', items.filter((i: any) => i.id !== id));
    }, 'Library.delete')
  },

  students: {
    getAll: () => handleRequest(async () => db.get('students'), 'Students.getAll')
  }
};
