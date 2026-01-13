package ro.krumpi.demo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.krumpi.demo.dto.RegisterRequestDTO;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.repository.UserAccountRepository;
import ro.krumpi.demo.model.auth.Role;
import ro.krumpi.demo.model.auth.AccountRequestStatus;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserAccountService {

    private final UserAccountRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final AccountRequestService accountRequestService;

    public UserAccount register(RegisterRequestDTO dto) {

        String emailAsUsername = dto.username().toLowerCase();

        if (userRepo.existsByUsername(emailAsUsername)) {
            throw new IllegalStateException("Username already exists");
        }

        var approvedReq = accountRequestService.getApprovedRequest(emailAsUsername);

        UserAccount user = UserAccount.builder()
                .username(emailAsUsername)
                .password(passwordEncoder.encode(dto.password()))
                .role(approvedReq.getAssignedRole())
                .build();

        UserAccount saved = userRepo.save(user);
        approvedReq.setStatus(AccountRequestStatus.REGISTERED);

        accountRequestService.delete(approvedReq);

        return saved;
    }

    public UserAccount createByAdmin(String username, String rawPassword, Role role) {
        if (userRepo.existsByUsername(username.toLowerCase())) {
            throw new IllegalStateException("Username already exists");
        }
        if (role == null) {
            throw new IllegalStateException("Role is required");
        }

        return userRepo.save(UserAccount.builder()
                .username(username.toLowerCase())
                .password(passwordEncoder.encode(rawPassword))
                .role(role)
                .build());
    }

    public UserAccount findByUsername(String username) {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<UserAccount> findAll() {
        return userRepo.findAll();
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepo.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepo.deleteById(id);
    }

    public boolean existsById(Long id) {
        return userRepo.existsById(id);
    }


}
