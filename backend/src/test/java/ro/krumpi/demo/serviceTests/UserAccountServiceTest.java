package ro.krumpi.demo.serviceTests;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import ro.krumpi.demo.dto.account.RegisterRequestDTO;
import ro.krumpi.demo.model.auth.AccountRequest;
import ro.krumpi.demo.model.auth.AccountRequestStatus;
import ro.krumpi.demo.model.auth.Role;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.repository.UserAccountRepository;
import ro.krumpi.demo.service.AccountRequestService;
import ro.krumpi.demo.service.UserAccountService;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserAccountServiceTest {

    @Mock private UserAccountRepository userRepo;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AccountRequestService accountRequestService;

    @InjectMocks
    private UserAccountService userAccountService;

    private RegisterRequestDTO registerDTO;
    private AccountRequest approvedRequest;


    @BeforeEach
    void setUp() {
        // Note the change from Role.ROLE_EMPLOYEE to Role.EMPLOYEE
        registerDTO = new RegisterRequestDTO("TestUser@Example.com", "password123");

        approvedRequest = new AccountRequest();
        approvedRequest.setEmail("testuser@example.com");
        approvedRequest.setAssignedRole(Role.EMPLOYEE); // Matches your enum
        approvedRequest.setStatus(AccountRequestStatus.APPROVED);
    }

    @Test
    @DisplayName("createByAdmin: Should normalize username and set correct role")
    void createByAdmin_Success() {
        String rawUsername = "AdminCreated";
        String normalized = rawUsername.toLowerCase();

        when(userRepo.existsByUsername(normalized)).thenReturn(false);
        when(passwordEncoder.encode("rawPass")).thenReturn("encodedPass");

        UserAccount adminUser = new UserAccount();
        adminUser.setUsername(normalized);
        adminUser.setRole(Role.ADMIN); // Matches your enum

        when(userRepo.save(any(UserAccount.class))).thenReturn(adminUser);

        UserAccount result = userAccountService.createByAdmin(rawUsername, "rawPass", Role.ADMIN);

        assertEquals(normalized, result.getUsername());
        verify(userRepo).save(any(UserAccount.class));
    }
    @Test
    @DisplayName("register: Should create user and update request status to REGISTERED")
    void register_Success() {
        // Arrange
        String lowerUsername = registerDTO.username().toLowerCase();

        when(userRepo.existsByUsername(lowerUsername)).thenReturn(false);
        when(accountRequestService.getApprovedRequest(lowerUsername)).thenReturn(approvedRequest);
        when(passwordEncoder.encode(registerDTO.password())).thenReturn("encodedHash");

        // Mock the save to return a user entity
        UserAccount savedUser = new UserAccount();
        savedUser.setUsername(lowerUsername);
        when(userRepo.save(any(UserAccount.class))).thenReturn(savedUser);

        // Act
        UserAccount result = userAccountService.register(registerDTO);

        // Assert
        assertNotNull(result);
        assertEquals(lowerUsername, result.getUsername());
        assertEquals(AccountRequestStatus.REGISTERED, approvedRequest.getStatus());

        verify(accountRequestService).save(approvedRequest);
        verify(userRepo).save(any(UserAccount.class));
    }

    @Test
    @DisplayName("register: Should throw exception if username already exists")
    void register_Fail_UsernameExists() {
        // Arrange
        when(userRepo.existsByUsername(anyString())).thenReturn(true);

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> userAccountService.register(registerDTO));
        verify(userRepo, never()).save(any());
    }


    @Test
    @DisplayName("findByUsername: Should throw exception when user not found")
    void findByUsername_NotFound() {
        when(userRepo.findByUsername("none")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userAccountService.findByUsername("none"));
    }

    @Test
    @DisplayName("deleteUser: Should call deleteById when user exists")
    void deleteUser_Success() {
        when(userRepo.existsById(1L)).thenReturn(true);

        userAccountService.deleteUser(1L);

        verify(userRepo).deleteById(1L);
    }
}