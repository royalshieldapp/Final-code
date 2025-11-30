export type Screen =
  | 'auth'
  | 'sos'
  | 'gallery'
  | 'map'
  | 'advanced'
  | 'settings'
  | 'intelligence'
  | 'decoy';

export interface User {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  isPremium: boolean;
  realPin?: string;
  fakePin?: string;
}

export interface Contact {
  id: string;
  name: string;
  contact: string;
}

export interface AppSettings {
  notifications: boolean;
  sound: boolean;
  sensitivity: 'low' | 'medium' | 'high';
  defaultAction: 'sms' | 'email' | 'push' | 'call';
}

export interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  timestamp: string;
}

export interface CyberAttackPoint {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  lat: number;
  lng: number;
}

export interface DeviceInfo {
  name: string;
  ip: string;
  type: string;
  status?: string;
}
