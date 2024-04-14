package com.cristina.security.user.controllers;



import com.cristina.security.user.User;
import com.cristina.security.user.UserDetailsDTO;
import com.cristina.security.user.UserDetailsProfile;
import com.cristina.security.user.UserResponseDTO;
import com.cristina.security.user.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    @GetMapping("/details")
    public ResponseEntity<UserResponseDTO> getUserDetails(Authentication authentication) {
        logger.info("UserController: Getting user details for '{}'", authentication.getName());
        UserResponseDTO userDetailsResponse = userService.getUserDetails(authentication.getName());
        return ResponseEntity.ok(userDetailsResponse);
    }
    @PostMapping("/update_profile")
    public ResponseEntity<User> updateUserDetails(@RequestBody UserResponseDTO userResponseDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // Aceasta presupune că numele principal este adresa de email.

        User user = userService.updateUserProfile(email, userResponseDTO);
        return ResponseEntity.ok(user);
    }


}
