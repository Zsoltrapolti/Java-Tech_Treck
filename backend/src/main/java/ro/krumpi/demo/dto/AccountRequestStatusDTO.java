package ro.krumpi.demo.dto;

public record AccountRequestStatusDTO(
        String email,
        String status,
        String assignedRole
) {}
