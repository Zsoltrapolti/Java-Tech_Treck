package ro.krumpi.demo.serviceTests;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import ro.krumpi.demo.dto.account.RegisterRequestDTO;
import ro.krumpi.demo.model.auth.*;
import ro.krumpi.demo.repository.UserAccountRepository;
import ro.krumpi.demo.service.AccountRequestService;
import ro.krumpi.demo.service.UserAccountService;

// ✅ FONTOS: Ezeket az importokat használd (töröld a régieket!)
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserAccountServiceTest {

    @Mock private UserAccountRepository userRepo;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AccountRequestService accountRequestService;

    @InjectMocks
    private UserAccountService userAccountService;

    @Test
    void register_ShouldSaveUser_WhenRequestIsApproved() {

        RegisterRequestDTO dto = new RegisterRequestDTO("tesztuser", "password");

        AccountRequest approvedReq = AccountRequest.builder()
                .email("tesztuser")
                .status(AccountRequestStatus.APPROVED)
                .assignedRole(Role.USER)
                .build();

        when(userRepo.existsByUsername(anyString())).thenReturn(false);
        when(accountRequestService.getApprovedRequest(anyString())).thenReturn(approvedReq);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_pass");

        when(userRepo.save(any(UserAccount.class))).thenAnswer(i -> i.getArguments()[0]);

        userAccountService.register(dto);


        verify(userRepo).save(any(UserAccount.class));
        assertEquals(AccountRequestStatus.REGISTERED, approvedReq.getStatus());
    }
}