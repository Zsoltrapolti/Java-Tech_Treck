package ro.krumpi.demo.repositoryTests;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import ro.krumpi.demo.model.auth.Role;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.repository.UserAccountRepository;



import static org.junit.jupiter.api.Assertions.*;


@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY) // Kényszerített tiszta H2
class UserAccountRepositoryTest {

    @Autowired private UserAccountRepository userRepository;

    @Test
    void testSave() {
        UserAccount user = UserAccount.builder()
                .username("t")
                .password("p")
                .role(Role.USER)
                .build();
        UserAccount saved = userRepository.save(user);
        assertNotNull(saved.getId());
    }
}