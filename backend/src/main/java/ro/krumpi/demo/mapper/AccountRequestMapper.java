package ro.krumpi.demo.mapper;

import ro.krumpi.demo.dto.account.AccountRequestStatusDTO;
import ro.krumpi.demo.dto.account.AskAccountRequestDTO;
import ro.krumpi.demo.model.auth.AccountRequest;
import ro.krumpi.demo.model.auth.AccountRequestStatus;

public class AccountRequestMapper {

    public static AccountRequestStatusDTO toStatusDTO(AccountRequest req) {
        if (req == null) {
            return null;
        }
        return new AccountRequestStatusDTO(
                req.getEmail(),
                req.getStatus() != null ? req.getStatus().name() : null,
                req.getAssignedRole() != null ? req.getAssignedRole().name() : null
        );
    }

    public static AccountRequest toEntity(AskAccountRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        return AccountRequest.builder()
                .firstName(dto.firstName())
                .lastName(dto.lastName())
                .email(dto.email().toLowerCase())
                .status(AccountRequestStatus.PENDING)
                .assignedRole(null)
                .build();
    }
}