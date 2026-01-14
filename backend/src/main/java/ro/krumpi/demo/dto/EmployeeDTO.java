package ro.krumpi.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
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
