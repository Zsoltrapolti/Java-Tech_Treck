package ro.krumpi.demo.mapper;

import ro.krumpi.demo.model.employee.Employee;
import ro.krumpi.demo.dto.employee.EmployeeDTO;

public class EmployeeMapper {

    public static EmployeeDTO toDTO(Employee employee) {
        return new EmployeeDTO(
                employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getRole(),
                employee.getTotalLeaveDays(),
                employee.getUsedLeaveDays()
        );
    }

    public static Employee toEntity(EmployeeDTO dto) {
        Employee e = new Employee();
        e.setFirstName(dto.getFirstName());
        e.setLastName(dto.getLastName());
        e.setRole(dto.getRole());

        if (dto.getTotalLeaveDays() != null) {
            e.setTotalLeaveDays(dto.getTotalLeaveDays());
        }
        if (dto.getUsedLeaveDays() != null) {
            e.setUsedLeaveDays(dto.getUsedLeaveDays());
        }

        return e;
    }
}
