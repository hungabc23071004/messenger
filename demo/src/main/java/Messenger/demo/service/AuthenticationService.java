package Messenger.demo.service;

 import Messenger.demo.Enum.Role;
 import Messenger.demo.constant.RedisKeyTTL;
 import Messenger.demo.constant.RedisPrefixKeyConstant;
 import Messenger.demo.dto.request.AccountRegisterRequest;
 import Messenger.demo.dto.request.AuthenticationRequest;
 import Messenger.demo.dto.request.IntrospectRequest;
 import Messenger.demo.dto.response.AuthenticationResponse;
 import Messenger.demo.dto.response.IntrospectResponse;
 import Messenger.demo.dto.response.UserResponse;
 import Messenger.demo.exception.AppException;
 import Messenger.demo.exception.ErrorCode;
 import Messenger.demo.mapper.UserMapper;
 import Messenger.demo.model.User;
 import Messenger.demo.repository.UserRepository;
 import com.nimbusds.jose.*;
 import com.nimbusds.jose.crypto.MACSigner;
 import com.nimbusds.jose.crypto.MACVerifier;
 import com.nimbusds.jwt.JWTClaimsSet;
 import com.nimbusds.jwt.SignedJWT;
 import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
 import org.springframework.data.redis.core.RedisTemplate;
 import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
 import org.springframework.security.crypto.password.PasswordEncoder;
 import org.springframework.stereotype.Service;
 import org.springframework.transaction.annotation.Transactional;
 import org.springframework.util.CollectionUtils;

 import java.text.ParseException;
 import java.time.Duration;
 import java.time.Instant;
 import java.time.temporal.ChronoUnit;
 import java.util.*;
 import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    UserRepository userRepository;
    RedisTemplate<String, Object> redisTemplate;
    MailService mailService;
    UserMapper userMapper;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;


    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected Long REFRESHABLE_DURATION;

    public UserResponse registerAccount(AccountRegisterRequest request) throws Exception {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(Role.valueOf("USER")))
                .build();

        userRepository.save(user);

        String token = UUID.randomUUID().toString();
        redisTemplate.opsForValue().set(RedisPrefixKeyConstant.ACTIVE_ACCOUNT+token, user.getId(), RedisKeyTTL.ACTIVE_ACCOUNT_TTL);

        mailService.sendVerificationEmail(user.getEmail(), token, user.getUsername());

        return userMapper.toUserResponse(user);

    }

    public void verifyAccount(String token) {
        String redisKey = RedisPrefixKeyConstant.ACTIVE_ACCOUNT + token;
        String userId = (String)redisTemplate.opsForValue().get(redisKey);
        if (userId == null) {
            throw new AppException(ErrorCode.INVALID_OR_EXPIRED_TOKEN);
        }
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setVerified(true);
        userRepository.save(user);

        redisTemplate.delete(redisKey);
    }


    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        User user = userRepository.findByUsernameAndVerifiedIsTrue(request.getUsername());
        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated) throw new AppException(ErrorCode.UNAUTHENTICATED);

        var token = generateToken(user);

        var refreshToken = generateRefreshToken(user);

        redisTemplate.opsForValue().set(
                RedisPrefixKeyConstant.REFRESH_TOKEN + refreshToken,
                user.getId(),
                RedisKeyTTL.REFRESH_TOKEN_TTL
        );
        redisTemplate.opsForValue().set(
                RedisPrefixKeyConstant.TOKEN+ token,
                user.getId(),
                RedisKeyTTL.TOKEN_TTL
        );

        return AuthenticationResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .refreshToken(refreshToken)
                .authenticated(true)
                .build();
    }


    private  String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getId())
                .issuer("messenger.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }

    private String generateRefreshToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getId())
                .issuer("messenger.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create refresh token", e);
            throw new RuntimeException(e);
        }
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(",");

        if (!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.name()); // role.name() lấy enum name
            });
        }

        return stringJoiner.toString();
    }

}
