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
    private final String EMAIL = "test@example.com";

    @BeforeEach
    void setUp() {
        sampleRequest = new AccountRequest();
        sampleRequest.setId(1L);
        sampleRequest.setEmail(EMAIL);
        sampleRequest.setStatus(AccountRequestStatus.REGISTERED);
    }

    @Nested
    @DisplayName("Creation Tests")
    class CreationTests {
        @Test
        void createRequest_Success() {
            // Updated to match DTO record: firstName, lastName, email
            AskAccountRequestDTO dto = new AskAccountRequestDTO("John", "Doe", EMAIL);

            when(repo.existsByEmail(EMAIL)).thenReturn(false);
            when(repo.save(any(AccountRequest.class))).thenReturn(sampleRequest);

            AccountRequest result = service.createRequest(dto);

            assertNotNull(result);
            verify(repo).save(any(AccountRequest.class));
        }

        @Test
        void createRequest_ThrowsException_WhenEmailExists() {
            AskAccountRequestDTO dto = new AskAccountRequestDTO("John", "Doe", EMAIL);
            when(repo.existsByEmail(EMAIL)).thenReturn(true);

            assertThrows(IllegalStateException.class, () -> service.createRequest(dto));
        }
    }

    @Nested
    @DisplayName("Status and Retrieval Tests")
    class RetrievalTests {
        @Test
        void getStatusByEmail_Success() {
            // Test normalization: service calls .toLowerCase()
            String upperEmail = "TEST@EXAMPLE.COM";
            when(repo.findByEmail(EMAIL)).thenReturn(Optional.of(sampleRequest));

            AccountRequestStatusDTO result = service.getStatusByEmail(upperEmail);

            assertNotNull(result);
            verify(repo).findByEmail(EMAIL);
        }

        @Test
        void getApprovedRequest_Success() {
            sampleRequest.setStatus(AccountRequestStatus.APPROVED);
            sampleRequest.setAssignedRole(Role.USER);
            when(repo.findByEmail(EMAIL)).thenReturn(Optional.of(sampleRequest));

            AccountRequest result = service.getApprovedRequest(EMAIL);

            assertEquals(AccountRequestStatus.APPROVED, result.getStatus());
            assertNotNull(result.getAssignedRole());
        }

        @Test
        void getApprovedRequest_Throws_WhenApprovedButNoRole() {
            // Test the specific branch where status is correct but role is missing
            sampleRequest.setStatus(AccountRequestStatus.APPROVED);
            sampleRequest.setAssignedRole(null);
            when(repo.findByEmail(EMAIL)).thenReturn(Optional.of(sampleRequest));

            IllegalStateException ex = assertThrows(IllegalStateException.class,
                    () -> service.getApprovedRequest(EMAIL));
            assertTrue(ex.getMessage().contains("no role assigned"));
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
        void reject_Success() {
            when(repo.findById(1L)).thenReturn(Optional.of(sampleRequest));

            AccountRequest result = service.reject(1L);

            assertEquals(AccountRequestStatus.REJECTED, result.getStatus());
            assertNull(result.getAssignedRole());
        }

        @Test
        void findById_Throws_WhenMissing() {
            when(repo.findById(99L)).thenReturn(Optional.empty());

            assertThrows(IllegalStateException.class, () -> service.findById(99L));
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

            // sampleRequest has status REGISTERED from setUp()
            assertEquals(1, result.size());
            assertEquals(AccountRequestStatus.REGISTERED, result.get(0).getStatus());
        }

        @Test
        void deleteRequest_Throws_WhenNotFound() {
            // Your service uses RuntimeException for this specific method
            when(repo.findById(1L)).thenReturn(Optional.empty());

            assertThrows(RuntimeException.class, () -> service.deleteRequest(1L));
        }

        @Test
        void save_CallsRepo() {
            service.save(sampleRequest);
            verify(repo).save(sampleRequest);
        }
    }
}