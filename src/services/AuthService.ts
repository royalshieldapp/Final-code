import { User } from '../types';

const AuthService = {
  register(data: Omit<User, 'isPremium'>): User {
    const newUser: User = { ...data, isPremium: false };
    return newUser;
  },
  login(email: string, password: string, userInStore: User | null): User | null {
    if (!userInStore) return null;
    if (userInStore.email === email && userInStore.password === password) return userInStore;
    return null;
  },
  social(provider: 'google' | 'apple'): User {
    return {
      fullName: `${provider.toUpperCase()} User`,
      email: `${provider}@example.com`,
      phone: '0000000000',
      password: 'oauth',
      isPremium: false,
    };
  },
};

export default AuthService;
