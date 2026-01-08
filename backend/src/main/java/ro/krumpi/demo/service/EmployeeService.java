package ro.krumpi.demo.service;

import org.springframework.transaction.annotation.Transactional;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.model.employee.Employee;
import ro.krumpi.demo.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import ro.krumpi.demo.repository.UserAccountRepository;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserAccountService userAccountService;

    public EmployeeService(EmployeeRepository employeeRepository, UserAccountService userAccountService) {
        this.employeeRepository = employeeRepository;
        this.userAccountService = userAccountService;
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
    @Transactional
    public void deleteEmployee(Long id) {
        Optional<Employee> optEmployee = employeeRepository.findById(id);
        if (optEmployee.isPresent()) {
            Employee employee = optEmployee.get();
            UserAccount user = employee.getUser();
            employeeRepository.delete(employee);
            if (user != null) {
                userAccountService.deleteUser(user.getId());
            }
            return;
        }
        if (userAccountService.existsById(id)) {
            userAccountService.deleteUser(id);
            return;
        }
        throw new RuntimeException("Employee/User not found");
    }
}
