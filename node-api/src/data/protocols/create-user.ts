import { CreateUserPayload } from "../../domain/models";

export interface CreateUserRepository {
  handle(data: CreateUserPayload): Promise<void>;
}
