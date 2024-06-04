package com.cristina.security.controller;

import com.cristina.security.dto.ResumeDTO;
import com.cristina.security.entity.Resume;
import com.cristina.security.entity.User;
import com.cristina.security.service.ResumeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/resume")
@RequiredArgsConstructor
public class ResumeController {

    private static final Logger logger = LoggerFactory.getLogger(ResumeController.class);
    private final ResumeService resumeService; // Final to ensure it's included in the constructor

    @PostMapping("/info")
    public ResponseEntity<Resume> createResume(@RequestBody ResumeDTO resumeDTO) {
        logger.info("Received ResumeDTO:");
        logger.info("About Section: {}", resumeDTO.getAboutSection());
        logger.info("Contact Section: {}", resumeDTO.getContactSection());
        logger.info("Education Sections: {}", resumeDTO.getEducationSections());
        logger.info("Experience Sections: {}", resumeDTO.getExperienceSections());
        logger.info("Link Sections: {}", resumeDTO.getLinkSections());
        logger.info("Project Sections: {}", resumeDTO.getProjectSections());
        logger.info("Skills Sections: {}", resumeDTO.getSkillsSections());
        logger.info("Volunteering Sections: {}", resumeDTO.getVolunteeringSections());
        logger.info("Custom Sections: {}", resumeDTO.getCustomSections());
        Resume resume = resumeService.createResume(resumeDTO);
        return ResponseEntity.ok(resume);
    }

    @PutMapping("/update/{resumeId}")
    public ResponseEntity<Resume> updateResume(@PathVariable UUID resumeId, @RequestBody ResumeDTO resumeDTO) {
        logger.info("Starting update for resume ID: {}", resumeId);
        try {
            Resume updatedResume = resumeService.updateResume(resumeId, resumeDTO);
            return ResponseEntity.ok(updatedResume);
        } catch (Exception e) {
            logger.error("Error updating resume: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



    @GetMapping("/{resumeId}")
    public ResponseEntity<Resume> getResume(@PathVariable UUID resumeId) {
        try {
            Resume resume = resumeService.getResumeDetails(resumeId);
            return ResponseEntity.ok(resume);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/current")
    public ResponseEntity<Resume> getCurrentUserResume() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = (User) authentication.getPrincipal(); // Cast directly to User as it implements UserDetails
        Integer userId = user.getId(); // Extract ID directly from the User entity

        return resumeService.getLatestResumeByUserId(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/all")
    public ResponseEntity<List<ResumeDTO>> getAllUserResumes() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = (User) authentication.getPrincipal();
        try {
            List<ResumeDTO> resumes = resumeService.getAllResumesByUserId(user.getId());
            return ResponseEntity.ok(resumes);
        } catch (Exception e) {
            logger.error("Failed to fetch resumes", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
