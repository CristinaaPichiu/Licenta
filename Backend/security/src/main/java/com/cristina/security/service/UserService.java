package com.cristina.security.service;
import com.cristina.security.entity.User;
import com.cristina.security.repository.UserRepository;
import com.cristina.security.dto.UserResponseDTO;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public UserResponseDTO getUserDetails(String email) {
        return userRepository.findByEmail(email)
                .map(user -> UserResponseDTO.builder()
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
    public String getUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return user.getEmail();
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
    public boolean changeUserPassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Verifică dacă parola veche este corectă
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Invalid old password");
        }

        // Setează noua parolă
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }





}

