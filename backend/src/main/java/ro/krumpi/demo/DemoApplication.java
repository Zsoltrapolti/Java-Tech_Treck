package ro.krumpi.demo;


import ro.krumpi.demo.model.employee.Employee;
import ro.krumpi.demo.service.EmployeeService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
        System.out.println("Swagger: http://localhost:8081/swagger-ui/index.html");

    }
//    @Bean
//    public CommandLineRunner run(EmployeeService employeeService) {
//        return args -> {
//
//            // CREATE
//            createEmployee(employeeService, "John", "Doe", "Developer");
//            createEmployee(employeeService, "Jane", "Smith", "Manager");
//
//            // READ ALL
//            getAllEmployees(employeeService);
//
//            // READ BY ID
//            getEmployeeById(employeeService, 1L);
//
//            // UPDATE
//            updateEmployee(employeeService, 1L, "John", "Doe", "Senior Developer");
//
//            // DELETE
//            deleteEmployee(employeeService, 2L);
//
//            // FINAL LIST
//            System.out.println("\n=== FINAL EMPLOYEE LIST ===");
//            getAllEmployees(employeeService);
//        };
//    }
//
//    // ================= FUNCTIONS (Like Controller Methods) =================
//
//    private void createEmployee(EmployeeService service, String firstName, String lastName, String role) {
//        Employee employee = new Employee();
//        employee.setFirstName(firstName);
//        employee.setLastName(lastName);
//        employee.setRole(role);
//
//        service.addEmployee(employee);
//        System.out.println(" Employee added: " + firstName + " " + lastName);
//    }
//
//    private void getAllEmployees(EmployeeService service) {
//        System.out.println("\n=== ALL EMPLOYEES ===");
//
//        service.getAllEmployees().forEach(emp ->
//                System.out.println(
//                        emp.getId() + " | " +
//                                emp.getFirstName() + " " +
//                                emp.getLastName() + " | " +
//                                emp.getRole()
//                )
//        );
//    }
//
//    private void getEmployeeById(EmployeeService service, Long id) {
//        System.out.println("\n=== EMPLOYEE WITH ID " + id + " ===");
//
//        Optional<Employee> employee = service.getEmployeeById(id);
//
//        if (employee.isPresent()) {
//            Employee emp = employee.get();
//            System.out.println(
//                    emp.getId() + " | "
//                            + emp.getFirstName() + " "
//                            + emp.getLastName() + " | "
//                            + emp.getRole()
//            );
//        } else {
//            System.out.println(" Employee not found");
//        }
//    }
//
//    private void updateEmployee(EmployeeService service, Long id,
//                                String firstName, String lastName, String role) {
//
//        try {
//            Employee updated = new Employee();
//            updated.setFirstName(firstName);
//            updated.setLastName(lastName);
//            updated.setRole(role);
//
//            service.updateEmployee(id, updated);
//
//            System.out.println(" Employee ID " + id + " updated");
//        } catch (Exception e) {
//            System.out.println(" Could not update employee with id " + id);
//        }
//    }
//
//    private void deleteEmployee(EmployeeService service, Long id) {
//        try {
//            service.deleteEmployee(id);
//            System.out.println(" Employee ID " + id + " deleted");
//        } catch (Exception e) {
//            System.out.println(" Could not delete employee with id " + id);
//        }
//    }
}
