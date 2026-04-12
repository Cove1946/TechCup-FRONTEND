export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'player' | 'admin' | 'referee';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  totalPages?: number;
  totalItems?: number;
}