import { CreateUser, CreateUserRepository, Encrypter, CreateUserPayload, TokenPayload } from "./create-user-protocols";

export class CreateUserAdapter implements CreateUser {

  constructor(
    private readonly createUserRepository: CreateUserRepository,
    private readonly encrypter: Encrypter
  ) { }

  async handle(data: CreateUserPayload): Promise<string> {
    await this.createUserRepository.handle(data);

    const tokenPayload: TokenPayload = {
      email: data.email,
      password: data.password
    }

    const token = await this.encrypter.handle(tokenPayload);

    return token;
  }

}
