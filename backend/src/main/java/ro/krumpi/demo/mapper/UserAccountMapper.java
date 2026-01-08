package ro.krumpi.demo.mapper;

import ro.krumpi.demo.dto.UserAccountDTO;
import ro.krumpi.demo.model.auth.UserAccount;

public class UserAccountMapper {

    public static UserAccountDTO toDTO(UserAccount user) {
        return new UserAccountDTO(
                user.getId(),
                user.getUsername(),
                user.getRole().name()
        );
    }
}
