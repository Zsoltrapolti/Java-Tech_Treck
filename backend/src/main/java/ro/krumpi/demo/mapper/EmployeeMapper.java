package ro.krumpi.demo.mapper;

import ro.krumpi.demo.model.employee.Employee;
import ro.krumpi.demo.dto.EmployeeDTO;

public class EmployeeMapper {

    public static EmployeeDTO toDTO(Employee employee) {
        return new EmployeeDTO(
                employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getRole()
        );
    }

    public static Employee toEntity(EmployeeDTO dto) {
        Employee e = new Employee();
        e.setId(dto.getId());
        e.setFirstName(dto.getFirstName());
        e.setLastName(dto.getLastName());
        e.setRole(dto.getRole());
        return e;
    }
}
