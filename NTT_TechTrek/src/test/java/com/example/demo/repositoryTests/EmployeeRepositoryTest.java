package com.example.demo.repositoryTests;

import com.example.demo.model.employee.Employee;
import com.example.demo.repository.EmployeeRepository;
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
        "spring.jpa.show-sql=true"
})
class EmployeeRepositoryTest {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Test
    void saveEmployee() {
        // Arrange
        Employee employee = new Employee();
        employee.setFirstName("John");
        employee.setLastName("Doe");
        employee.setRole("Manager");

        // Act
        Employee saved = employeeRepository.save(employee);

        // Assert
        assertNotNull(saved.getId());
        assertEquals("John", saved.getFirstName());
        assertEquals("Doe", saved.getLastName());
        assertEquals("Manager", saved.getRole());
    }
}
