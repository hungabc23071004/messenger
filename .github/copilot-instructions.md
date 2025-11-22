# Copilot Instructions for Messenger Demo

## Project Overview

This is a Spring Boot-based Messenger application. The codebase is organized by feature and responsibility, following standard Java backend conventions with some project-specific patterns.

## Architecture & Major Components

- **Entry Point:** `DemoApplication.java` in `src/main/java/Messenger/demo/`.
- **Config:** Security and JWT configuration in `config/` (e.g., `SecurityConfig.java`, `CustomJwtDecoder.java`).
- **Controllers:** API endpoints are defined in `controller/` (not shown, but expected by convention).
- **DTOs:** Request/response objects in `dto/request/` and `dto/response/`.
- **Enums:** Domain-specific enums in `Enum/` (e.g., `Role`, `MessageType`).
- **Exceptions:** Centralized error handling in `exception/` (e.g., `GlobalExceptionHandler.java`).
- **Models:** Core entities in `model/` (e.g., `User`, `Message`, `Conversation`).
- **Repositories:** Data access interfaces (e.g., `UserRepository.java`).
- **Services:** Business logic in `service/` (e.g., `AuthenticationService.java`).

## Developer Workflows

- **Build:** Use Maven wrapper scripts (`mvnw`, `mvnw.cmd`). Example: `./mvnw clean install` (Linux/macOS) or `mvnw.cmd clean install` (Windows).
- **Run:** Start the app with `./mvnw spring-boot:run` or `mvnw.cmd spring-boot:run`.
- **Test:** Run tests with `./mvnw test` or `mvnw.cmd test`. Main test class: `DemoApplicationTests.java`.
- **Config:** App configuration is in `src/main/resources/application.properties`.

## Patterns & Conventions

- **Feature-based Package Structure:** Each domain concept (e.g., model, service, dto) has its own package.
- **DTO Usage:** All controller endpoints should use DTOs for input/output, not entities directly.
- **Exception Handling:** Use `AppException` and `GlobalExceptionHandler` for error management.
- **Security:** JWT-based authentication is configured in `SecurityConfig.java` and related files.
- **Enums:** Use enums for roles, message types, and other domain constants.

## Integration Points

- **Spring Security:** Custom JWT decoder and authentication entry point.
- **Persistence:** Likely uses Spring Data JPA (see `UserRepository.java`).
- **Static/Template Resources:** Place frontend assets in `src/main/resources/static/` and templates in `templates/`.

## Examples

- To add a new API endpoint, create a controller in `controller/`, define DTOs in `dto/request` and `dto/response`, and update the service layer.
- To add a new entity, create a model in `model/`, a repository in `repository/`, and update related services.

## Key Files

- `DemoApplication.java`: Main entry point
- `SecurityConfig.java`: Security setup
- `application.properties`: Configuration
- `GlobalExceptionHandler.java`: Error handling
- `UserRepository.java`: Example repository

---

**For questions or unclear patterns, ask for clarification or examples from maintainers.**
