//package ro.krumpi.demo.repositoryTests;
//
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
//import org.springframework.test.context.ActiveProfiles;
//import ro.krumpi.demo.model.auth.AccountRequest;
//import ro.krumpi.demo.model.auth.AccountRequestStatus;
//import ro.krumpi.demo.repository.AccountRequestRepository;
//
//import static org.junit.jupiter.api.Assertions.assertTrue;
//import static org.springframework.test.util.AssertionErrors.assertEquals;
//
//@DataJpaTest
//@ActiveProfiles("test") // Használja a H2 dialektust a 'returning id' hiba ellen
//class AccountRequestRepositoryTest {
//
//    @Autowired
//    private AccountRequestRepository repository;
//
//    @Test
//    void shouldFindRequestByEmail() {
//        AccountRequest request = AccountRequest.builder()
//                .firstName("Teszt")
//                .lastName("Elek")
//                .email("test@krumpi.ro")
//                .status(AccountRequestStatus.PENDING)
//                .build();
//        repository.save(request);
//
//        var found = repository.findByEmail("test@krumpi.ro");
//
//        assertTrue(found.isPresent());
//        assertEquals("Teszt", found.get().getFirstName());
//    }
//}
