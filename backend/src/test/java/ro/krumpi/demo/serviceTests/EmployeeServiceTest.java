package ro.krumpi.demo.serviceTests;

import ro.krumpi.demo.model.employee.Employee;
import ro.krumpi.demo.repository.EmployeeRepository;
import ro.krumpi.demo.service.EmployeeService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    @Test
    void updateEmployee_shouldModifyExistingData() {

        Long id = 1L;
        Employee existing = new Employee(id, "Old", "Name", "STAFF");
        Employee updateInfo = new Employee(null, "New", "Name", "ADMIN");

        when(employeeRepository.findById(id)).thenReturn(Optional.of(existing));
        when(employeeRepository.save(any(Employee.class))).thenAnswer(i -> i.getArguments()[0]);

        Employee result = employeeService.updateEmployee(id, updateInfo);

        assertEquals("New", result.getFirstName());
        assertEquals("ADMIN", result.getRole());
        verify(employeeRepository).save(existing);
    }
}