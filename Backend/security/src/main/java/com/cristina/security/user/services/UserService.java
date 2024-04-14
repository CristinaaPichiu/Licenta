package com.cristina.security.user.services;
import com.cristina.security.user.User;
import com.cristina.security.user.repository.UserRepository;
import com.cristina.security.user.UserResponseDTO;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponseDTO getUserDetails(String email) {
        return userRepository.findByEmail(email)
                .map(user -> UserResponseDTO.builder()
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
    @Transactional
    public User updateUserProfile(String currentEmail, UserResponseDTO userResponseDTO) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + currentEmail));

        user.setFirstName(userResponseDTO.getFirstName());
        user.setLastName(userResponseDTO.getLastName());
        // Alte câmpuri dacă este necesar

        return userRepository.save(user);
    }

}

