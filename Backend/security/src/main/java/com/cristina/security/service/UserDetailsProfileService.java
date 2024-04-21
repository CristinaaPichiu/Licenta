package com.cristina.security.service;


import com.cristina.security.entity.User;
import com.cristina.security.dto.UserDetailsDTO;
import com.cristina.security.entity.UserDetailsProfile;
import com.cristina.security.repository.UserDetailsProfileRepository;
import com.cristina.security.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsProfileService {

    private final UserDetailsProfileRepository userDetailsProfileRepository;
    private final UserRepository userRepository;

    @Autowired
    public UserDetailsProfileService(UserDetailsProfileRepository userDetailsProfileRepository, UserRepository userRepository) {
        this.userDetailsProfileRepository = userDetailsProfileRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public UserDetailsProfile saveUserDetails(String email, UserDetailsDTO userDetailsDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        UserDetailsProfile userDetailsProfile = userDetailsProfileRepository.findByUserId(user.getId())
                .orElse(new UserDetailsProfile());

        userDetailsProfile.setUser(user);
        userDetailsProfile.setEmail(userDetailsDTO.getEmail());
        userDetailsProfile.setPhoneNumber(userDetailsDTO.getPhoneNumber());
        userDetailsProfile.setCity(userDetailsDTO.getCity());
        userDetailsProfile.setAddress(userDetailsDTO.getAddress());
        userDetailsProfile.setPostCode(userDetailsDTO.getPostCode());
        userDetailsProfile.setGithub(userDetailsDTO.getGithub());
        userDetailsProfile.setLinkedIn(userDetailsDTO.getLinkedIn());
        userDetailsProfile.setLanguage(userDetailsDTO.getLanguage());
        userDetailsProfile.setSkills(userDetailsDTO.getSkills());
        userDetailsProfile.setStatus(userDetailsDTO.getStatus());

        return userDetailsProfileRepository.save(userDetailsProfile);
    }
    public UserDetailsProfile getUserDetailsByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        return userDetailsProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("User details not found for user with email: " + email));
    }

}

