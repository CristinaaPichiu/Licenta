package com.cristina.security.controller;

import com.cristina.security.dto.CoverLetterDTO;
import com.cristina.security.dto.ResumeDTO;
import com.cristina.security.entity.CoverLetter;
import com.cristina.security.entity.Resume;
import com.cristina.security.entity.User;
import com.cristina.security.service.CoverLetterService;
import com.cristina.security.service.ResumeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/letter")
@RequiredArgsConstructor
public class CoverLetterController {

    private static final Logger logger = LoggerFactory.getLogger(ResumeController.class);
    private final CoverLetterService coverLetterService; // Final to ensure it's included in the constructor


    @PostMapping("/datas")
    public ResponseEntity<CoverLetter> createCoverLetter(@RequestBody CoverLetterDTO coverLetterDTO) {
        logger.info("Received CoverLetterDTO:");
        logger.info("Contact User: {}", coverLetterDTO.getContactUser());
        logger.info("Contact Employer: {}", coverLetterDTO.getContactEmployer());
        logger.info("Body: {}", coverLetterDTO.getBody());

        CoverLetter coverLetter = coverLetterService.createCoverLetter(coverLetterDTO);
        return ResponseEntity.ok(coverLetter);
    }

    @GetMapping("/{coverLetterId}")
    public ResponseEntity<CoverLetter> getCoverLetter(@PathVariable UUID coverLetterId) {
        try {
            CoverLetter coverLetter = coverLetterService.getCoverLetterDetails(coverLetterId);
            return ResponseEntity.ok(coverLetter);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/last")
    public ResponseEntity<CoverLetter> getCurrentUserCoverLetter() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = (User) authentication.getPrincipal(); // Cast directly to User as it implements UserDetails
        Integer userId = user.getId(); // Extract ID directly from the User entity

        Optional<CoverLetter> coverLetter = coverLetterService.getLatestCoverLetterByUserId(userId);
        return coverLetter.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{coverLetterId}")
    public ResponseEntity<CoverLetter> updateCoverLetter(@PathVariable UUID coverLetterId, @RequestBody CoverLetterDTO coverLetterDTO) {
        try {
            CoverLetter updatedCoverLetter = coverLetterService.updateCoverLetter(coverLetterId, coverLetterDTO);
            return ResponseEntity.ok(updatedCoverLetter);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
