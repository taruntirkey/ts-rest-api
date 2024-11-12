interface ICustomError {
  errorMessage: string;
  errorCode: number;
}

class UserError extends Error {
  cause: { errorCode: number };
  constructor({ errorMessage, errorCode }: ICustomError) {
    super();
    this.message = errorMessage ?? "Unknown user error.";
    this.cause = { errorCode: errorCode ?? 500 };
  }
}

class UsernameNotAvailableError extends UserError {
  constructor(message?: string) {
    super({
      errorMessage: message ?? "Username is already taken.",
      errorCode: 404,
    });
    this.name = "UsernameNotAvailableError";
  }
}

class UserNotFoundError extends UserError {
  constructor(message?: string) {
    super({
      errorMessage: message ?? "Couldn't find your account.",
      errorCode: 429,
    });
    this.name = "UserNotFoundError";
  }
}

class InvalidCredentialsError extends UserError {
  constructor(message?: string) {
    super({ errorMessage: message ?? "Invalid credentials.", errorCode: 401 });
    this.name = "InvalidCredentialsError";
  }
}

export {
  UserError,
  UsernameNotAvailableError,
  UserNotFoundError,
  InvalidCredentialsError,
};
