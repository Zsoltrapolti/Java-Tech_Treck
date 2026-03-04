package ro.krumpi.demo.serviceTests;



import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ro.krumpi.demo.dto.account.AccountRequestStatusDTO;
import ro.krumpi.demo.dto.account.AskAccountRequestDTO;
import ro.krumpi.demo.model.auth.AccountRequest;
import ro.krumpi.demo.model.auth.AccountRequestStatus;
import ro.krumpi.demo.model.auth.Role;
import ro.krumpi.demo.repository.AccountRequestRepository;
import ro.krumpi.demo.service.AccountRequestService;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountRequestServiceTest {

    @Mock
    private AccountRequestRepository repo;

    @InjectMocks
    private AccountRequestService service;

    private AccountRequest sampleRequest;
    private final String email = "test@example.com";

    @BeforeEach
    void setUp() {
        sampleRequest = new AccountRequest();
        sampleRequest.setId(1L);
        sampleRequest.setEmail(email);
        sampleRequest.setStatus(AccountRequestStatus.REGISTERED);
    }

//    @Nested
//    @DisplayName("Creation Tests")
//    class CreationTests {
//        @Test
//        void createRequest_Success() {
//            AskAccountRequestDTO dto = new AskAccountRequestDTO(email, "Name");
//            when(repo.existsByEmail(email)).thenReturn(false);
//            when(repo.save(any(AccountRequest.class))).thenReturn(sampleRequest);
//
//            AccountRequest result = service.createRequest(dto);
//
//            assertNotNull(result);
//            verify(repo).save(any(AccountRequest.class));
//        }
//
//        @Test
//        void createRequest_ThrowsException_WhenEmailExists() {
//            AskAccountRequestDTO dto = new AskAccountRequestDTO(email, "Name");
//            when(repo.existsByEmail(email)).thenReturn(true);
//
//            assertThrows(IllegalStateException.class, () -> service.createRequest(dto));
//        }
//    }

    @Nested
    @DisplayName("Status and Retrieval Tests")
    class RetrievalTests {
        @Test
        void getStatusByEmail_Success() {
            when(repo.findByEmail(email)).thenReturn(Optional.of(sampleRequest));

            AccountRequestStatusDTO result = service.getStatusByEmail(email);

            assertNotNull(result);
            verify(repo).findByEmail(email.toLowerCase());
        }

        @Test
        void getApprovedRequest_Success() {
            sampleRequest.setStatus(AccountRequestStatus.APPROVED);
            sampleRequest.setAssignedRole(Role.USER);
            when(repo.findByEmail(email)).thenReturn(Optional.of(sampleRequest));

            AccountRequest result = service.getApprovedRequest(email);

            assertEquals(AccountRequestStatus.APPROVED, result.getStatus());
        }

        @Test
        void getApprovedRequest_Throws_WhenNotApproved() {
            sampleRequest.setStatus(AccountRequestStatus.REJECTED);
            when(repo.findByEmail(email)).thenReturn(Optional.of(sampleRequest));

            assertThrows(IllegalStateException.class, () -> service.getApprovedRequest(email));
        }
    }

    @Nested
    @DisplayName("Approval and Rejection Tests")
    class DecisionTests {
        @Test
        void approve_Success() {
            when(repo.findById(1L)).thenReturn(Optional.of(sampleRequest));

            AccountRequest result = service.approve(1L, Role.ADMIN);

            assertEquals(AccountRequestStatus.APPROVED, result.getStatus());
            assertEquals(Role.ADMIN, result.getAssignedRole());
        }

        @Test
        void approve_Throws_WhenRoleIsNull() {
            when(repo.findById(1L)).thenReturn(Optional.of(sampleRequest));

            assertThrows(IllegalStateException.class, () -> service.approve(1L, null));
        }

        @Test
        void reject_Success() {
            when(repo.findById(1L)).thenReturn(Optional.of(sampleRequest));

            AccountRequest result = service.reject(1L);

            assertEquals(AccountRequestStatus.REJECTED, result.getStatus());
            assertNull(result.getAssignedRole());
        }
    }

    @Nested
    @DisplayName("Utility Tests")
    class UtilityTests {
        @Test
        void getAllRegistered_FiltersCorrectly() {
            AccountRequest req2 = new AccountRequest();
            req2.setStatus(AccountRequestStatus.APPROVED);

            when(repo.findAll()).thenReturn(List.of(sampleRequest, req2));

            List<AccountRequest> result = service.getAllRegistered();

            assertEquals(1, result.size());
            assertEquals(AccountRequestStatus.REGISTERED, result.get(0).getStatus());
        }

        @Test
        void deleteRequest_Success() {
            when(repo.findById(1L)).thenReturn(Optional.of(sampleRequest));

            service.deleteRequest(1L);

            verify(repo, times(1)).delete(sampleRequest);
        }

        @Test
        void updateRole_Success() {
            when(repo.findById(1L)).thenReturn(Optional.of(sampleRequest));

            AccountRequest result = service.updateRole(1L, Role.USER);

            assertEquals(Role.USER, result.getAssignedRole());
        }
    }
}