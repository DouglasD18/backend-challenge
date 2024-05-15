export interface User {
  id: number;
  email: string;
  password: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  token: string;
}
