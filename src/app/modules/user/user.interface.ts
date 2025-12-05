export interface CreateUserInput {
  name: string;
  email?: string;
  phone?: string;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  phone?: string;
}
