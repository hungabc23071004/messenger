# Copilot Instructions for Messenger Codebase

## Overview

Full-stack real-time messaging application: Java Spring Boot 3.3.4 (Java 21) backend + React 19 + Vite frontend. Core stack: MongoDB (data), Redis (caching/presence/sessions), MinIO (file storage), WebSocket/STOMP (real-time features).

## Architecture & Data Flow

### Backend (`demo/`)

- **Entry:** `DemoApplication.java` → context path `/messenger` (port 8080)
- **Security:** JWT-based auth via `CustomJwtDecoder.java`
  - `/messenger/**` = public endpoints
  - `/api/**` = authenticated endpoints (JWT required)
  - WebSocket auth via `JwtAuthChannelInterceptor` (intercepts CONNECT frames, validates `Authorization` header)
- **Controllers:** REST endpoints in `controller/` + WebSocket in `ChatController.java`
- **Real-time WebSocket:**
  - Endpoint: `ws://localhost:8080/messenger/ws` (configured in `WebSocketConfig.java`)
  - Client sends to: `/app/conversation/{conversationId}/send|seen|typing`
  - Server broadcasts to: `/topic/conversation.{conversationId}/message|seen|typing`, `/topic/presence.{userId}`
  - Presence auto-broadcast via `WebSocketPresenceListener` on connect/disconnect
- **DTO Mapping:** MapStruct interfaces in `mapper/` (e.g., `UserMapper`) with component model `spring` for DI
  - Generated implementations are in `target/generated-sources/annotations/`
  - Special pattern: MinIO URLs prefixed in mapper expressions (see `UserMapper.toUserResponse`)

### Frontend (`FE/src/`)

- **Entry:** `main.jsx` → routing in `page/` (Login, Home, ChatPage, Profile, FriendsPage)
- **API Layer:** `api/` modules (auth, conversation, file, User, post, WebsocketService)
- **WebSocket:** `WebsocketService.js` handles STOMP client setup, auto-reconnect, and token injection
  - Stores callbacks until connected, then flushes (`onConnectedCallbacks`)
- **Components:** Reusable UI in `components/` (ChatBox, ConversationList, Feed, Header, Sidebar, etc.)

### Data Stores

- **MongoDB:** Primary persistence (users, conversations, messages, friendships, posts)
- **Redis:** Key patterns in `RedisPrefixKeyConstant.java`:
  - `TOKEN_`, `REFRESH_TOKEN_` → JWT session management
  - `ONLINE_`, `LAST_SEEN_` → user presence
  - `UNREAD_` → unread message counts per conversation
  - `OTP_CHANGE_PASSWORD_`, `ACTIVE_ACCOUNT_` → temporary auth tokens
- **MinIO:** Object storage for avatars, banners, media uploads
  - Public bucket: `messenger-public` (see `application.properties`)
  - URLs constructed via `MinIOPrefixUrl.MINIO_URL` constant

## Developer Workflows

### Backend Commands (from `demo/`)

```bash
# Windows
mvnw.cmd clean install          # Build + run tests
mvnw.cmd spring-boot:run        # Start server (http://localhost:8080/messenger)
mvnw.cmd test                   # Run unit tests
mvnw.cmd spotless:apply         # Auto-format code (Spotless plugin with Palantir Java Format)

# Linux/Mac
./mvnw clean install
./mvnw spring-boot:run
./mvnw test
./mvnw spotless:apply
```

**Prerequisites:** MongoDB (27017), Redis (6379), MinIO (9000) running locally. For MinIO Docker setup: `src/Docker/MinIO/docker-compose.yml`

### Frontend Commands (from `FE/`)

```bash
npm install                     # Install dependencies
npm run dev                     # Dev server → http://localhost:5173
npm run build                   # Production build
npm run lint                    # ESLint
```

### Environment Configuration

- Backend: `demo/src/main/resources/application.properties`
  - JWT signer key, MongoDB URI, Redis host/port, MinIO credentials, email SMTP settings
- Frontend: Hardcoded endpoints in API modules (e.g., `http://localhost:8080/messenger` in axios calls)

## Critical Patterns & Conventions

### WebSocket Message Flow

**Client → Server (via STOMP):**

```javascript
// In WebsocketService.js
stompClient.publish({
  destination: "/app/conversation/123/send",
  headers: { Authorization: "Bearer <token>" },
  body: JSON.stringify({ content: "Hello", ... })
});
```

**Server → Client (broadcast):**

```java
// In MessageService or ChatController
simpMessagingTemplate.convertAndSend(
  "/topic/conversation.123/message",
  messageResponse
);
```

**Presence updates:** `WebSocketPresenceListener` listens to `SessionConnectedEvent`/`SessionDisconnectEvent`, updates Redis (`ONLINE_`, `LAST_SEEN_`), and broadcasts to all friends via `/topic/presence.{peerId}`.

### MapStruct DTO Mapping

