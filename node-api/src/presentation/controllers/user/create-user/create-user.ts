import { Controller, CreateUser, Validator, HttpRequest, HttpResponse, badRequest, created, serverError } from "./create-user-protocols";

export class CreateUserController implements Controller {

  constructor(
    private readonly createUser: CreateUser,
    private readonly validator: Validator
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest;

    try {
      const validated = await this.validator.handle(body);

      if (!validated.isValid) {
        return badRequest(validated.error!);
      }

      const token = await this.createUser.handle(body);

      return created(token);
    } catch (error) {
      return serverError();
    }
  }

}
