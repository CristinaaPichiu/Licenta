package com.cristina.security.userProfile;
import com.cristina.security.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserDetailsResponse getUserDetails(String email) {
        return userRepository.findByEmail(email)
                .map(user -> UserDetailsResponse.builder()
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .email(user.getEmail())
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}

