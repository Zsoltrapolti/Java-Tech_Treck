package ro.krumpi.demo.controller;

<<<<<<<< HEAD:NTT_TechTrek/src/main/java/ro/krumpi/demo/controller/EmployeeController.java
========
import io.swagger.v3.oas.annotations.Operation;
>>>>>>>> 6ffb373cacd99985119d91f35591ae5bc2228713:backend/src/main/java/ro/krumpi/demo/controller/EmployeeController.java
import ro.krumpi.demo.model.employee.Employee;
import ro.krumpi.demo.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @Operation(
            summary = "Get all employees",
            description = "Returns a list of all employees"
    )
    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }


    @Operation(
            summary = "Get employee by ID",
            description = "Returns the employee that matches the given ID"
    )
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
            summary = "Create a new employee",
            description = "Adds a new employee to the system"
    )
    @PostMapping
    public Employee createEmployee(@RequestBody Employee employee) {
        return employeeService.addEmployee(employee);
    }

    @Operation(
            summary = "Update employee",
            description = "Updates employee information for the given ID"
    )
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(
            @PathVariable Long id,
            @RequestBody Employee updatedEmployee
    ) {
        try {
            return ResponseEntity.ok(employeeService.updateEmployee(id, updatedEmployee));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(
            summary = "Delete employee",
            description = "Deletes the employee with the given ID"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}
