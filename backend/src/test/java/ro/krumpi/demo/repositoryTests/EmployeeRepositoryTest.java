package ro.krumpi.demo.repositoryTests;

import ro.krumpi.demo.model.employee.Employee;
import ro.krumpi.demo.repository.EmployeeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(properties = {
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.flyway.enabled=false",
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect"
})
class EmployeeRepositoryTest {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Test
    void saveEmployee_shouldReturnSavedEmployee() {
        Employee employee = new Employee(null, "Andreea", "Krumpi", "MANAGER");

        Employee saved = employeeRepository.save(employee);

        assertNotNull(saved.getId());
        assertEquals("Andreea", saved.getFirstName());
        assertEquals("MANAGER", saved.getRole());
    }
}