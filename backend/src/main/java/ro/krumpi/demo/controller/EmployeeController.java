package ro.krumpi.demo.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.krumpi.demo.dto.EmployeeDTO;
import ro.krumpi.demo.mapper.EmployeeMapper;
import ro.krumpi.demo.model.employee.Employee;
import ro.krumpi.demo.service.EmployeeService;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:5174")
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
    public List<EmployeeDTO> getAllEmployees() {
        return employeeService.getAllEmployees()
                .stream()
                .map(EmployeeMapper::toDTO)
                .toList();
    }

    @Operation(
            summary = "Get employee by ID",
            description = "Returns the employee that matches the given ID"
    )
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id)
                .map(EmployeeMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
            summary = "Create a new employee",
            description = "Adds a new employee to the system"
    )
    @PostMapping
    public EmployeeDTO createEmployee(@Valid @RequestBody EmployeeDTO employeeDTO) {
        Employee saved = employeeService.addEmployee(EmployeeMapper.toEntity(employeeDTO));
        return EmployeeMapper.toDTO(saved);
    }

    @Operation(
            summary = "Update employee",
            description = "Updates employee information for the given ID"
    )
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDTO> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeDTO updatedDto
    ) {
        Employee updated = employeeService.updateEmployee(id, EmployeeMapper.toEntity(updatedDto));
        return ResponseEntity.ok(EmployeeMapper.toDTO(updated));
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
