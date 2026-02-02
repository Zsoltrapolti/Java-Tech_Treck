package ro.krumpi.demo.controller;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ro.krumpi.demo.config.JwtService;
import ro.krumpi.demo.dto.account.LoginRequestDTO;
import ro.krumpi.demo.dto.account.RegisterRequestDTO;
import ro.krumpi.demo.dto.account.UserAccountDTO;
import ro.krumpi.demo.mapper.UserAccountMapper;
import ro.krumpi.demo.model.auth.UserAccount;

import io.swagger.v3.oas.annotations.Operation;
import ro.krumpi.demo.service.UserAccountService;

import java.util.Map;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserAccountService userService;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager,
                          UserAccountService userService, JwtService jwtService){
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @Operation(
            summary = "Login user",
            description = "Authenticates a user and returns a JWT token"
    )
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO dto) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.username(), dto.password())
        );

        SecurityContextHolder.getContext().setAuthentication(auth);

        String token = jwtService.generateToken(
                (org.springframework.security.core.userdetails.UserDetails)
                        auth.getPrincipal()
        );

        return ResponseEntity.ok(Map.of(
                "token", token,
                "type", "Bearer"
        ));
    }


    @Operation(
            summary = "Register user",
            description = "Creates an account"
    )
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
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("USER");
        return ResponseEntity.ok(Map.of(
                "username", auth.getName(),
                "role", role
        ));
    }
}
