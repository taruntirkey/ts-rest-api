# Setup Development Environment

1. Install **Node.js** and **npm**.
2. Install **Visual Studio Code**.

# Project Setup

1. Initialize **npm** in project.
2. Install and configure **TypeScript**.

# Install Dependencies

## Project Dependencies

- express - Web framework for Node.js
- dotenv - Loads environment variables from a .env file
- bcryptjs - Library for hashing and salting user passwords
- jsonwebtoken - Library for generating JWTs
- cookie-parser - Middleware for parsing cookies

## Dev Dependencies

- typescript
- tsx : TS file execution in Node.js
- @types/node
- @types/express
- prisma : ORM

# Project Structure

```
-.env
-.gitignore
-package.json
-package-lock.json
-tsconfig.json
-README.md
-src
    -index.ts   // Application startup or bootstrap file.
    -routes.ts  // Combine all the routes here.
    -config     // Project configurations.
        -env.ts   // Typing environment variables.
    -modules
        -users    // Each feature should be segregated by folder.
        -dto      // Data Transfer Object.
            -users-create.dto.ts
            -users-update.dto.ts
        -users.schema.ts    // route parameter validation schema.
        -users.route.ts
        -users.controller.ts
        -users.service.ts
        -users.repository.ts
```

# Dev Tasks

1. [Create basic server bootstrap.](#create-basic-server-bootstrap)
2. [Create "User Registration" route Skeleton.](#create-user-registration-route-skeleton)
3. [Add custom error handler.](#add-custom-error-handler)
4. Connect database and create **User** schema.
5. Implement the "User Registration" route.
6. Exclude **_password_** field in database result.
7. Handle "Username already taken" error.
8. Hash password before saving to database.
9. Generate JSON Web Token and set as HTTP-only cookie.
10. Implement authenticate user.
11. Create middleware to protect routes and use in fetch and update routes.
12. Implement fetch and update routes.
13. Add parameter validation for routes.
14. API documentation.
15. Logging request.
16. Set HTTP response headers for security.
17. Rate limiting.

## Create basic server bootstrap

- Create express server with minimum required code.
- Verify that server is running.
- Read NODE_ENV and PORT from environment variables instead of hardcoding.

## Create "User Registration" route Skeleton

- Create a router for user route.
- Create a controller and return a simple message.
- Create a common _routes.ts_ file to combine routes from all modules.
- Use the combined router from _routes.ts_ to register routes.
- Verify to check if message is returned successfully.

## Add custom error handler

- Create a middleware to handle errors.
- Refer [Exress doc](https://expressjs.com/en/starter/faq.html#how-do-i-handle-404-responses)
