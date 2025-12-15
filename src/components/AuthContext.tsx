import { apiDelete, apiGet, apiPost, apiPut } from '@/utils/apiFetch';
import apiPath from '@/utils/apiPath';
import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { ErrorToastMessage, SuccessToastMessage } from './common/sonner';
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'subadmin' | 'moderator' | 'viewer';
  avatar?: string;
  permissions?: string[];
  createdAt?: string;
  lastLogin?: string;
  status: 'active' | 'inactive';
  createdBy?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  results?: any;
}


export type CreateSubadminData = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address?: string;
  permissions: string[];
};

interface SubadminQueryPayload {
  sortType: string;
  sortBy: string;
  keyword: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users database
const MOCK_USERS: Record<string, User & { password: string }> = {
  'admin@example.com': {
    id: 'user-1',
    name: 'Super Administrator',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'super_admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: '2023-01-01',
    lastLogin: new Date().toISOString(),
    status: 'active'
  },
  'subadmin@example.com': {
    id: 'user-2',
    name: 'John Smith',
    email: 'subadmin@example.com',
    password: 'subadmin123',
    role: 'subadmin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=subadmin1',
    createdAt: '2023-02-15',
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    createdBy: 'user-1'
  },
  'moderator@example.com': {
    id: 'user-3',
    name: 'Jane Doe',
    email: 'moderator@example.com',
    password: 'moderator123',
    role: 'moderator',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=moderator1',
    createdAt: '2023-03-10',
    lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    createdBy: 'user-1'
  },
  'viewer@example.com': {
    id: 'user-4',
    name: 'Bob Wilson',
    email: 'viewer@example.com',
    password: 'viewer123',
    role: 'viewer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=viewer1',
    createdAt: '2023-04-05',
    lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    createdBy: 'user-1'
  }
};

export function AuthProvider({ children }: Readonly<AuthProviderProps>) {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState<User | null>(() =>
    window?.localStorage.getItem('token')
      ? jwtDecode(window?.localStorage.getItem('token'))
      : null
  )
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.isPasswordSet == false && location?.pathname !== '/change-password') {
      navigate('/change-password')
    }

  }, [user, location]);



  const cipher = salt => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0))
    const byteHex = n => ('0' + Number(n).toString(16)).slice(-2);
    const applySaltToChar = code =>
      textToChars(salt).reduce((a, b) => a ^ b, code)

    return text =>
      text.split('').map(textToChars).map(applySaltToChar).map(byteHex).join('')
  }
  const myCipher = cipher('mySecretSalt')

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      const { data } = await apiPost(apiPath.loginUser, { email, password })
      if (data?.success) {
        if (data?.results?.role === 'subAdmin' && !data?.results?.isPasswordSet) {
          const token = data?.results?.token ?? null
          const refresh_token = data?.results?.refresh_token ?? null
          localStorage.setItem('token', token)
          localStorage.setItem('refresh_token', refresh_token)
          setUser(jwtDecode(token))
          navigate('/change-password')
          return data as AuthResponse
        } else {
          const token = data?.results?.token ?? null
          const refreshToken = data?.results?.refresh_token ?? null
          window?.localStorage.setItem('token', token)
          window?.localStorage.setItem('refresh_token', refreshToken)
          setUser(jwtDecode(token))
          window.localStorage.setItem('pass', myCipher(password))
          navigate('/dashboard')
          return data as AuthResponse
        }

      } else {
        return data as AuthResponse
      }

    } catch (error) {
      const message = error?.response?.data?.message ?? 'Login failed';
      ErrorToastMessage({ message });
      return { success: false, message } as AuthResponse;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (type) => {
    setUser(null)
    window?.localStorage.removeItem('token')
    window?.localStorage.removeItem('refresh_token')
    navigate('/login')
    if (!type) {
      SuccessToastMessage({ message: 'Logout Successfully.' })
    }



  };

  const updateUser = async (userData: Partial<User>) => {

    try {
      const res = await apiPost(apiPath.editProfile, userData)
      if (res?.data?.success) {
        const token = res?.data?.results?.token ?? null
        const refreshToken = res?.data?.results?.refresh_token ?? null
        window?.localStorage.setItem('token', token)
        window?.localStorage.setItem('refresh_token', refreshToken)
        setUser(jwtDecode(token))
        SuccessToastMessage({ message: res?.data?.message })

      }
    } catch (err) {
      console.error('err:', err)
      ErrorToastMessage({ message: err?.response?.data?.message })
    }

  };

  const isAuthenticated = !!user;


  const authValue = useMemo(() => ({
      user,
      isAuthenticated,
      login,
      logout,
      updateUser,
      isLoading,
    }),
    [user, isAuthenticated, login, logout, updateUser, isLoading]
  );

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Subadmin management functions (these would typically be API calls)
export const subadminAPI = {
  getSubadmins: async (payload: SubadminQueryPayload): Promise<User[]> => {
    try {
      const resp = await apiGet(apiPath.getSubadmin, payload)
      if (resp?.data?.success) {
        return resp?.data?.results as User[];
      }
      return []

    } catch (error) {
      console.error('Failed to fetch subadmins:', error);
      return []; // or throw error if you want the caller to handle it
    }

  },


  createSubadmin: async (
    subadminData: CreateSubadminData,
    navigate?: (path: string) => void
  ): Promise<User | undefined> => {
    try {
      const response = await apiPost(apiPath.subAdminCreate, subadminData);
      if (response?.data?.results) {
        SuccessToastMessage({ message: response?.data?.message });
        if (navigate) navigate('/subadmins');
        return
      }

    } catch (error: any) {
      console.error('Error creating subadmin:', error);
      ErrorToastMessage({ message: error?.response?.data?.message });
    }
  },




  updateSubadmin: async (id: string, payload, navigate?: (path: string) => void): Promise<User | undefined> => {
    try {
      const response = await apiPut(apiPath.subadminChangeStatus + '/update/' + id, payload);
      if (response?.data?.results) {
        SuccessToastMessage({ message: response?.data?.message });
        if (navigate) navigate('/subadmins');
        return
      }

    } catch (error: any) {
      console.error('Error creating subadmin:', error);
      ErrorToastMessage({ message: error?.response?.data?.message });
    }
  },

  deleteSubadmin: async (id: string): Promise<void> => {
    try {
      const response = await apiDelete(apiPath.getSubadmin + `/delete/${id}`);
      if (response?.data?.results) {
        SuccessToastMessage({ message: response?.data?.message });
        return response
      }

      return response
    } catch (error: any) {
      console.error('Error delete subadmin:', error);
      ErrorToastMessage({ message: error?.response?.data?.message });
    }
  },

  getSubadmin: async (id: string): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    const user = Object.values(MOCK_USERS).find(u => u.id === id);
    if (!user) throw new Error('User not found');

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
};