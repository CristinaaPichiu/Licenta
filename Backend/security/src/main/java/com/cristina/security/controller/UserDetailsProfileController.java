package com.cristina.security.controller;

import com.cristina.security.dto.UserDetailsDTO;
import com.cristina.security.entity.UserDetailsProfile;
import com.cristina.security.service.UserDetailsProfileService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/user")
public class UserDetailsProfileController {

    private final UserDetailsProfileService userDetailsProfileService;

    @Autowired
    public UserDetailsProfileController(UserDetailsProfileService userDetailsProfileService) {
        this.userDetailsProfileService = userDetailsProfileService;
    }

    @PostMapping("/my_details")
    public ResponseEntity<UserDetailsProfile> saveUserDetails(@RequestBody UserDetailsDTO userDetailsDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        UserDetailsProfile userDetailsProfile = userDetailsProfileService.saveUserDetails(email, userDetailsDTO);
        return ResponseEntity.ok(userDetailsProfile);
    }
    @GetMapping("/my_details")
    public ResponseEntity<UserDetailsDTO> getUserDetails(Authentication authentication) {
        String email = authentication.getName();

        UserDetailsProfile userDetails = userDetailsProfileService.getUserDetailsByEmail(email);
        UserDetailsDTO userDetailsDTO = new UserDetailsDTO();
        BeanUtils.copyProperties(userDetails, userDetailsDTO);

        return ResponseEntity.ok(userDetailsDTO);
    }


}
