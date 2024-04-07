package com.cristina.security.userProfile;



import com.cristina.security.userProfile.UserDetailsResponse;
import com.cristina.security.userProfile.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(com.cristina.security.userProfile.UserController.class);
    private final UserService userService;

    @GetMapping("/details")
    public ResponseEntity<com.cristina.security.userProfile.UserDetailsResponse> getUserDetails(Authentication authentication) {
        logger.info("UserController: Getting user details for '{}'", authentication.getName());
        UserDetailsResponse userDetailsResponse = userService.getUserDetails(authentication.getName());
        return ResponseEntity.ok(userDetailsResponse);
    }
}
