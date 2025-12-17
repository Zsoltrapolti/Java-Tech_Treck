package ro.krumpi.demo.repositoryTests;

import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.repository.UserAccountRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.test.context.TestPropertySource;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(properties = {
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.flyway.enabled=false",
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
})
class UserAccountRepositoryTest {

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Test
    void testCreateAndDeleteUser() {

        UserAccount user = UserAccount.builder()
                .username("testUser")
                .password("JavaTechTrek")
                .role("ADMIN")
                .build();

        UserAccount saved = userAccountRepository.save(user);
        assertNotNull(saved.getId());

        userAccountRepository.delete(saved);

        Optional<UserAccount> deletedUser = userAccountRepository.findById(saved.getId());
        assertTrue(deletedUser.isEmpty());
    }
}