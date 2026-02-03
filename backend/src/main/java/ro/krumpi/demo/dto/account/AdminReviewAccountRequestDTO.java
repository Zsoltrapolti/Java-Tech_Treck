package ro.krumpi.demo.dto.account;

import jakarta.validation.constraints.NotNull;
import ro.krumpi.demo.model.auth.Role;

public record AdminReviewAccountRequestDTO(
        @NotNull boolean approve,
        Role assignedRole,
        String rejectReason
) {}
