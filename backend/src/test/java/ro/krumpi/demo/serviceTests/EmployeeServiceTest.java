package ro.krumpi.demo.serviceTests;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ro.krumpi.demo.model.employee.Employee;
import ro.krumpi.demo.repository.EmployeeRepository;
import ro.krumpi.demo.service.EmployeeService;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("EmployeeService Unit Tests")
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    private Employee testEmployee;

    @BeforeEach
    void setUp() {
        testEmployee = new Employee();
        testEmployee.setId(1L);
        testEmployee.setFirstName("John");
        testEmployee.setLastName("Doe");
        testEmployee.setRole("Developer");
    }

    @Test
    @DisplayName("Should successfully add a new employee")
    void addEmployee_Success() {
        // Given
        when(employeeRepository.save(any(Employee.class))).thenReturn(testEmployee);

        // When
        Employee result = employeeService.addEmployee(testEmployee);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getFirstName()).isEqualTo("John");
        assertThat(result.getLastName()).isEqualTo("Doe");
        assertThat(result.getRole()).isEqualTo("Developer");
        verify(employeeRepository, times(1)).save(testEmployee);
    }

    @Test
    @DisplayName("Should retrieve all employees")
    void getAllEmployees_Success() {
        // Given
        Employee employee2 = new Employee();
        employee2.setId(2L);
        employee2.setFirstName("Jane");
        employee2.setLastName("Smith");
        employee2.setRole("Manager");

        List<Employee> employees = Arrays.asList(testEmployee, employee2);
        when(employeeRepository.findAll()).thenReturn(employees);

        // When
        List<Employee> result = employeeService.getAllEmployees();

        // Then
        assertThat(result).hasSize(2);
        assertThat(result).containsExactly(testEmployee, employee2);
        verify(employeeRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should return empty list when no employees exist")
    void getAllEmployees_EmptyList() {
        // Given
        when(employeeRepository.findAll()).thenReturn(Arrays.asList());

        // When
        List<Employee> result = employeeService.getAllEmployees();

        // Then
        assertThat(result).isEmpty();
        verify(employeeRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should retrieve employee by ID when exists")
    void getEmployeeById_Found() {
        // Given
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));

        // When
        Optional<Employee> result = employeeService.getEmployeeById(1L);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(1L);
        assertThat(result.get().getFirstName()).isEqualTo("John");
        verify(employeeRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should return empty Optional when employee not found by ID")
    void getEmployeeById_NotFound() {
        // Given
        when(employeeRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        Optional<Employee> result = employeeService.getEmployeeById(999L);

        // Then
        assertThat(result).isEmpty();
        verify(employeeRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Should successfully update existing employee")
    void updateEmployee_Success() {
        // Given
        Employee updatedData = new Employee();
        updatedData.setFirstName("John Updated");
        updatedData.setLastName("Doe Updated");
        updatedData.setRole("Senior Developer");

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));
        when(employeeRepository.save(any(Employee.class))).thenReturn(testEmployee);

        // When
        Employee result = employeeService.updateEmployee(1L, updatedData);

        // Then
        assertThat(result.getFirstName()).isEqualTo("John Updated");
        assertThat(result.getLastName()).isEqualTo("Doe Updated");
        assertThat(result.getRole()).isEqualTo("Senior Developer");
        verify(employeeRepository, times(1)).findById(1L);
        verify(employeeRepository, times(1)).save(testEmployee);
    }

    @Test
    @DisplayName("Should throw exception when updating non-existent employee")
    void updateEmployee_NotFound() {
        // Given
        Employee updatedData = new Employee();
        updatedData.setFirstName("John");
        updatedData.setLastName("Doe");
        updatedData.setRole("Developer");

        when(employeeRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> employeeService.updateEmployee(999L, updatedData))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Employee not found");

        verify(employeeRepository, times(1)).findById(999L);
        verify(employeeRepository, never()).save(any(Employee.class));
    }

    @Test
    @DisplayName("Should successfully delete existing employee")
    void deleteEmployee_Success() {
        // Given
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));
        doNothing().when(employeeRepository).delete(testEmployee);

        // When
        employeeService.deleteEmployee(1L);

        // Then
        verify(employeeRepository, times(1)).findById(1L);
        verify(employeeRepository, times(1)).delete(testEmployee);
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent employee")
    void deleteEmployee_NotFound() {
        // Given
        when(employeeRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> employeeService.deleteEmployee(999L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Employee not found");

        verify(employeeRepository, times(1)).findById(999L);
        verify(employeeRepository, never()).delete(any(Employee.class));
    }
}