package ro.krumpi.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {

    private Long id;

    @NotBlank(message = "First name must not be empty")
    @Size(min = 2, max = 50, message = "First name must have between 2 and 50 characters")
    private String firstName;

    @NotBlank(message = "Last name must not be empty")
    @Size(min = 2, max = 50, message = "Last name must have between 2 and 50 characters")
    private String lastName;

    @NotBlank(message = "Role must not be empty")
    private String role;
}
