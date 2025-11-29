package Messenger.demo.config.websocket;

import Messenger.demo.config.CustomJwtDecoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.List;

@Component
public class JwtAuthChannelInterceptor implements ChannelInterceptor {

    @Autowired
    private CustomJwtDecoder customJwtDecoder;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null) {
            return message;
        }

        StompCommand command = accessor.getCommand();


        if (StompCommand.CONNECT.equals(command)) {

            String token = accessor.getFirstNativeHeader("Authorization");

            if (token == null || !token.startsWith("Bearer ")) {
                throw new IllegalArgumentException("Missing or invalid Authorization header");
            }

            token = token.substring(7); // remove "Bearer "

            try {
                Jwt jwt = customJwtDecoder.decode(token);
                String userId = jwt.getSubject(); // chính là userId

                // set Principal cho websocket session
                accessor.setUser(new UsernamePasswordAuthenticationToken(userId, null, List.of()));

            } catch (JwtException e) {
                throw new IllegalArgumentException("Invalid JWT token");
            }
        }

        if (StompCommand.SUBSCRIBE.equals(command)) {
            Principal user = accessor.getUser();

            if (user == null) {
                throw new IllegalArgumentException("Unauthenticated SUBSCRIBE");
            }

            String destination = accessor.getDestination(); // ví dụ /topic/chat/123

            if (!isValidDestination(user.getName(), destination)) {
                throw new IllegalArgumentException("Forbidden SUBSCRIBE");
            }
        }

        if (StompCommand.SEND.equals(command)) {
            Principal user = accessor.getUser();

            if (user == null) {
                throw new IllegalArgumentException("Unauthenticated SEND");
            }

            String destination = accessor.getDestination(); // /app/chat.send/123

            if (!isValidDestination(user.getName(), destination)) {
                throw new IllegalArgumentException("Forbidden SEND");
            }
        }

        return message;
    }


    private boolean isValidDestination(String userId, String destination) {

        // Nếu bạn không dùng conversation theo userId → return true
        // Sau này bạn thay bằng logic kiểm tra DB
        return true;
    }
}
