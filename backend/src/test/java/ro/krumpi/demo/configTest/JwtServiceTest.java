package ro.krumpi.demo.configTest;


import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;
import ro.krumpi.demo.config.JwtService;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    // Secret must be at least 32 characters for HS256 algorithm
    private final String TEST_SECRET = "my_super_secret_key_for_testing_123456789";
    private final long EXPIRATION = 3600000; // 1 hour

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        // Manually inject @Value fields because this is a unit test, not an integration test
        ReflectionTestUtils.setField(jwtService, "secret", TEST_SECRET);
        ReflectionTestUtils.setField(jwtService, "expirationMs", EXPIRATION);
    }

    @Test
    @DisplayName("generateToken: Should create a valid JWT string with correct subject and role")
    void generateToken_Success() {
        // Arrange
        UserDetails user = new User("krumpi_user", "password",
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));

        // Act
        String token = jwtService.generateToken(user);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());

        // Cross-verify by parsing it back
        Claims claims = jwtService.parseToken(token);
        assertEquals("krumpi_user", claims.getSubject());
        assertEquals("ROLE_ADMIN", claims.get("role"));
    }

    @Test
    @DisplayName("generateToken: Should default to ROLE_USER if no authorities present")
    void generateToken_DefaultRole() {
        // Arrange
        UserDetails user = new User("guest", "password", Collections.emptyList());

        // Act
        String token = jwtService.generateToken(user);
        Claims claims = jwtService.parseToken(token);

        // Assert
        assertEquals("ROLE_USER", claims.get("role"));
    }

    @Test
    @DisplayName("parseToken: Should fail if the token is tampered with")
    void parseToken_TamperedToken_ThrowsException() {
        // Arrange
        UserDetails user = new User("user", "pass", List.of(new SimpleGrantedAuthority("USER")));
        String token = jwtService.generateToken(user);
        String tamperedToken = token + "modified";

        // Act & Assert
        assertThrows(Exception.class, () -> jwtService.parseToken(tamperedToken));
    }

    @Test
    @DisplayName("Expiration: Issued token should have an expiration date in the future")
    void generateToken_ExpirationDateCheck() {
        // Arrange
        UserDetails user = new User("user", "pass", List.of(new SimpleGrantedAuthority("USER")));

        // Act
        String token = jwtService.generateToken(user);
        Claims claims = jwtService.parseToken(token);

        // Assert
        assertTrue(claims.getExpiration().after(new Date()));
        assertTrue(claims.getIssuedAt().before(new Date()) || claims.getIssuedAt().equals(new Date()));
    }
}