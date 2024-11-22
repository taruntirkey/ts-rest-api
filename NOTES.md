# Index

1. Feature based project structure.
2. Controller-Service-Repository pattern.
3. Middleware.
4. Exception Handling.
5. Password authentication.
6. Password hashing with salt.
7. Token based authentication.
8. JSON Web Token.
9. HTTP Cookie.
10. Secure cookie to prevent CSRF attack.
11. Authorization using a middleware.
12. CRUD Operations.
13. Endpoint testing using Postman.
14. Useful VS Code shortcuts.
15. Schema validation.
16. API Documentaion.
17. Request logger.
18. Git source control.
19. Rate Limiting

# TODO

1. Securing express server.
2. Access token and Refresh token.
3. Refresh token rotation.
4. Refresh token reuse detection.
5. Dockerize app.

# Feature based project structure

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
  -middleware   // Middlewares folder.
    -authMiddleware.ts
  -utils      // Utility methods common throughout the app.
  -config     // Project configurations.
    -env.ts   // Typing environment variables.
  -lib        // Custom methods for installed packages to minimize breaking changes in future.
  -modules
    -users    // Each feature should be segregated by folder.
      -utils  // Utility methods specific to users.
      -dto    // Data Transfer Object.
        -users.create.dto.ts // Create dtos only if required.
      -users.schema.ts    // User schemas. Validation schemas.
      -users.route.ts     // User route definitions.
      -users.controller.ts  // Presentation layer. Route handler.
      -users.service.ts   // Service layer. Business logic.
      -users.repository.ts  // Data access layer. CRUD operations.
      -users.error.ts     // Custom errors for users route.
```

# Controller-Service-Repository Pattern

- Controller: Router handler. Management of the REST interface to the business logic.
- Service: Business logic implementations.
- Repository: Storage of entity. Data access layer.

Role of a route handler:

1. Receive input.
2. Optionally validates it.
3. Pass them to business logic layer.
4. Execute appropriate application logic.
5. Handle exceptions.
