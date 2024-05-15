import { TokenPayload } from "../../domain/models";

export interface Encrypter {
  handle(payload: TokenPayload): Promise<string>;
}
