import { CreateUserAdapter } from "@/data/useCases/user/create-user/create-user";
import { CreateUserPayload, CreateUserRepository, Encrypter, TokenPayload } from "@/data/useCases/user/create-user/create-user-protocols";

const USER: CreateUserPayload = {
  email: "any@mail.com",
  password: "any_password"
}

const TOKEN = "any_token";

const makeCreateUserRepository = (): CreateUserRepository => {
  class CreateUserRepositoryStub implements CreateUserRepository {
    handle(user: CreateUserPayload): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }

  return new CreateUserRepositoryStub();
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    handle(payload: TokenPayload): Promise<string> {
      return new Promise(resolve => resolve(TOKEN));
    }
  }

  return new EncrypterStub();
}

interface SutTypes {
  sut: CreateUserAdapter
  createUserRepositoryStub: CreateUserRepository
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const createUserRepositoryStub = makeCreateUserRepository();
  const encrypterStub = makeEncrypterStub();
  const sut = new CreateUserAdapter(createUserRepositoryStub, encrypterStub);

  return {
    sut,
    createUserRepositoryStub,
    encrypterStub
  }
}

describe("CreateUserAdapter", () => {
  it("Should call CreateUserRepository with correct values", async () => {
    const { sut, createUserRepositoryStub } = makeSut();

    const repositorySpy = jest.spyOn(createUserRepositoryStub, "handle");
    await sut.handle(USER);

    expect(repositorySpy).toHaveBeenCalledWith(USER);
  })

  it("Should throw if CreateUserRepository throws", async () => {
    const { sut, createUserRepositoryStub } = makeSut();

    jest.spyOn(createUserRepositoryStub, "handle").mockImplementationOnce(() => {
      throw new Error();
    })
    const promise = sut.handle(USER);

    expect(promise).rejects.toThrow();
  })

  it("Should call Encrypter with correct values", async () => {
    const { sut, encrypterStub } = makeSut();

    const repositorySpy = jest.spyOn(encrypterStub, "handle");
    await sut.handle(USER);

    expect(repositorySpy).toHaveBeenCalledWith({
      email: USER.email,
      password: USER.password
    });
  })

  it("Should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();

    jest.spyOn(encrypterStub, "handle").mockImplementationOnce(() => {
      throw new Error();
    })
    const promise = sut.handle(USER);

    expect(promise).rejects.toThrow();
  })

  it("Should return the correct values on success", async () => {
    const { sut } = makeSut();

    const response = await sut.handle(USER);

    expect(response).toEqual(TOKEN);
  })
});