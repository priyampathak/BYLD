'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { repository } from '../db/repository';

interface AuthContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchUser: (userId: string) => void;
  logout: () => void;
  allUsers: User[];
  isAccountManager: boolean;
  isOpsDelivery: boolean;
  isSalesLeadership: boolean;
}

const AUTH_STORAGE_KEY = 'byld_active_user_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const users = repository.getUsers();
    return users[0]; // Priya Pathak default
  });

  useEffect(() => {
    const users = repository.getUsers();
    setAllUsers(users);

    const storedUserId = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUserId) {
      const found = users.find((u) => u.id === storedUserId);
      if (found) {
        setCurrentUser(found);
      }
    }
  }, []);

  const switchUser = (userId: string) => {
    const found = allUsers.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem(AUTH_STORAGE_KEY, userId);
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const isAccountManager = currentUser.role === 'account_manager';
  const isOpsDelivery = currentUser.role === 'ops_delivery';
  const isSalesLeadership = currentUser.role === 'sales_leadership';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser: (user) => {
          setCurrentUser(user);
          localStorage.setItem(AUTH_STORAGE_KEY, user.id);
        },
        switchUser,
        logout,
        allUsers,
        isAccountManager,
        isOpsDelivery,
        isSalesLeadership,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