- **Interface-based:** Mappers are `@Mapper(componentModel = "spring")` interfaces
- **Null safety:** Use `@BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)` for partial updates
- **Custom logic via expressions:** Example in `UserMapper`:
  ```java
  @Mapping(target = "avatarUrl",
    expression = "java(user.getAvatarUrl() != null ? Messenger.demo.constant.MinIOPrefixUrl.MINIO_URL + user.getAvatarUrl() : null)")
  ```
- **Lombok integration:** `pom.xml` includes `lombok-mapstruct-binding` to coordinate annotation processing

### Code Formatting (Spotless)

- Configured in `pom.xml` under `spotless-maven-plugin`
- Enforces: Palantir Java Format, tabs (4 spaces), import order (`java → jakarta → org → com`), remove unused imports
- **Always run `mvnw.cmd spotless:apply` before committing** to avoid CI failures

### Security Patterns

- **JWT Validation:** `CustomJwtDecoder` decodes tokens; `JwtAuthenticationConverter` sets authority prefix to empty string (role names used directly)
- **CORS:** Configured inline in `SecurityConfig` to allow `http://localhost:5173` with credentials
- **WebSocket Auth:** `JwtAuthChannelInterceptor` extracts JWT from `Authorization` header during STOMP CONNECT, validates, and sets `Principal` for the session

### Redis Key Lifecycle

- **TTL constants:** `RedisKeyTTL.java` defines expiration times (e.g., OTP = 3600s)
- **Usage pattern:**
  ```java
  redisTemplate.opsForValue().set(
    RedisPrefixKeyConstant.ONLINE + userId,
    true,
    RedisKeyTTL.ONLINE_STATUS, TimeUnit.SECONDS
  );
  ```
- **When adding new keys:** Update `RedisPrefixKeyConstant.java` with a new `public static final String` constant

### File Upload Flow

1. Frontend: `POST` multipart file to `/messenger/api/file/upload` (see `FileController.java`)
2. Backend: Upload to MinIO bucket via `MinIOConfig` bean
3. Response: Returns object key (e.g., `avatars/user123.jpg`)
4. Storage: Store key in MongoDB entity (e.g., `User.avatarUrl`)
5. Retrieval: MapStruct mapper prepends `MinIOPrefixUrl.MINIO_URL` when converting to response DTO

## Common Tasks

### Adding a New WebSocket Subscription

1. Define topic in `ChatController` with `@MessageMapping` or broadcast in service
2. Update frontend in relevant component/page:
   ```javascript
   stompClient.subscribe("/topic/newFeature.123", (message) => {
     const data = JSON.parse(message.body);
     // Handle data
   });
   ```

### Adding a New REST Endpoint

1. Create DTOs in `dto/request` and `dto/response`
2. Define controller method in appropriate `*Controller.java` with `@PostMapping`/`@GetMapping`
3. Implement service logic in `service/`
4. Add repository method in `repository/` if needed
5. Create/update mapper in `mapper/` for entity ↔ DTO conversion
6. Frontend: Add API call in `api/` module and use in component

### Debugging WebSocket Issues

- Check browser console for connection status (`WebSocket CONNECTED` log)
- Verify JWT token in `Authorization` header during STOMP CONNECT
- Check backend logs for `JwtAuthChannelInterceptor` validation errors
- Use Spring Security debug logging: `logging.level.org.springframework.security=DEBUG` in `application.properties`

## Testing

- **Unit tests:** `demo/src/test/java/Messenger/demo/` (uses JUnit 5 + Mockito)
- **Coverage:** JaCoCo plugin configured (excludes mappers/config from coverage reports)
- **Run tests:** `mvnw.cmd test` or `./mvnw test`

## Key Files Reference

- **Backend Config:** [SecurityConfig.java](demo/src/main/java/Messenger/demo/config/SecurityConfig.java), [WebSocketConfig.java](demo/src/main/java/Messenger/demo/config/websocket/WebSocketConfig.java), [application.properties](demo/src/main/resources/application.properties)
- **Frontend Config:** [vite.config.js](FE/vite.config.js), [tailwind.config.js](FE/tailwind.config.js)
- **WebSocket:** [ChatController.java](demo/src/main/java/Messenger/demo/controller/ChatController.java), [WebSocketPresenceListener.java](demo/src/main/java/Messenger/demo/config/websocket/WebSocketPresenceListener.java), [WebsocketService.js](FE/src/api/WebsocketService.js)
- **Redis Keys:** [RedisPrefixKeyConstant.java](demo/src/main/java/Messenger/demo/constant/RedisPrefixKeyConstant.java)
- **Mappers:** [UserMapper.java](demo/src/main/java/Messenger/demo/mapper/UserMapper.java), others in `mapper/`

---

**Feedback requested:** Are there specific integration patterns (e.g., MongoDB transactions, MinIO access policies) or frontend state management patterns that need deeper documentation?
