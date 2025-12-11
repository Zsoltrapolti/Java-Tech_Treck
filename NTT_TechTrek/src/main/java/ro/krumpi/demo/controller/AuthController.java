package ro.krumpi.demo.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;}

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
}
