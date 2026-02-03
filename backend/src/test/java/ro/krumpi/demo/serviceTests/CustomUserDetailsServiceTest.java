package ro.krumpi.demo.serviceTests;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import ro.krumpi.demo.config.CustomUserDetailsService;
import ro.krumpi.demo.model.auth.Role;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.repository.UserAccountRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserAccountRepository userRepo;

    @InjectMocks
    private CustomUserDetailsService detailsService;

    @Test
    void loadUserByUsername_ShouldReturnUserDetails_WhenUserExists() {
        // GIVEN
        UserAccount user = new UserAccount(1L, "krumpi", "encoded_pass", Role.ADMIN);
        when(userRepo.findByUsername("krumpi")).thenReturn(Optional.of(user));

        // WHEN
        UserDetails result = detailsService.loadUserByUsername("krumpi");

        // THEN
        assertEquals("krumpi", result.getUsername());
        assertTrue(result.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
    }

    @Test
    void loadUserByUsername_ShouldThrowException_WhenUserMissing() {
        when(userRepo.findByUsername("none")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class,
                () -> detailsService.loadUserByUsername("none"));
    }
}
