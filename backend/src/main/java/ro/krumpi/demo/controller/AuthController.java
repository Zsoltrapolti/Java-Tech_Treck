package ro.krumpi.demo.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.repository.UserAccountRepository;

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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.username(),
                            loginRequest.password()
                    )
            );

            if (authentication.isAuthenticated()){
                return ResponseEntity.ok(Map.of("message" , "Authenticated"));
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
        if (userAccountRepository.existsByUsername(request.username())) {
            return ResponseEntity.status(409).body(Map.of("message", "Username already exists"));
        }

        UserAccount user = UserAccount.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role() == null ? "USER" : request.role())
                .build();

        userAccountRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User created"));
    }

    public record RegisterRequest(String username, String password, String role) {}
}
