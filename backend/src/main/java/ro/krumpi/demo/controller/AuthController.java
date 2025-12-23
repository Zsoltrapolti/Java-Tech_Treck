package ro.krumpi.demo.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.repository.UserAccountRepository;

import io.swagger.v3.oas.annotations.Operation;
import java.util.Map;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          UserAccountRepository userAccountRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Operation(
            summary = "Login user",
            description = "Authenticates a user and returns a JWT token"
    )
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.username(),
                            loginRequest.password()
                    )
            );

            if(authentication.isAuthenticated()){
                String role = authentication.getAuthorities().stream()
                        .findFirst()
                        .map(a -> a.getAuthority().replace("ROLE_", ""))
                        .orElse("USER");
                return ResponseEntity.ok(Map.of(
                        "message" , "Authenticated",
                        "username", loginRequest.username(),
                        "role", role
                ));
            } else {
                return ResponseEntity.status(401).body(Map.of("message" , "Unauthorized")) ;
            }
        }catch (AuthenticationException ex){
            return ResponseEntity.status(401).body(Map.of("message" , "Unauthorized"));
        }
    }

    public record LoginRequest(String username, String password) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        String requestedRole = (request.role() == null || request.role().isBlank())
                ? "USER"
                : request.role().trim().toUpperCase();

        if (!requestedRole.matches("ADMIN|EMPLOYEE|USER")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid role"));
        }

        if (userAccountRepository.existsByUsername(request.username())) {
            return ResponseEntity.status(409).body(Map.of("message", "Username already exists"));
        }

        UserAccount user = UserAccount.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .role(requestedRole)
                .build();

        userAccountRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User created"));
    }

    public record RegisterRequest(String username, String password, String role) {}

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null  || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", "")) //eliminat ROLE_ , doar pt SecurityContext folosim 
                .orElse("USER"); //implicit
        return ResponseEntity.ok(Map.of(
                "username", auth.getName(),
                "role", role // 200 status OK 
        ));
    }
}
