package ro.krumpi.demo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.krumpi.demo.dto.RegisterRequestDTO;
import ro.krumpi.demo.model.auth.UserAccount;
import ro.krumpi.demo.repository.UserAccountRepository;
import ro.krumpi.demo.model.auth.Role;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserAccountService {

    private final UserAccountRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public UserAccount register(RegisterRequestDTO dto) {

        if (userRepo.existsByUsername(dto.username())) {
            throw new IllegalStateException("Username already exists");
        }
        Role role = dto.role() != null ? dto.role() : Role.USER;
        UserAccount user = UserAccount.builder()
                .username(dto.username())
                .password(passwordEncoder.encode(dto.password()))
                .role(role)
                .build();

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
