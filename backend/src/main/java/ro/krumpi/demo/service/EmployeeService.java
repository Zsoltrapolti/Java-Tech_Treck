package ro.krumpi.demo.service;

import ro.krumpi.demo.model.employee.Employee;
import ro.krumpi.demo.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // CREATE
    public Employee addEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    // READ all
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // READ by ID (needed for controller)
    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    // UPDATE
    public Employee updateEmployee(Long id, Employee updatedEmployee) {
        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        existing.setFirstName(updatedEmployee.getFirstName());
        existing.setLastName(updatedEmployee.getLastName());
        existing.setRole(updatedEmployee.getRole());

        return employeeRepository.save(existing);
    }

    // DELETE
    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }
}
