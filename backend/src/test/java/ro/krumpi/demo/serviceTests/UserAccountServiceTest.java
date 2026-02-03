package ro.krumpi.demo.serviceTests;



import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import ro.krumpi.demo.dto.account.RegisterRequestDTO;
import ro.krumpi.demo.model.auth.AccountRequest;
import ro.krumpi.demo.model.auth.Role;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.repository.UserAccountRepository;
import ro.krumpi.demo.service.AccountRequestService;
import ro.krumpi.demo.service.UserAccountService;

@ExtendWith(MockitoExtension.class)
class UserAccountServiceTest {

    @Mock
    private UserAccountRepository userRepo;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AccountRequestService accountRequestService;

    @InjectMocks
    private UserAccountService userAccountService;

    @Test
    void register_ShouldSaveUser_WhenRequestIsApproved() {
        // GIVEN
        RegisterRequestDTO dto = new RegisterRequestDTO("test@demo.com", "password123");
        AccountRequest mockRequest = new AccountRequest();
        mockRequest.setAssignedRole(Role.USER);

        when(userRepo.existsByUsername("test@demo.com")).thenReturn(false);
        when(accountRequestService.getApprovedRequest("test@demo.com")).thenReturn(mockRequest);
        when(passwordEncoder.encode("password123")).thenReturn("encoded_pass");

        // Mocking the save to return the object passed to it
        when(userRepo.save(any(UserAccount.class))).thenAnswer(i -> i.getArguments()[0]);

        // WHEN
        UserAccount result = userAccountService.register(dto);

        // THEN
        assertNotNull(result);
        assertEquals("test@demo.com", result.getUsername());
        assertEquals("encoded_pass", result.getPassword());
        verify(userRepo, times(1)).save(any());
        verify(accountRequestService, times(1)).save(mockRequest);
    }

    @Test
    void register_ShouldThrowException_WhenUserAlreadyExists() {
        // GIVEN
        RegisterRequestDTO dto = new RegisterRequestDTO("exists@demo.com", "pass");
        when(userRepo.existsByUsername("exists@demo.com")).thenReturn(true);

        // WHEN & THEN
        assertThrows(IllegalStateException.class, () -> userAccountService.register(dto));
    }
}
