package com.cristina.security.controller;



import com.cristina.security.dto.PasswordChangeDTO;
import com.cristina.security.dto.UserResponseDTO;
import com.cristina.security.entity.User;
import com.cristina.security.service.GoogleCloudStorageService;
import com.cristina.security.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;
    @Autowired
    private GoogleCloudStorageService googleCloudStorageService;

    @GetMapping("/details")
    public ResponseEntity<UserResponseDTO> getUserDetails(Authentication authentication) {
        logger.info("UserController: Getting user details for '{}'", authentication.getName());
        UserResponseDTO userDetailsResponse = userService.getUserDetails(authentication.getName());
        return ResponseEntity.ok(userDetailsResponse);
    }
    @GetMapping("/email")
    public ResponseEntity<String> getUserEmail(Authentication authentication) {
        String userEmail = userService.getUserEmail(authentication.getName());
        return ResponseEntity.ok(userEmail);
    }

    @PostMapping("/update_profile")
    public ResponseEntity<User> updateUserDetails(@RequestBody UserResponseDTO userResponseDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userService.updateUserProfile(email, userResponseDTO);
        return ResponseEntity.ok(user);
    }
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeDTO passwordChangeDto,
                                            Authentication authentication) {
        String userEmail = authentication.getName();
        userService.changeUserPassword(userEmail, passwordChangeDto.getOldPassword(), passwordChangeDto.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    @GetMapping("/id")
    public ResponseEntity<Integer> getUserId(Authentication authentication) {
        String email = authentication.getName();
        Optional<User> user = userService.findByEmail(email);

        if (user.isPresent()) {
            return ResponseEntity.ok(user.get().getId());
        } else {
            return ResponseEntity.notFound().build();
        }




    }
    @PostMapping("/upload_profile_picture")
    public ResponseEntity<String> uploadProfilePicture(@RequestParam("file") MultipartFile file, Authentication authentication) {
        try {
            String email = authentication.getName();
            logger.info("Attempting to upload profile picture for user: {}", email);

            Optional<User> optionalUser = userService.findByEmail(email);
            if (!optionalUser.isPresent()) {
                logger.error("User not found for email: {}", email);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            User user = optionalUser.get();
            if (user.getProfilePictureUrl() != null && !user.getProfilePictureUrl().isEmpty()) {
                String existingFileName = user.getProfilePictureUrl().substring(user.getProfilePictureUrl().lastIndexOf('/') + 1);
                googleCloudStorageService.deleteFile(existingFileName);
                logger.info("Existing profile picture deleted successfully: {}", existingFileName);
            }

            String fileName = file.getOriginalFilename();
            logger.info("Received file: {}", fileName);
            String tempDir = System.getProperty("java.io.tmpdir");
            String filePath = tempDir + "/profile-pictures/" + fileName;

            logger.info("Saving file temporarily at: {}", filePath);
            java.io.File tempFile = new java.io.File(filePath);
            java.io.File parentDir = tempFile.getParentFile();
            if (!parentDir.exists()) {
                parentDir.mkdirs();
            }
            file.transferTo(tempFile);

            String uploadedFileName = googleCloudStorageService.uploadProfilePicture(filePath, fileName);
            String profilePictureUrl = googleCloudStorageService.getProfilePictureUrl(uploadedFileName);
            logger.info("New profile picture uploaded to URL: {}", profilePictureUrl);

            userService.updateProfilePictureUrl(user.getId(), profilePictureUrl);

            return ResponseEntity.ok("Profile picture uploaded successfully: " + profilePictureUrl);
        } catch (IOException e) {
            logger.error("Failed to upload profile picture", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload profile picture");
        }
    }


    @GetMapping("/profile_picture_url")
    public ResponseEntity<String> getProfilePictureUrl(Authentication authentication) {
        String email = authentication.getName();
        Optional<User> optionalUser = userService.findByEmail(email);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            String profilePictureUrl = user.getProfilePictureUrl();
            return ResponseEntity.ok(profilePictureUrl);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @DeleteMapping("/delete_profile_picture")
    public ResponseEntity<?> deleteProfilePicture(Authentication authentication) {
        String email = authentication.getName();
        Optional<User> optionalUser = userService.findByEmail(email);
        if (!optionalUser.isPresent()) {
            logger.error("User not found for email: {}", email);
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        String profilePictureUrl = user.getProfilePictureUrl();
        if (profilePictureUrl == null || profilePictureUrl.isEmpty()) {
            logger.info("No profile picture to delete for user: {}", email);
            return ResponseEntity.badRequest().body("No profile picture to delete");
        }

        String fileName = profilePictureUrl.substring(profilePictureUrl.lastIndexOf('/') + 1);

        googleCloudStorageService.deleteFile(fileName);

        userService.updateProfilePictureUrl(user.getId(), null);

        logger.info("Profile picture deleted successfully for user: {}", email);
        return ResponseEntity.ok("Profile picture deleted successfully");
    }


}
