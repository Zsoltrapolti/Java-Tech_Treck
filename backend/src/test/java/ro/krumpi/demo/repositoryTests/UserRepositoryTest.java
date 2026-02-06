//package ro.krumpi.demo.repositoryTests;
//
//import ro.krumpi.demo.model.auth.UserAccount;
//import ro.krumpi.demo.repository.UserAccountRepository;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
//import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
//import org.springframework.test.context.TestPropertySource;
//import ro.krumpi.demo.model.auth.Role;
//
//
//import static org.junit.jupiter.api.Assertions.*;
//
//@DataJpaTest
//@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
//@TestPropertySource(properties = {
//        "spring.jpa.hibernate.ddl-auto=create-drop",
//        "spring.flyway.enabled=false",
//        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
//})
//class UserRepositoryTest {
//
//    @Autowired
//    private UserAccountRepository userRepository;
//
//    @Test
//    void saveUserAccount() {
//        UserAccount user = UserAccount.builder()
//                .username("andreea")
//                .password("encoded_pass")
//                .role(Role.ADMIN)   // ✅ enum, not String
//                .build();
//
//        UserAccount saved = userRepository.save(user);
//
//        assertNotNull(saved.getId());
//        assertEquals("andreea", saved.getUsername());
//    }
//
//    @Test
//    void findByUsername() {
//        UserAccount user = UserAccount.builder()
//                .username("testUser")
//                .password("pass")
//                .role(Role.USER)
//                .build();
//        userRepository.save(user);
//
//        var found = userRepository.findByUsername("testUser");
//        assertTrue(found.isPresent());
//        assertEquals(Role.USER, found.get().getRole());
//    }
//}