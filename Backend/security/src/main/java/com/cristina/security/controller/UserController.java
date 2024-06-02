package com.cristina.security.controller;



import com.cristina.security.dto.PasswordChangeDTO;
import com.cristina.security.dto.UserResponseDTO;
import com.cristina.security.entity.User;
import com.cristina.security.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

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
    @GetMapping("/email")
    public ResponseEntity<String> getUserEmail(Authentication authentication) {
        // Presupunem că metoda `getUserEmail` din serviciul tău returnează doar email-ul
        String userEmail = userService.getUserEmail(authentication.getName());
        return ResponseEntity.ok(userEmail);
    }

    @PostMapping("/update_profile")
    public ResponseEntity<User> updateUserDetails(@RequestBody UserResponseDTO userResponseDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // Aceasta presupune că numele principal este adresa de email.

        User user = userService.updateUserProfile(email, userResponseDTO);
        return ResponseEntity.ok(user);
    }
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeDTO passwordChangeDto,
                                            Authentication authentication) {
        // Email-ul utilizatorului autentificat
        String userEmail = authentication.getName();
        userService.changeUserPassword(userEmail, passwordChangeDto.getOldPassword(), passwordChangeDto.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }





}
