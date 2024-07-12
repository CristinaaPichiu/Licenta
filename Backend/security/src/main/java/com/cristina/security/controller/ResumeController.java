package com.cristina.security.controller;

import com.cristina.security.dto.ResumeDTO;
import com.cristina.security.entity.Resume;
import com.cristina.security.entity.User;
import com.cristina.security.service.GoogleCloudStorageService;
import com.cristina.security.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/resume")
@RequiredArgsConstructor
public class ResumeController {

    private static final Logger logger = LoggerFactory.getLogger(ResumeController.class);
    private final ResumeService resumeService;
    @Autowired
    private GoogleCloudStorageService googleCloudStorageService;

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

        User user = (User) authentication.getPrincipal();
        Integer userId = user.getId();

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

    @PostMapping("/{resumeId}/upload_picture")
    public ResponseEntity<String> uploadResumePicture(@PathVariable UUID resumeId, @RequestParam("file") MultipartFile file) {
        try {
            logger.info("Attempting to upload picture for resume: {}", resumeId);
            Resume resume = resumeService.findById(resumeId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resume not found"));

            String tempDir = System.getProperty("java.io.tmpdir");
            String fileName = file.getOriginalFilename();
            String filePath = Paths.get(tempDir, "resume-pictures", fileName).toString();

            File tempFile = new File(filePath);
            File parentDir = tempFile.getParentFile();
            if (!parentDir.exists() && !parentDir.mkdirs()) {
                throw new IOException("Failed to create directory: " + parentDir);
            }

            file.transferTo(tempFile);

            String uploadedFileName = googleCloudStorageService.uploadProfilePicture(filePath, fileName);
            String pictureUrl = googleCloudStorageService.getProfilePictureUrl(uploadedFileName);

            resumeService.updateResumePictureUrl(resumeId, pictureUrl);

            logger.info("Resume picture uploaded successfully: URL = {}", pictureUrl);
            return ResponseEntity.ok("Resume picture uploaded successfully: " + pictureUrl);
        } catch (IOException e) {
            logger.error("Failed to upload resume picture", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload resume picture");
        }
    }

    @GetMapping("/{resumeId}/picture_url")
    public ResponseEntity<String> getResumePictureUrl(@PathVariable UUID resumeId) {
        try {
            Resume resume = resumeService.findById(resumeId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resume not found"));

            if (resume.getProfilePictureUrl() != null && !resume.getProfilePictureUrl().isEmpty()) {
                return ResponseEntity.ok(resume.getProfilePictureUrl());
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No picture found for the resume");
            }
        }
        catch (ResponseStatusException e) {
        logger.error("Error retrieving picture URL for resume ID: {}", resumeId, e);
        return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
    } catch (Exception e) {
        logger.error("Unexpected error retrieving picture URL for resume ID: {}", resumeId, e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to retrieve picture URL");
    }

}


    @DeleteMapping("/{resumeId}")
    public ResponseEntity<?> deleteResume(@PathVariable UUID resumeId) {
        try {
            Resume resume = resumeService.findById(resumeId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resume not found"));

            resumeService.deleteResume(resumeId);

            logger.info("Resume with ID: {} deleted successfully", resumeId);
            return ResponseEntity.ok().body("Resume deleted successfully");
        } catch (ResponseStatusException e) {
            logger.error("Error deleting resume with ID: {}", resumeId, e);
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            logger.error("Unexpected error occurred while deleting resume with ID: {}", resumeId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete resume");
        }
    }





}
