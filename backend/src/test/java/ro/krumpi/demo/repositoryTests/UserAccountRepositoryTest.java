package ro.krumpi.demo.repositoryTests;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import ro.krumpi.demo.model.auth.Role;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.repository.UserAccountRepository;
import static org.junit.jupiter.api.Assertions.assertTrue;

import static org.springframework.test.util.AssertionErrors.assertTrue;

@DataJpaTest
class UserAccountRepositoryTest {

    @Autowired
    private UserAccountRepository repository;

    @Test
    void shouldFindUserByUsername() {
        UserAccount user = new UserAccount(null, "unique_user", "pass", Role.ADMIN);
        repository.save(user);

        var found = repository.findByUsername("unique_user");
        assertTrue(found.isPresent());
    }


}