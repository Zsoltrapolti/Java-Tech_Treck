package ro.krumpi.demo.controller;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ro.krumpi.demo.dto.LoginRequestDTO;
import ro.krumpi.demo.dto.RegisterRequestDTO;
import ro.krumpi.demo.dto.UserAccountDTO;
import ro.krumpi.demo.mapper.UserAccountMapper;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.repository.UserAccountRepository;

import io.swagger.v3.oas.annotations.Operation;
import ro.krumpi.demo.service.UserAccountService;

import java.util.Map;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserAccountService userService;

    public AuthController(AuthenticationManager authenticationManager,
                          UserAccountService userService){
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    @Operation(
            summary = "Login user",
            description = "Authenticates a user and returns a JWT token"
    )
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO request) {

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(),
                        request.password()
                )
        );

        String role = auth.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("USER");

        return ResponseEntity.ok(
                Map.of(
                        "username", request.username(),
                        "role", role
                )
        );
    }

    @PostMapping("/register")
    public ResponseEntity<UserAccountDTO> register(
            @Valid @RequestBody RegisterRequestDTO request
    ) {
        System.out.println("Registering user: " + request.username());
        UserAccount saved = userService.register(request);
        return ResponseEntity.ok(UserAccountMapper.toDTO(saved));

    }

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
