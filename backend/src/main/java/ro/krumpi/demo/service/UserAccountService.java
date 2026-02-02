package ro.krumpi.demo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.krumpi.demo.dto.account.RegisterRequestDTO;
import ro.krumpi.demo.mapper.UserAccountMapper;
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

    @Transactional
    public UserAccount register(RegisterRequestDTO dto) {

        String emailAsUsername = dto.username().toLowerCase();

        if (userRepo.existsByUsername(emailAsUsername)) {
            throw new IllegalStateException("Username already exists");
        }

        var approvedReq = accountRequestService.getApprovedRequest(emailAsUsername);

        UserAccount user = UserAccountMapper.createUserEntity(
                emailAsUsername,
                passwordEncoder.encode(dto.password()),
                approvedReq.getAssignedRole()
        );

        UserAccount saved = userRepo.save(user);
        approvedReq.setStatus(AccountRequestStatus.REGISTERED);
        accountRequestService.save(approvedReq);

        return saved;
    }

    public UserAccount createByAdmin(String username, String rawPassword, Role role) {
        String normalizedUsername = username.toLowerCase();

        if (userRepo.existsByUsername(username.toLowerCase())) {
            throw new IllegalStateException("Username already exists");
        }
        if (role == null) {
            throw new IllegalStateException("Role is required");
        }

        UserAccount user = UserAccountMapper.createUserEntity(
                normalizedUsername,
                passwordEncoder.encode(rawPassword),
                role
        );

        return userRepo.save(user);
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
