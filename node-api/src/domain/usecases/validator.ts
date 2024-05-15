import { Validated } from "../models";

export interface Validator {
  handle(data: any): Promise<Validated>;
}
