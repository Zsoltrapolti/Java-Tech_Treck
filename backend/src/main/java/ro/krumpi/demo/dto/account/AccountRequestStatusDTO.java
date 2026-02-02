package ro.krumpi.demo.dto.account;

public record AccountRequestStatusDTO(
        String email,
        String status,
        String assignedRole
) {}
