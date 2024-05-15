import { CreateUserPayload } from "../models";

export interface CreateUser {
  handle(data: CreateUserPayload): Promise<string>;
}
