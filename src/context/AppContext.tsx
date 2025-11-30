import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AppSettings, Contact, MediaItem, Screen, User } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';

interface AppContextProps {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
  sosActive: boolean;
  setSosActive: (active: boolean) => void;
  media: MediaItem[];
  addMedia: (item: MediaItem) => void;
  lastSentAt?: string;
  setLastSentAt: (value?: string) => void;
  isDecoy: boolean;
  setIsDecoy: (value: boolean) => void;
}

const defaultSettings: AppSettings = {
  notifications: true,
  sound: true,
  sensitivity: 'medium',
  defaultAction: 'sms',
};

const AppContext = createContext<AppContextProps | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<Screen>('auth');
  const [user, setUserState] = useState<User | null>(() => loadFromStorage('user', null));
  const [contacts, setContactsState] = useState<Contact[]>(() => loadFromStorage('contacts', []));
  const [settings, setSettingsState] = useState<AppSettings>(() => loadFromStorage('settings', defaultSettings));
  const [sosActive, setSosActive] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>(() => loadFromStorage('media', []));
  const [lastSentAt, setLastSentAt] = useState<string | undefined>();
  const [isDecoy, setIsDecoy] = useState(false);

  useEffect(() => {
    saveToStorage('user', user);
  }, [user]);

  useEffect(() => {
    saveToStorage('contacts', contacts);
  }, [contacts]);

  useEffect(() => {
    saveToStorage('settings', settings);
  }, [settings]);

  useEffect(() => {
    saveToStorage('media', media);
  }, [media]);

  const addMedia = (item: MediaItem) => {
    setMedia((prev) => [item, ...prev]);
  };

  const setUser = (value: User | null) => {
    setUserState(value);
    if (!value) {
      setIsDecoy(false);
    }
  };

  const setContacts = (value: Contact[]) => setContactsState(value);
  const setSettings = (value: AppSettings) => setSettingsState(value);

  const value = useMemo(
    () => ({
      screen,
      setScreen,
      user,
      setUser,
      contacts,
      setContacts,
      settings,
      setSettings,
      sosActive,
      setSosActive,
      media,
      addMedia,
      lastSentAt,
      setLastSentAt,
      isDecoy,
      setIsDecoy,
    }),
    [screen, user, contacts, settings, sosActive, media, lastSentAt, isDecoy]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('AppContext missing');
  return ctx;
};
