package com.cristina.security.controller;

import com.cristina.security.entity.Resume;
import com.cristina.security.entity.User;
import com.cristina.security.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.cristina.security.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;




import com.cristina.security.dto.ResumeDTO;
import com.cristina.security.entity.Resume;
import com.cristina.security.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/resume") // URL-ul base pentru toate operațiunile legate de resumes
public class ResumeController {

    private final ResumeService resumeService;
    private UserRepository userRepository;

    @Autowired
    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/info")
    public ResponseEntity<Resume> createResume(@RequestBody ResumeDTO resumeDTO) {
        Resume resume = resumeService.createResume(resumeDTO);
        return ResponseEntity.ok(resume); // Răspunde cu resume creat și un status HTTP 200 OK
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

        User user = (User) authentication.getPrincipal(); // Cast direct la User deoarece User implementează UserDetails
        Integer userId = user.getId(); // Extrage ID-ul direct de pe entitatea User

        return resumeService.getLatestResumeByUserId(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


}