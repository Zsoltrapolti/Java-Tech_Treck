package ro.krumpi.demo.controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
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

    public AuthController(AuthenticationManager authenticationManager, UserAccountRepository userAccountRepository) {
        this.authenticationManager = authenticationManager;
        this.userAccountRepository = userAccountRepository;}

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

    @PostMapping("/register") // Mapping for creating users
    public ResponseEntity<UserAccount> register(@RequestBody UserAccount user) {
        UserAccount saved = userAccountRepository.save(user);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @DeleteMapping("/user/{id}") // Mapping for deleting users
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userAccountRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
