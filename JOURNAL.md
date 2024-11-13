# Preface

This document contains steps taken throughout the project development.

# INDEX

- [Dev Environment](#dev-environment)
- [Project Setup](#project-setup)
- [Development Tasks](#development-tasks)
  - [Project Structure](#project-structure)
  - [Creating a Server](#creating-a-server)
  - [Environment Variables](#environment-variables)
  - [Routes Setup](#routes-setup)
  - [Custom Error Handler](#custom-error-handler)
  - [Add Rest of the Routes](#add-rest-of-the-routes)
  - [Database Setup](#database-setup)
  - [Create user](#create-user)
  - [Handle Error if user with same username already exists](#handle-error-if-user-with-same-username-already-exists)
  - [Hash Password before saving](#hash-password-before-saving)
  - [Generate Token](#generate-token)
  - [Authenticate User](#authenticate-user)
  - [Protect Routes](#protect-routes)
  - [Implement Profile Routes](#implement-profile-routes)
  - [Validate Schema](#validate-schema)
  - [Securing the App](#securing-the-app)
  - [Logging HTTP Requests](#logging-http-requests)

# README file Conventions

| Entity         | Convention           |
| -------------- | -------------------- |
| file           | _italics_            |
| directory      | **_italic bold_**    |
| inline command | `code`               |
| Code           | ```fenced code block |
| Steps          | **Bold**             |

# Dev Environment

- Node.js
- npm
- typescript
- Visual Studio Code

## Install Node.js and Npm

Run the following commands in powershell.

**installs fnm (Fast Node Manager)**

```
winget install Schniz.fnm
```

**configure fnm environment**

```
fnm env --use-on-cd | Out-String | Invoke-Expression
```

**download and install Node.js**

_Replace 22 with the latest version_

```
fnm use --install-if-missing 22
```

**verifies the right Node.js version is in the environment**

```
node -v
```

**verifies the right npm version is in the environment**

```
npm -v
```

## Visual Studio Code

Download VS Code and install extensions.

**Install Extensions**

- REST Client - API Testing
- Prettier - Code formatter
- vscode-icons
- Multiple cursor case preserve

> [Go to Index](#index)

# Project Setup

## TypeScript Setup

**Initialize npm in project.**

```
npm init -y
```

**Configure to use ESModules**

Add the following in _package.json_.

```
"type": "module"
```

**Install TypeScript locally for project as well as devDependency**

This can be helpful later for version reference and also for working in system which doesn't have TypeScript installed.

```
npm i -D typescript
```

**Initialize TypeScript in project**

```
npx -p typescript tsc --init
```

**tsconfig.json**

```
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2023",
    "sourceMap": true,
    "outDir": "dist"
  },
  "include": ["src/**/*"]
}
```

**Install types for Node**

```
npm i -D @types/node
```

**Build using local Typescript Installation**

Add the following under "scripts" in _package.json_

```
"build": "tsc"
```

**Run TS files directly**

Install tsx

```
npm i -D tsx
```

Add script in _package.json_

```
"dev": "tsx watch src/server.ts"
```

> [Go to Index](#index)

## Project Dependencies

Dependencies will be installed as needed during development.

### Dependencies

| package               | description                                  |
| --------------------- | -------------------------------------------- |
| express               | Web framework for Node.js                    |
| dotenv                | Loads environment variables from a .env file |
| express-async-handler | exception handler for async express routes   |
| argon2                | Library for hashing and salting passwords    |
| jsonwebtoken          | Library for generate and verify JWTs         |
| cookie-parser         | Middleware for parsing cookies               |
| zod                   | Schema declaration and validation library    |

### Dev Dependencies

| package              | description                            |
| -------------------- | -------------------------------------- |
| typescript           | Project level TypeScript installation  |
| tsx                  | TypeScript runtime environment in node |
| @types/node          | TS definition for node                 |
| @types/express       | TS definition for express              |
| prisma               | Prisma CLI                             |
| @types/jsonwebtoken  | TS definition for jsonwebtoken         |
| @types/cookie-parser | TS definition for cookie-parser        |

# Development Tasks

## Project Structure

```
-.env
-.gitignore
-package.json
-package-lock.json
-tsconfig.json
-README.md
-src
  -server.ts   // Application startup or bootstrap file.
  -routes.ts  // Combine all the routes here.
  -config     // Project configurations.
    -env.ts   // Typing environment variables.
  -modules
    -users    // Each feature should be segregated by folder.
      -dto    // Data Transfer Object.
        -users.create.dto.ts
      -users.schema.ts    // Not required if prisma ORM is used.
      -users.route.ts     // User route definitions.
      -users.controller.ts  // Presentation layer. Route handler.
      -users.service.ts   // Service layer. Business logic.
      -users.repository.ts  // Data access layer. CRUD operations.
      -users.error.ts     // Custom errors for users route.
```

> [Go to Index](#index)

## Creating a Server

**Install express**

```
npm i express
```

**Install types for express**

```
npm i -D @types/express
```

**Basic Server**

```
import express from "express";

const port = 3000;

const app = express();

app.get("/", (req, res) => {
  res.send("API Running");
});

app
  .listen(port, () => {
    console.log(`Ready on PORT ${port}`);
  })
  .on("error", (err) => console.log(err));
```

> [Go to Index](#index)

## Environment Variables

**Install dotenv package**

```
npm i dotnev
```

**Add Variables**

Create a _.env_ file and add the following.

```
NODE_ENV=development
PORT=5000
```

**Imort and load the environment variables**

Create a folder **_config_** file _env.ts_

```
import dotenv from "dotenv";
dotenv.config();

const config = {
  NODE_ENV: process.env.NODE_ENV!,
  PORT: process.env.PORT!,
  verify: function () {
    try {
      if (!this.NODE_ENV || typeof this.NODE_ENV !== "string") {
        throw new Error("Invalid NODE_ENV");
      }
      if (!this.PORT || isNaN(+this.PORT)) {
        throw new Error("Invalid PORT");
      }
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  },
};

config.verify();

export default config;
```

**Use PORT from Config**

```
import config from "./config/env.js";
...
const port = config.PORT || 3000;
```

> [Go to Index](#index)

## Routes Setup

**Request Body Parser Middleware**

Add the follwing in _index.ts_ or the server initializaiton file just below the app initialization.

```
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

**Controller-Service-Repository Pattern**

Route > Controller > Service > Repository > Schema

- Route - Route definition. Authorization.
- Controller/Gateway/Presenter - Route handler. Parameter validation.
- Service/Use Cases - Application and business logic.
- Repository - Data access.
- Schema (Entities) - Business logic.

**Add Route**

In _users.controller.ts_ add the following:

```
import { Request, Response } from "express";

//@desc     Auth user & get token
//@route    POST /api/users/auth
//@access   Public
const authUser = (req: Request, res: Response) => {
  res.send({ message: "Success" });
};

export { authUser };
```

Then add this route handler to _users.route.ts_.

```
import express from "express";
import { authUserHandler } from "./users.controller.js";

const userRouter = express.Router();

userRouter.post("/auth", authUserHandler);

export default userRouter;
```

Register route in _routes.ts_.

```
import express from "express";
import userRoutes from "./modules/users/users.route.js";

const apiRouter = express.Router();

apiRouter.use("/healthcheck", (req, res) => {
  res.send({ message: "OK" });
});

apiRouter.use("/users", userRoutes);

export default apiRouter;
```

Use _apiRouter_ in _index.ts_.

Add the following in just after the body parser middleware.

```
app.use("/api", apiRouter);
```

### Test Route

Test using the _REST Client_ extension.

Create a _users.route.test.http_ file in _users_ folder. And add routes for testing.

> [Go to Index](#index)

## Custom Error Handler

**Install express-async-handler**

```
npm i express-async-handler
```

**Wrap the function with this middleware**

```
import asyncHandler from "express-async-handler";

//@desc     Auth user & get token
//@route    POST /api/users/auth
//@access   Public
const authUserHandler = asyncHandler(async (req: Request, res: Response) => {
  res.send({ message: "authUser route." });
});
```

**Create error handler middleware**

Create _errorMiddleware.ts_ in **_middleware_** folder

```
import config from "../config/env.js";
import { NextFunction, Request, Response } from "express";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  res.status(statusCode).json({
    message,
    stack: config.NODE_ENV === "production" ? null : err.stack,
  });
};

export { errorHandler, notFound };

```

Now add the following to _index.ts_ after routes registration.

```
app.use(notFound);
app.use(errorHandler);
```

> [Go to Index](#index)

## Add Rest of the Routes

**Create Route Handlers**

```
//@desc     Register User
//@route    POST /api/users
//@access   Public
const registerUserHandler = asyncHandler(async (req: Request, res: Response) => {
  res.send({ message: "registerUser route." });
});

//@desc     Logout User
//@route    POST /api/users/logout
//@access   Public
const logoutUserHandler = asyncHandler(async (req: Request, res: Response) => {
  res.send({ message: "logoutUser route." });
});

//@desc     Get User Profile
//@route    POST /api/users/profile
//@access   Private
const getUserProfileHandler = asyncHandler(async (req: Request, res: Response) => {
  res.send({ message: "getUserProfile route." });
});

//@desc     Update User Profile
//@route    PUT /api/users/profile
//@access   Private
const updateUserProfileHandler = asyncHandler(async (req: Request, res: Response) => {
  res.send({ message: "updateUserProfile route." });
});

export {
  ...
  registerUserHandler,
  logoutUserHandler,
  getUserProfileHandler,
  updateUserProfileHandler,
};
```

**Register Routes**

```
import express from "express";
import {
  authUserHandler,
  getUserProfileHandler,
  logoutUserHandler,
  registerUserHandler,
  updateUserProfileHandler,
} from "./users.controller.js";

const userRouter = express.Router();

userRouter.post("/", registerUserHandler);
userRouter.post("/auth", authUserHandler);
userRouter.post("/logout", logoutUserHandler);
userRouter.route("/profile")
    .get(getUserProfileHandler)
    .put(updateUserProfileHandler);

export default userRouter;
```

> [Go to Index](#index)

## Database Setup

**Install Prisma**

```
npm i -D prisma
```

**Initialize Prisma**
_sqlite_ should be replaced with relevant database provider.

```
npx prisma init --datasource-provider sqlite
```

This will create a folder **_prisma_** and a file _schema.prisma_ in it. It will also add `DATABASE_URL` in the _.env_.

**Connecting to DB**

Update `DATABASE_URL` if required. Rest is handled by prisma ORM.

**Add VS Code Extension**

_Prisma_ from **_Prisma_**.

This helps with _primsa.schema_ syntax.

**Run Migration**

```
npx prisma migrate dev --name init
```

1. This step creates a new SQL migration file in **_prisma/migrations_** folder.
2. Migration file is executed against the database.
3. It ran `prisma generate` under the hood which installed _@prisma/client_ package and generated a tailored Prisma Client API based on your models.

**Add the Prisma Client**

Search for _"prisma client best practices"_ and check the prisma docs for prisma client best practice. Copy and use the code.

> [Go to Index](#index)

## Create user

**Create Data Access for User Registration**

_users.repository.ts_

```
import prisma from "../../../prisma/client.js";
import { Prisma } from "@prisma/client";

const create = async (user: Prisma.UserCreateInput) => {
  const { firstname, lastname, username, password } = user;

  return await prisma.user.create({
    data: { firstname, lastname, username, password },
    omit: {
      password: true,
    },
  });
};

export { create };
```

**Service Layer**

_users.service.ts_

```
import { Prisma } from "@prisma/client";
import { create } from "./users.repository.js";

const registerUser = async (newUser: Prisma.UserCreateInput) => {
  const user = await create(newUser);
  return user;
};

export { registerUser };
```

**Route Handler**

_users.controller.ts_

```
import { Prisma } from "@prisma/client";  //New import.

const registerUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const newUser: Prisma.UserCreateInput = req.body;
    const user = await registerUser(newUser);
    res.send(user);
  }
);
```

**Test Route**

This should insert a new user in database.

**Prisma Studio**

Add a script in _package.json_.

```
"studio": "prisma studio"
```

Run the script to open **_Prisma Studio_** and verify the entry.

> [Go to Index](#index)

## Handle Error if user with same username already exists

**Create custom error in _users.error.ts_.**

```
interface ICustomError {
  errorMessage: string;
  errorCode: number;
}

class UserError extends Error {
  cause: { errorCode: number };
  constructor({ errorMessage, errorCode }: ICustomError) {
    super();
    this.message = errorMessage ?? "Unknown user error";
    this.cause = { errorCode: errorCode ?? 500 };
  }
}

class UsernameNotAvailableError extends UserError {
  constructor(message?: string) {
    super({
      errorMessage: message ?? "Username is already taken",
      errorCode: 429,
    });
    this.name = "UsernameNotAvailableError";
  }
}

export { UsernameNotAvailableError };
```

**Use this custom error**

```
  const user = await getByUsername(newUser.username);
  if (user) {
    throw new UsernameNotAvailableError();
  }
```

**Handle UsernameNotAvailableError**

**_errorMiddleware.ts_**

```
  if (err instanceof UserError) {
    statusCode = err.cause.errorCode;
  }
```

> [Go to Index](#index)

## Hash Password before saving

**Install argon2**

```
npm i argon2
```

**Encrypt password using bcrypt**

```
import argon2 from "argon2";

  const hashedPassword = await argon2.hash(newUser.password);
  newUser.password = hashedPassword;
```

> [Go to Index](#index)

## Generate Token

**Install jsonwebtoken**

```
npm i jsonwebtoken
```

**Install types for jsonwebtoken**

```
npm i -D @type/jsonwebtoken
```

**Generate random string**
Any of the following methods can be used to generate random strings.

Using _crypto_ Nodejs module. Run node in powershell, then execute the following:

```
require('crypto').randomBytes(32).toString('hex')
OR
require('crypto').randomBytes(32).toString('base64url')
```

Using OperSSL. Run in poweshell.

```
openssl rand -base64 32
```

**Create Token and Use HTTP-Only Cookie**

```
import { Response } from "express";
import jwt from "jsonwebtoken";
import config from "../../../config/env.js";

const generateToken = (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: "30d" });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: config.NODE_ENV !== "development", // Use secure in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default generateToken;
```

**Import and invoke this just before response is sent**

```
import generateToken from "./utils/generate-token.js";
...
await generateToken(res, createdUser.id);
```

> [Go to Index](#index)

## Authenticate User

**_users.repository.ts_**

```
const getByUsername = async (username: string) => {
  return await prisma.user.findUnique({ where: { username } });
};
```

**_users.service.ts_**

Add, export and use the below method in _authUserHandler_.

```
const authUser = async (auth: IAuthenticateUser) => {
  const user = await getByUsername(auth.username);
  if (!user) {
    throw new UserNotFoundError();
  }

  if (!(await argon2.verify(user.password, auth.password))) {
    throw new InvalidCredentialsError();
  }

  return {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
  };
};
```

**_users.error.ts_**

Add and export the below custom user errors.

```
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
    super({ errorMessage: message ?? "Invalid credentials", errorCode: 401 });
    this.name = "InvalidCredentialsError";
  }
}
```

**_users.controller.ts_**

```
const authUserHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = await authUser(req.body);
  generateToken(res, user.id);
  res.send(user);
});
```

> [Go to Index](#index)

## Protect Routes

**Install cookie-parser**

```
npm i cookie-parser
```

**Install types for cookie-parser**

```
npm i -D @types/cookie-parser
```

**Add cookie-parser middleware to server _index.ts_**

```
import cookieParser from "cookie-parser";
...
app.use(cookieParser());
```

**Create middleware to protect routes**

_authMiddleware.ts_

```
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import config from "../config/env.js";

const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.cookies.jwt;

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    try {
      jwt.verify(token, config.JWT_SECRET);
      next();
    } catch (err) {
      console.log(err);
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  }
);

export { protect };
```

> [Go to Index](#index) > **Use this middlware**

_users.route.ts_

```
userRouter
  .route("/profile")
  .get(protect, getUserProfileHandler)
  .patch(protect, updateUserProfileHandler);
```

> [Go to Index](#index)

## Implement Profile Routes

**Get Profile**

_users.repository.ts_

```
const getById = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true },
  });
};
```

_users.service.ts_

```
const getUserProfile = async (userId: string) => {
  return await getById(userId);
};
```

**Update Profile**

_users.repository.ts_

```
const update = async (userId: string, updateParams: Prisma.UserUpdateInput) => {
  const { firstname, lastname } = updateParams;
  return await prisma.user.update({
    where: { id: userId },
    data: {
      firstname,
      lastname,
    },
    omit: {
      password: true,
    },
  });
};
```

_users.service.ts_

```
const updateUserProfile = async (userId: string, updateParams: UpdateUser) => {
  const { firstname, lastname } = updateParams;
  return await update(userId, { firstname, lastname });
};
```

> [Go to Index](#index)

## Validate Schema

Install zod.

```
npm i zod
```

Create a middleware in **_middleware_** folder named _validateSchema.ts_.

```
import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err: any) {
      return res.status(400).send(err.errors);
    }
  };

export default validate;
```

Create validation schemas in _users.schema.ts_.

```
import { z } from "zod";

const createUserSchema = z.object({
  body: z.object({
    firstname: z.string().min(1).max(255),
    lastname: z.string().min(1).max(255),
    username: z.string().min(3).max(255),
    password: z
      .string()
      .min(12)
      .max(255)
      .refine(
        (val) =>
          /^.*(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).*$/.test(val),
        {
          message:
            "Password should contain at least one number, one uppercase letter and one special characters !@#$&*.",
        }
      ),
  }),
});

// Regex Explanation:
// /^.*(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).*$/
// ^.*                       Start.
// (?=.*[A-Z])               At least one uppercase letter.
// (?=.*[!@#$&*])            At least one special case letter.
// (?=.*[0-9].*[0-9])        At least one digit.
// (?=.*[a-z])               At least one lowercase letter.
// .*$                       End.

const authUserSchema = z.object({
  body: z.object({
    username: z.string().min(3),
    password: z.string(),
  }),
});

const updateUserSchema = z.object({
  body: z
    .object({
      firstname: z.string().min(1),
      lastname: z.string().min(1),
    })
    .partial()
    .refine(
      ({ firstname, lastname }) =>
        firstname !== undefined || lastname !== undefined,
      {
        message: "One of the fields must be defined",
      }
    ),
});

type CreateUser = z.infer<typeof createUserSchema.shape.body>;
type AuthUser = z.infer<typeof authUserSchema.shape.body>;
type UpdateUser = z.infer<typeof updateUserSchema.shape.body>;

export {
  createUserSchema,
  CreateUser,
  authUserSchema,
  AuthUser,
  updateUserSchema,
  UpdateUser,
};
```

> [Go to Index](#index)

## Securing the App

Add helmet package.

```
npm i helmet
```

Use in _server.ts_.

```
import helmet from 'helmet';

...

app.use(helmet()); // Add this as first middleware.
```

> TODO: Rate limiting
> [Go to Index](#index)

## Logging HTTP Requests

**Install morgan**

```
npm i morgan
```

**Install TS definition for morgan**

```
npm i -D @types/morgan
```

**Use morgan middleware**

Add this middleware just before registering routes.

```
import morgan from "morgan";
...
app.use(morgan("Combined"));
```

> [Go to Index](#index)
