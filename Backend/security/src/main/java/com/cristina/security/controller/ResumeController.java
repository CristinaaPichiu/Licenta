package com.cristina.security.controller;

import com.cristina.security.entity.Resume;
import com.cristina.security.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


import com.cristina.security.dto.ResumeDTO;
import com.cristina.security.entity.Resume;
import com.cristina.security.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/resume") // URL-ul base pentru toate operațiunile legate de resumes
public class ResumeController {

    private final ResumeService resumeService;

    @Autowired
    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/info")
    public ResponseEntity<Resume> createResume(@RequestBody ResumeDTO resumeDTO) {
        Resume resume = resumeService.createResume(resumeDTO);
        return ResponseEntity.ok(resume); // Răspunde cu resume creat și un status HTTP 200 OK
    }
}
