package ro.krumpi.demo.mapper;

import ro.krumpi.demo.dto.account.UserAccountDTO;
import ro.krumpi.demo.model.auth.Role;
import ro.krumpi.demo.model.auth.UserAccount;

public class UserAccountMapper {

    public static UserAccountDTO toDTO(UserAccount user) {
        if (user == null) {
            return null;
        }
        return new UserAccountDTO(
                user.getId(),
                user.getUsername(),
                user.getRole().name()
        );
    }

    public static UserAccount createUserEntity(String username, String encodedPassword, Role role) {
        return UserAccount.builder()
                .username(username)
                .password(encodedPassword)
                .role(role)
                .build();
    }
}
