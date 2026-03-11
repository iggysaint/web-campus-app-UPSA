
import React from 'react';
import { 
  Home, 
  Calendar, 
  Users, 
  BookOpen, 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  Building,
  CheckCircle2,
  Vote,
  FileText,
  Download,
  Search,
  ChevronRight,
  Info
} from 'lucide-react';

export const COLORS = {
  primary: '#0088CC',
  secondary: '#F8FAFC',
  text: '#1E293B',
  muted: '#64748B',
  urgent: '#EF4444',
  academic: '#10B981',
  general: '#6366F1',
  event: '#F59E0B'
};

export const ICONS = {
  Home,
  Schedule: Calendar,
  // Add Calendar to the ICONS object to resolve "Property 'Calendar' does not exist" errors in views
  Calendar,
  Clubs: Users,
  Library: BookOpen,
  Profile: User,
  // Add User to the ICONS object to resolve "Property 'User' does not exist" errors in views
  User,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Building,
  CheckCircle2,
  Vote,
  FileText,
  Download,
  Search,
  ChevronRight,
  Info
};
