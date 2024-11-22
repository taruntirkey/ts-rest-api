# Quickstart Index

1. [Setting Up Dev Environment](#setting-up-dev-environment)

   - [Install Node.js and Npm](#install-nodejs-and-npm)
   - [Visual Studio Code](#visual-studio-code)
     - [Keyboad Shortcuts](#useful-vs-code-keyboard-shortcuts)
   - [Postman](#postman)

2. [Project Setup](#project-setup)
   - [Project Dependencies](#project-dependencies)
   - [Dev Dependencies](#dev-dependencies)
   - [TypeScript Configuration](#typescript-configuration)
   - [package.json](#packagejson)
3. [Dev Tasks](#dev-tasks)
   - [Project Structure](#project-structure)
   - [Environment Variables](#environment-variables)
   - [Basic Server Bootstrap](#basic-server-bootstrap)
   - [Route Skeleton](#route-skeleton)
   - [Database Setup](#database-setup)
   - [Custom Error Handler](#custom-error-handler)
   - [JSON Web Token](#json-web-token)
   - [Authorization](#authorization)
   - [Rate Limiter](#rate-limiter)
   - [Schema Validation](#schema-validation)
4. [Git Source Control](#git-source-control)
   - [Basic Commands](#basic-commands)
   - [Git Workflow](#git-workflow)

# Setting Up Dev Environment

## Install Node.js and Npm

Run the following commands in powershell. Check official [Node.js](https://nodejs.org/en) website for latest documentation.

**verify Node.js version**

```
node -v
```

**verify npm version**

```
npm -v
```

> [Go to Index](#quickstart-index)

## Visual Studio Code

Download [VS Code](https://code.visualstudio.com/) and install extensions.

**Install Extensions**

| Extension                     | Author            |
| ----------------------------- | ----------------- |
| REST Client                   | Huachao Mao       |
| Prettier                      | Prettier          |
| vscode-icons                  | VSCode Icons Team |
| Multiple cursor case preserve | Cardinal90        |
| Prisma                        | Prisma            |

> NOTE: **REST Client** extension is optional as **Postman** will be used for API testing and documentation. But it can be useful to save little time and effort to run tests without leaving **VS Code**.

### Useful VS Code Keyboard Shortcuts

| Command                | Shortcut                            |
| ---------------------- | ----------------------------------- |
| Command Palatte        | `ctrl + shift + p`                  |
| Go to file             | `ctrl + p`                          |
| Open Terminal          | `ctrl + ~`                          |
| Expand all region      | `ctrl + k + 0`                      |
| Collapse all region    | `ctrl + k + j`                      |
| Toggle comment         | `ctrl + /`                          |
| Copy line              | `alt + shift + up/down arrow`       |
| Move line              | `alt + up/down arrow`               |
| Select the next match  | `[Selected Text] + ctrl + d`        |
| Change all occurrences | `[Selected Text] + ctrl + shift+ l` |
| New Line               | `[Anywhere in line] + ctrl + enter` |
| Expand Selection       | `alt + shift + right arrow`         |
| Shrink Selection       | `alt + shift + right arrow`         |
| Format Document        | `alt + shift + f`                   |
| search                 | `ctrl + shift + f`                  |
| Find all references    | `alt + shift + F12`                 |
| search                 | `ctrl + shift + f`                  |

> [Go to Index](#quickstart-index)

## Postman

Install [Postman](https://www.postman.com/) for testing and API documentation.

1. Create a workspace for project and switch to it.
2. Create an environment to store reuseable and sensitive values and switch to it.
3. Create a collection for each feature or module. Add module specific routes here.
4. Once API is finished and tested, export each collection and save in project for documentation.
5. Exported postman collection can be shared and opened in postman.

# Project Setup

## Project Dependencies

**Initialize npm in project.**

```
npm init -y
```

**Project Dependencies**

```
npm i express dotenv jsonwebtoken cookie-parser express-async-handler argon2 zod helmet morgan express-rate-limit
```

| package               | description                                  |
| --------------------- | -------------------------------------------- |
| express               | Web framework for Node.js                    |
| dotenv                | Loads environment variables from a .env file |
| express-async-handler | exception handler for async express routes   |
| argon2                | Library for hashing and salting passwords    |
| jsonwebtoken          | Library for generate and verify JWTs         |
| cookie-parser         | Middleware for parsing cookies               |
| zod                   | Schema declaration and validation library    |
| helmet                | Secure express app with various HTTP headers |
| morgan                | Request logger                               |
| express-rate-limit    | Request rate limiter for express             |

## Dev Dependencies

```
npm i -D typescript tsx @types/node @types/express prisma @types/jsonwebtoken @types/cookie-parser @types/morgan
```

| package              | description                            |
| -------------------- | -------------------------------------- |
| typescript           | Project level TypeScript installation  |
| tsx                  | TypeScript runtime environment in node |
| @types/node          | TS definition for node                 |
| @types/express       | TS definition for express              |
| prisma               | Prisma CLI                             |
| @types/jsonwebtoken  | TS definition for jsonwebtoken         |
| @types/cookie-parser | TS definition for cookie-parser        |
| @types/morgan        | TS definition for morgan               |

> [Go to Index](#quickstart-index)

## TypeScript Configuration

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
    "outDir": "dist",
    "paths": {
      "@/*": ["./*"],
    }
  },
  "include": ["src/**/*"]
}
```

> [Go to Index](#quickstart-index)

## package.json

**Configure Application Entry Point**

```
"main": "dist/index.js"
```

### ES Module

```
"type": "module",
```

### Scripts

```
"scripts": {
  "dev": "tsx watch src/server.ts",
  "build": "tsc"
},
```

> [Go to Index](#quickstart-index)

# Dev Tasks

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
  -routes.ts  // Combine routes from all modules here.
  -config     // Project configurations.
    -env.ts   // Typing environment variables.
  -modules
    -users    // Each feature should be segregated by folder.
      -dtos
        -auth-user.dto.ts
      -utils
        -generate-token.ts
      -users.schema.ts
      -users.route.ts   // Module specific routes.
      -users.controller.ts
      -users.service.ts
      -users.repository.ts
      -users.error.ts
```

> [Go to Index](#quickstart-index)

## Environment Variables

```
NODE_ENV=development
PORT=5000
JWT_SECRET=random_string
```

Following methods can be used to generate **random_string**.

Using OpenSSL, run the following in shell.

```
openssl rand -base64 32
```

Using Node.js crypto module, run node in shell and execute the following.

```
require('crypto').randomBytes(32).toString('base64url')
```

> [Go to Index](#quickstart-index)

## Basic Server Bootstrap

```
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import config from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import apiRouter from "./routes.js";
import { rateLimitByIp } from "./middleware/apiRateLimitMiddleware.js";

const port = config.PORT || 3000;

const app = express();

// Rate Limiter
app.use(rateLimitByIp);

// Help secure Express apps by setting HTTP response headers.
app.use(helmet());

// Request body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Request logger
app.use(morgan("combined"));

// Register Routes
app.use("/api", apiRouter);

// Error Handlers
app.use(notFound);
app.use(errorHandler);

app
  .listen(port, () => {
    console.log(`Ready on PORT ${port}`);
  })
  .on("error", (err) => console.log(err));
```

> [Go to Index](#quickstart-index)

## Route Skeleton

_src/modules/users/users.controller.ts_

```
import { Request, Response } from "express";

//@desc     Register user
//@route    POST /api/users
//@access   Public
const registerUserHandler = (req: Request, res: Response) => {
  res.send({ message: "User registration successful." });
};

export { registerUserHandler };
```

_src/modules/users/users.route.ts_

```
import express from "express";
import { registerUserHandler } from "./users.controller.js";

const userRouter = express.Router();

userRouter.post("/", validate(createUserSchema), registerUserHandler);

export default userRouter;
```

_routes.ts_

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

> [Go to Index](#quickstart-index)

## Database Setup

Check official [Prisma](https://www.prisma.io/) website for latest documentation.

**Initialize Prisma**

For production and security use `postgresql` as provider.

```
npx prisma init --datasource-provider sqlite
```

**Add scripts in package.json**

```
"db-client": "prisma generate",
"db-studio": "prisma studio"
```

> [Go to Index](#quickstart-index)

## Custom Error Handler

**Middleware**

```
import { Request, Response, NextFunction } from "express";
import config from "../config/env.js";

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

  // Handle custom errors here.

  res.status(statusCode).json({
    message,
    stack: config.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };

```

**Usage**

Add middlewares to server.

```
import express from "express";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();
...
// After routes registration and before starting the server with app.listen
app.use(notFound);
app.use(errorHandler);
```

Wrap controller with _asyncHandler_.

```
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

const registerUser = asyncHandler(async(req: Request, res: Response) => {
  ...
});
```

> [Go to Index](#quickstart-index)

## JSON Web Token

**Middleware**

```
import { Response } from "express";
import jwt from "jsonwebtoken";
import config from "../../../config/env.js";

// TODO: Refresh Tokens

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

**Usage**

Invoke _generateToken_ in user registration and authentication routes just before sending the response.

```
const registerUser = (req, res) => {
  ...
  generateToken(res, user.id);
  res.status(201).send({message: "User authenticated."});
}

const authUser = (req, res) => {
  ...
  generateToken(res, user.id);
  res.send({message: "User authenticated."});
}
```

> [Go to Index](#quickstart-index)

## Authorization

**Middleware**

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

> [Go to Index](#quickstart-index)

## Rate Limiter

**Middleware**

```
import { rateLimit } from "express-rate-limit";

// Maximum 100 requests per 15-min from same IP.
const rateLimitByIp = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
  message: "You have exceeded the request limit.",
});

// Maximum 10 failed login requests per 3 hours by same user.
const rateLimitByUser = rateLimit({
  windowMs: 3 * 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req, res) => {
    return req.body.username;
  },
  message: "Your account is blocked for 3 hours due to suspicious activity.",
});

export { rateLimitByIp, rateLimitByUser };
```

**Usage**

_server.ts_

```
import { rateLimitByIp } from "./middleware/apiRateLimitMiddleware.js";

const app = express();

// Rate Limiter
app.use(rateLimitByIp);
...
```

_users.route.ts_

```
import { rateLimitByUser } from "../../middleware/apiRateLimitMiddleware.js";
...
userRouter.post(
  "/auth",
  rateLimitByUser,
  validate(authUserSchema),
  authUserHandler
);
```

> [Go to Index](#quickstart-index)

## Schema Validation

**Middleware**

```
import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

const validate =
  (validationObject: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      validationObject.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        res.status(400).send(err.errors);
      }
    }
  };

export default validate;
```

**Schema Design**

```
import { z } from "zod";

const createUserSchema = z.object({
  body: z.object({
    firstname: z.string(),
    lastname: z.string(),
    username: z.string(),
    password: z.string(),
  }),
});

type CreateUser = z.infer<typeof createUserSchema.shape.body>;

export { createUserSchema, CreateUser };
```

**Usage**

```
import express from "express";
import { registerUserHandler } from "./users.controller.js";

const userRouter = express.Router();

userRouter.post("/", validate(createUserSchema), registerUserHandler);
```

> [Go to Index](#quickstart-index)

# Git Source Control

## Basic Commands

### Basic Workflow:

| Command                     | Description                 |
| --------------------------- | --------------------------- |
| `git init`                  | Initialize a git repository |
| `git status`                | Repository status           |
| `git add .`                 | Stage all files             |
| `git add file.ts`           | Stage single file           |
| `git add file1.ts file2.ts` | Stage multiple file         |
| `git diff`                  | Shows unstaged changes      |
| `git diff --staged`         | Shows staged changes        |
| `git commit -m "Message"`   | Commit with a message       |
| `git commit -am "Message"`  | Commit without staging      |

### View History

| Command              | Description                |
| -------------------- | -------------------------- |
| `git log`            | Full history               |
| `git show HEAD`      | Shows last commit          |
| `git show HEAD~2`    | 2 steps before last commit |
| `git show commit-id` | Shows the given commit     |

### Branching and Merging

| Command                  | Description                        |
| ------------------------ | ---------------------------------- |
| `git branch dev-task`    | Creates a new branch "dev-task"    |
| `git checkout dev-task`  | Switch to "dev-task" branch        |
| `git branch`             | List all branches                  |
| `git merge dev-task`     | Merge "dev-task" to current branch |
| `git branch -d dev-task` | Delete "dev-task" branch           |

### Save away Work Temporarily

| Command                     | Description                         |
| --------------------------- | ----------------------------------- |
| `git stash`                 | Save uncommitted changes            |
| `git stash save "message"`  | Save with a message                 |
| `git stash -u`              | Include untracked files to stash    |
| `git stash -a`              | Include untracked and ignored files |
| `git stash apply`           | Apply previously stashed changes    |
| `git stash pop`             | Apply stashed changes and delete it |
| `git stash list`            | Stash list                          |
| `git stash pop stash@{2}`   | Apply selected stash                |
| `git stash show -p`         | Full difference of a stash          |
| `git stash branch 'bugfix'` | Create a 'bugfix' branch from stash |
| `git stash drop 'stash@{2}` | Delete selected branch              |
| `git stash clear`           | Delete all stashes                  |

### Sync with Remote

| Command         | Description                   |
| --------------- | ----------------------------- |
| `git clone url` | Clone a repository            |
| `git fetch`     | fetch all objects from origin |
| `git pull`      | fetch + Merge                 |
| `git push`      | push "master" to origin       |

> [Go to Index](#quickstart-index)

## Git Workflow

1. Initialize a local repo `git init`.
2. Write code, make changes, etc.
3. Stage changes `git add .`.
4. Commit to local repo `git commit -m 'Initail commit'`.
5. Create a repository in GitHub.
6. Follow the the instructions to add the local repo to GitHub.
7. Push to remote repo `git push`. This is not required the first time.

> NOTE: Steps 5 and 6 should be done only once per repo.
