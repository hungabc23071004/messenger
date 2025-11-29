# Copilot Instructions for Messenger Codebase

## Overview

This repository is a full-stack messaging application with a Java Spring Boot backend and a React + Vite frontend. The backend uses MongoDB for data storage, Redis for caching and presence, and MinIO for file storage. Real-time features are implemented using WebSockets (STOMP over SockJS). The frontend is a modern React SPA styled with Tailwind CSS.

## Architecture

- **Backend (Spring Boot, `demo/`)**
  - REST APIs for authentication, user, friendship, and chat management (`controller/`)
  - WebSocket endpoints for real-time chat and presence (`controller/ChatWebSocketController.java`, `config/websocket/`)
  - MongoDB models for users, friendships, conversations, and messages (`model/`)
  - Redis is used for caching, presence, OTP, and token/session management (`constant/RedisPrefixKeyConstant.java`)
  - MinIO integration for file/media storage (`config/MinIOConfig.java`)
  - Security via JWT and OAuth2 (`config/SecurityConfig.java`, `config/CustomJwtDecoder.java`)
  - DTOs and mappers for request/response transformation (`dto/`, `mapper/`)
- **Frontend (React + Vite, `FE/`)**
  - SPA with routing (`src/page/`), API calls (`src/api/`), and reusable components (`src/components/`)
  - Uses STOMP over WebSocket for real-time features
  - Tailwind CSS for styling

## Developer Workflows

- **Backend**
  - Build: `cd demo && ./mvnw clean install` (or `mvnw.cmd` on Windows)
  - Run: `./mvnw spring-boot:run` (or `mvnw.cmd spring-boot:run`)
  - Test: `./mvnw test` (unit tests in `src/test/java/`)
  - Format: `./mvnw spotless:apply` (uses Spotless plugin)
  - Environment: Configure in `src/main/resources/application.properties`
  - MongoDB, Redis, and MinIO must be running (see `src/Docker/MinIO/docker-compose.yml` for MinIO setup)
- **Frontend**
  - Install: `cd FE && npm install`
  - Dev server: `npm run dev` (default: http://localhost:5173)
  - Build: `npm run build`
  - Lint: `npm run lint`

## Project-Specific Patterns & Conventions

- **WebSocket Topics:**
  - Presence: `/topic/presence.{userId}`
  - Chat messages: `/topic/conversation.{conversationId}/message`
  - Seen/typing: `/topic/conversation.{conversationId}/seen`, `/topic/conversation.{conversationId}/typing`
- **Redis Keys:**
  - See `RedisPrefixKeyConstant.java` for all key prefixes (e.g., `TOKEN_`, `ONLINE_`, `UNREAD_`)
- **DTO/Entity Mapping:**
  - Uses MapStruct (`mapper/`) for mapping between entities and DTOs
- **Security:**
  - JWT tokens are required for `/api/**` endpoints; `/messenger/**` is public
  - Custom JWT decoder and authentication entry point are implemented
- **Testing:**
  - Unit tests are in `src/test/java/`
  - JaCoCo is configured for coverage (see `pom.xml`)
- **File Uploads:**
  - Handled via MinIO; see `MinIOConfig.java` and related services

## Integration Points

- **MongoDB:** Data storage for all main entities
- **Redis:** Caching, session, presence, OTP, and token management
- **MinIO:** File/media storage (see Docker Compose for local setup)
- **WebSocket:** Real-time chat and presence updates

## Examples

- To send a chat message: use `@MessageMapping("/conversation/{conversationId}/send")` in `ChatWebSocketController.java`
- To update presence: handled in `WebSocketPresenceListener.java` and broadcast to `/topic/presence.{peerId}`
- To add a new Redis key: update `RedisPrefixKeyConstant.java` and use `redisTemplate` in services

## References

- Backend entry: `demo/src/main/java/Messenger/demo/DemoApplication.java`
- Frontend entry: `FE/src/main.jsx`
- Main configuration: `application.properties`, `pom.xml`, `vite.config.js`

---

If any section is unclear or missing, please provide feedback for further refinement.
