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
3. Add custom error handler.
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

## Create Basic Server Bootstrap

1. Create _server.ts_ file in **_src_** directory.
2. Use _express_ to create a server.
3. Read port from _environment variable_.

## Create "User Registration" route Skeleton

1. Create 4 files _users.route.ts, users.controller.ts, users.service.ts, users.repository.ts_ in **_modules/users_** directory. Each feature will have it's own folder.
2. Add _create_ in repository and return a message "User created".
3. Add _createUserAccount_ in service and call _create_ here and return it's result to controller.
4. Add _registerUserHandler_ in controller and return a message "User registration successful" with 201 status code.
5. Create _userRouter_ and register the controller in route file.
6. Create _apiRouter_ in **_routes.js_** and add _userRouter_ to it. All the routers from different modules should be added here.
7. Use _apiRouter_ in server.
8. Run the app and test using any REST API client. REST Client VS Code extension and Postman are popular options.
