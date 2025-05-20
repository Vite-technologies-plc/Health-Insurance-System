import { Admin } from '../types/user';
import { AdminType, UserType } from '../types/enums';

interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string | null;
    firstName: string;
    lastName: string;
    adminType: AdminType;
    userType: UserType;
    isActive: boolean;
    insuranceCompanyId: string | null;
    roles?: any[];
    permissions?: any;
  };
  access_token: string;
}

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      console.log('Login Request:', JSON.stringify({
        requestData: { username, password: '********' },
        timestamp: new Date().toISOString()
      }, null, 2));

      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      // Log the exact JSON response from the backend with formatting
      console.group('Backend Response Details');
      console.log('Raw Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      console.log('JSON Data:', data);
      console.table(data.user); // Shows user data in table format
      console.groupEnd();

      // Create a complete user object with all required fields
      const completeUser: Admin = {
        id: data.user?.id ?? '',
        username: data.user?.username ?? '',
        email: data.user?.email ?? '',
        userType: data.user?.userType ?? '',
        insuranceCompanyId: data.user?.insuranceCompanyId ?? null,
        adminType: data.user?.adminType ?? '',
        firstName: data.user?.firstName ?? '',
        lastName: data.user?.lastName ?? '',
        phoneNumber: data.user?.phoneNumber ?? '',
        isActive: data.user?.isActive ?? true,
        lastLoginAt: data.user?.lastLoginAt ?? null,
        createdAt: data.user?.createdAt ? new Date(data.user.createdAt) : new Date(),
        updatedAt: data.user?.updatedAt ? new Date(data.user.updatedAt) : new Date(),
        corporateClientId: data.user?.corporateClientId ?? null,
        roles: data.user?.roles ?? [],
        permissions: data.user?.permissions ?? {},
      };

      // Log processed response
      console.log('Processed Response:', {
        user: completeUser,
        token: data.access_token ? '[PRESENT]' : '[MISSING]'
      });

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      return {
        access_token: data.access_token,
        user: completeUser
      };
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  }
};