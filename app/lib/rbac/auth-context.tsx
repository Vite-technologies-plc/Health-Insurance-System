'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, MOCK_USERS, Resource, Action } from './models';
import { useRouter } from 'next/navigation';
import { roleService } from '../services/role-service';
import { authService } from '../services/auth-service';
import { Admin } from '../types/user';
import { AdminType, UserType } from '../types/enums';

interface AuthContextType {
  user: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (resource: Resource, action: Action) => boolean;
  hasUserPermission: (userId: string, resource: Resource, action: Action) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const validateAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token || !storedUser) {
        // Clear any partial auth data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('authState');
        localStorage.removeItem('permissions');
        localStorage.removeItem('userRole');
        localStorage.removeItem('sessionData');
        sessionStorage.clear();
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        // Validate token with backend
        const response = await fetch('http://localhost:3000/api/auth/validate', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Invalid token');
        }

        // Token is valid, set the user
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        // Clear invalid auth data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('authState');
        localStorage.removeItem('permissions');
        localStorage.removeItem('userRole');
        localStorage.removeItem('sessionData');
        sessionStorage.clear();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(username, password);
      
      // Log auth context processing
      console.log('Auth Context Processing:', JSON.stringify({
        timestamp: new Date().toISOString(),
        authentication: {
          hasToken: !!response.access_token,
          tokenPreview: response.access_token ? `${response.access_token.substring(0, 15)}...` : '[MISSING]'
        },
        userData: {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          userType: response.user.userType,
          adminType: response.user.adminType,
          isActive: response.user.isActive
        }
      }, null, 2));

      // Store token
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
      }
      
      // Use response directly instead of response.json()
      const data = response;

      if (!data.user) {
        throw new Error('No user returned from backend');
      }

      // Create a complete user object with all required fields
      const completeUser: Admin = {
        id: data.user?.id ?? '',
        username: data.user?.username ?? '',
        email: data.user?.email ?? '',
        userType: data.user?.userType ?? '',
        insuranceCompanyId: data.user?.insuranceCompanyId ?? null,
        adminType: data.user?.adminType ?? '',
        firstName: (data.user as any)?.firstName ?? '',
        lastName: (data.user as any)?.lastName ?? '',
        phoneNumber: (data.user as any)?.phoneNumber ?? '',
        isActive: data.user?.isActive ?? true,
        lastLoginAt: (data.user as any)?.lastLoginAt ?? null,
        createdAt: (data.user as any)?.createdAt ? new Date((data.user as any).createdAt) : new Date(),
        updatedAt: (data.user as any)?.updatedAt ? new Date((data.user as any).updatedAt) : new Date(),
        corporateClientId: (data.user as any)?.corporateClientId ?? null,
        roles: data.user?.roles ?? [],
        permissions: data.user?.permissions ?? {},
      };
      
      // Hardcode permissions for insurance admin if not present
      if (completeUser.adminType?.toUpperCase() === 'INSURANCE_ADMIN') {
        completeUser.permissions = {
          INSURANCE_ADMIN_DASHBOARD: true,
          INSURANCE_LIST: true,
          ADMIN_LIST: true
        };
      }
      
      // Log final processed user data
      console.log('Processed User Data:', JSON.stringify({
        timestamp: new Date().toISOString(),
        user: {
          ...completeUser,
          token: '[REDACTED]'
        },
        status: {
          hasRoles: Array.isArray(completeUser.roles) && completeUser.roles.length > 0,
          hasPermissions: Object.keys(completeUser.permissions).length > 0,
          isActive: completeUser.isActive,
          adminType: completeUser.adminType
        }
      }, null, 2));
      
      if (completeUser.isActive === false) {
        const message = `Account is inactive. Please contact your system administrator. (User: ${completeUser.username}, Type: ${completeUser.userType}, Admin Type: ${completeUser.adminType})`;
        setError(message);
        return false;
      }
      
      setUser(completeUser);
      localStorage.setItem('user', JSON.stringify(completeUser));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      
      // Log error in JSON format
      console.error('Auth Context Error:', JSON.stringify({
        timestamp: new Date().toISOString(),
        error: {
          message: errorMessage,
          type: err instanceof Error ? err.name : 'Unknown',
          details: err instanceof Error ? err.message : String(err)
        }
      }, null, 2));
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
        // First try to call the backend logout endpoint
        await fetch('http://localhost:3000/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            credentials: 'include'
        });
    } catch (error) {
        console.error('Logout error:', error);
        // Continue with local logout even if backend call fails
    } finally {
        // Clear all authentication data
        setUser(null);
        
        // Clear all localStorage items
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('authState');
        localStorage.removeItem('permissions');
        localStorage.removeItem('userRole');
        localStorage.removeItem('sessionData');
        
        // Clear any session storage
        sessionStorage.clear();
        
        // Clear any cookies
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        
        // Redirect to root path (where Login component is)
        router.push('/');
    }
  };
  
  const hasPermission = (resource: Resource, action: Action): boolean => {
    if (!user) return false;

    return Array.isArray(user.roles) && user.roles.some(role => 
      Array.isArray(role.permissions) && role.permissions.some(
        (permission: any) => permission.resource === resource && 
                     (permission.action === action || permission.action === Action.MANAGE)
      )
    );
  };
  
  const hasUserPermission = async (userId: string, resource: Resource, action: Action): Promise<boolean> => {
    // In a real app, you would make an API call to check permissions for any user
    // For demo purposes, we'll only check the current user
    if (!user) return false;
    if (user.id !== userId) return false;
    
    return hasPermission(resource, action);
  };
  
  const refreshUser = async (): Promise<void> => {
    if (!user) return;
    try {
      // In a real app, this would be an API call to get the latest user data
      // Here we're just refreshing the roles from our service
      const userTypeRoles = await roleService.getRolesByUserType(user.userType as any);
      // Combine existing roles with user type roles
      const combinedRoles = Array.isArray(user.roles) ? [...user.roles] : [];
      // Add user type roles if they don't already exist
      for (const role of userTypeRoles) {
        if (!Array.isArray(user.roles) || !user.roles.some(r => r.id === role.id)) {
          combinedRoles.push(role);
        }
      }
      const refreshedUser = {
        ...user,
        roles: combinedRoles
      };
      setUser(refreshedUser);
      localStorage.setItem('user', JSON.stringify(refreshedUser));
    } catch (err) {
      console.error('Failed to refresh user data', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        hasPermission,
        hasUserPermission,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 