export type User = {
  id: number;
  email: string;
  password: string;
}

export type CreateUserPayload = {
  email: string;
  password: string;
}

export type UpdateUserPayload = {
  token: string;
}
