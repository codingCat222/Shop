import { api } from './api';
import { UserProfile } from '../types';

interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  user: Record<string, unknown>;
  token: string;
}

const mapToUserProfile = (raw: Record<string, unknown>): UserProfile => ({
  id: raw.id as string,
  tempId: raw.tempId as string,
  name: raw.name as string,
  username: raw.username as string,
  email: raw.email as string,
  role: raw.role as UserProfile['role'],
  verificationStatus: raw.verificationStatus as UserProfile['verificationStatus'],
  walletBalance: Number(raw.walletBalance ?? 0),
  isPro: Boolean(raw.isPro),
  avatarColor: raw.avatarColor as string,
  bankName: raw.bankName as string | undefined,
  accountNumber: raw.accountNumber as string | undefined,
  phoneNumber: raw.phoneNumber as string | undefined
});

export const registerUser = async (payload: RegisterPayload): Promise<UserProfile> => {
  const { data } = await api.post<AuthResponse>('/auth/register', payload);
  localStorage.setItem('shopfair_token', data.token);
  return mapToUserProfile(data.user);
};

export const loginUser = async (payload: LoginPayload): Promise<UserProfile> => {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  localStorage.setItem('shopfair_token', data.token);
  return mapToUserProfile(data.user);
};

export const getCurrentUser = async (): Promise<UserProfile | null> => {
  const token = localStorage.getItem('shopfair_token');
  if (!token) return null;

  try {
    const { data } = await api.get<{ user: Record<string, unknown> }>('/auth/me');
    return mapToUserProfile(data.user);
  } catch {
    localStorage.removeItem('shopfair_token');
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('shopfair_token');
};

export const getApiErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return 'Something went wrong. Please try again.';
};