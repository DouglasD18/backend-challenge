import { CreateUserController } from "@/src/presentation/controllers/user/create-user/create-user";
import { Validated, Validator, CreateUser, CreateUserPayload, MissingParamError, InvalidParamError, serverError } from "@/src/presentation/controllers/user/create-user/create-user-protocols";

const VALIDATED: Validated = {
  isValid: true
}

const PAYLOAD: CreateUserPayload = {
  email: "any@mail.com",
  password: "any_password"
}

const TOKEN = "any_token";

interface SutTypes {
  sut: CreateUserController
  createUserStub: CreateUser
  validatorStub: Validator
}

const makeCreateUserStub = (): CreateUser => {
  class CreateUserStub implements CreateUser {
    handle(user: CreateUserPayload): Promise<string> {
      return new Promise(resolve => resolve(TOKEN));
    }
  }

  return new CreateUserStub();
}

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    handle(body: any): Promise<Validated> {
      return new Promise(resolve => resolve(VALIDATED));
    }
  }

  return new ValidatorStub();
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub();
  const createUserStub = makeCreateUserStub();
  const sut = new CreateUserController(createUserStub, validatorStub);

  return {
    sut,
    createUserStub,
    validatorStub
  }
}

describe('CreateUserController', () => {
  it("Should call Validator with correct values", async () => {
    const { sut, validatorStub } = makeSut();
    const httpRequest = {
      body: PAYLOAD
    }

    const ValidateSpy = jest.spyOn(validatorStub, "handle");
    await sut.handle(httpRequest);

    expect(ValidateSpy).toHaveBeenCalledWith(PAYLOAD);
  });

  it('Should return 400 if any param is no provided', async () => {
    const { sut, validatorStub } = makeSut();
    const httpRequest = {
      body: PAYLOAD
    }

    const validated: Validated = {
      isValid: false,
      error: new MissingParamError("email")
    }

    jest.spyOn(validatorStub, "handle").mockReturnValue(new Promise(resolve => resolve(validated)));
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('Should return 400 if any param is invalid', async () => {
    const { sut, validatorStub } = makeSut();
    const httpRequest = {
      body: PAYLOAD
    }

    const validated: Validated = {
      isValid: false,
      error: new InvalidParamError("email", "'email' must be a valid email")
    }

    jest.spyOn(validatorStub, "handle").mockReturnValue(new Promise(resolve => resolve(validated)));
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email", "'email' must be a valid email"));
  });

  it("Should call CreateUser with correct values", async () => {
    const { sut, createUserStub } = makeSut();
    const httpRequest = {
      body: PAYLOAD
    }

    const createUserSpy = jest.spyOn(createUserStub, "handle");
    await sut.handle(httpRequest);

    expect(createUserSpy).toHaveBeenCalledWith(PAYLOAD);
  });

  it('Should return 500 if CreateUser throws', async () => {
    const { sut, createUserStub } = makeSut();
    const httpRequest = {
      body: PAYLOAD
    }

    jest.spyOn(createUserStub, "handle").mockImplementation(() => {
      throw new Error();
    })
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError());
  });

  it('Should return 201 if valid values is provided.', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: PAYLOAD
    }

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(201);
    expect(httpResponse.body).toEqual(TOKEN);
  });
});
