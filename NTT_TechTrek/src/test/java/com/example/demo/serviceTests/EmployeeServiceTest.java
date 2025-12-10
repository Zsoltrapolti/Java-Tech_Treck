package com.example.demo.serviceTests;

import com.example.demo.model.employee.Employee;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.service.EmployeeService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    // CREATE
    @Test
    void createEmployee() {
        Employee employee = new Employee();
        employee.setFirstName("John");
        employee.setLastName("Doe");
        employee.setRole("Manager");

        Employee savedEmployee = new Employee();
        savedEmployee.setId(1L);
        savedEmployee.setFirstName("John");
        savedEmployee.setLastName("Doe");
        savedEmployee.setRole("Manager");

        when(employeeRepository.save(any(Employee.class))).thenReturn(savedEmployee);

        Employee result = employeeService.addEmployee(employee);

        assertNotNull(result.getId());
        assertEquals("John", result.getFirstName());
        verify(employeeRepository, times(1)).save(employee);
    }

    // FIND ALL
    @Test
    void getAllEmployees() {
        Employee e1 = new Employee(1L, "Alice", "Smith", "HR");
        Employee e2 = new Employee(2L, "Bob", "Jones", "IT");

        List<Employee> employees = Arrays.asList(e1, e2);

        when(employeeRepository.findAll()).thenReturn(employees);

        List<Employee> result = employeeService.getAllEmployees();

        assertEquals(2, result.size());
        assertEquals("Alice", result.getFirst().getFirstName());
    }

    // FIND BY ID (FOUND)
    @Test
    void getEmployeeById_found() {
        Employee emp = new Employee(1L, "John", "Test", "Manager");

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(emp));

        Optional<Employee> result = employeeService.getEmployeeById(1L);

        assertTrue(result.isPresent());
        assertEquals("John", result.get().getFirstName());
    }

    // FIND BY ID (NOT FOUND)
    @Test
    void getEmployeeById_notFound() {
        when(employeeRepository.findById(100L)).thenReturn(Optional.empty());

        Optional<Employee> result = employeeService.getEmployeeById(100L);

        assertTrue(result.isEmpty());
    }

    // UPDATE
    @Test
    void updateEmployee_success() {
        Employee existing = new Employee(1L, "John", "Old", "Worker");
        Employee updated = new Employee(null, "JohnUpdated", "NewLast", "Lead");

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(employeeRepository.save(any(Employee.class))).thenReturn(existing);

        Employee result = employeeService.updateEmployee(1L, updated);

        assertEquals("JohnUpdated", result.getFirstName());
        assertEquals("NewLast", result.getLastName());
        assertEquals("Lead", result.getRole());
        verify(employeeRepository, times(1)).save(existing);
    }

    // UPDATE FAIL (NOT FOUND)
    @Test
    void updateEmployee_notFound() {
        when(employeeRepository.findById(99L)).thenReturn(Optional.empty());

        Employee updated = new Employee(null, "X", "Y", "Z");

        assertThrows(RuntimeException.class, () -> {
            employeeService.updateEmployee(99L, updated);
        });
    }

    // DELETE
    @Test
    void deleteEmployee() {
        doNothing().when(employeeRepository).deleteById(1L);

        employeeService.deleteEmployee(1L);

        verify(employeeRepository, times(1)).deleteById(1L);
    }
}
