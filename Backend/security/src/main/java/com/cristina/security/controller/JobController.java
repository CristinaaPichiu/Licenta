package com.cristina.security.controller;

import com.cristina.security.entity.Job;
import com.cristina.security.models.FileUploadUtil;
import com.cristina.security.service.GoogleCloudStorageService;
import com.cristina.security.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @Autowired
    private GoogleCloudStorageService googleCloudStorageService;

    @PostMapping
    public ResponseEntity<Job> saveOrUpdateJob(@RequestBody Job job) {
        Job savedJob = jobService.saveOrUpdateJob(job);
        return new ResponseEntity<>(savedJob, HttpStatus.OK);
    }

    @PostMapping("/{id}/upload")
    public ResponseEntity<String> uploadFile(@PathVariable Integer id, @RequestParam("file") MultipartFile file) {
        try {
            Job job = jobService.findById(id);
            String fileName = file.getOriginalFilename();
            String uploadDir = "temp-files/" + id;

            FileUploadUtil.saveFile(uploadDir, fileName, file);

            String filePath = uploadDir + "/" + fileName;
            String fileId = googleCloudStorageService.uploadFile(filePath, fileName);

            job.setFilePath(fileId);
            jobService.saveOrUpdateJob(job);

            return ResponseEntity.ok("File uploaded successfully to Google Cloud Storage: " + fileName);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file to Google Cloud Storage");
        }
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<String> getFileName(@PathVariable Integer id) {
        Job job = jobService.findById(id);
        if (job != null && job.getFilePath() != null) {
            return ResponseEntity.ok(job.getFilePath());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
        }
    }

    @DeleteMapping("/{id}/file")
    public ResponseEntity<String> deleteFile(@PathVariable Integer id) {
        Job job = jobService.findById(id);
        if (job != null && job.getFilePath() != null) {
            try {
                googleCloudStorageService.deleteFile("bucket_documents_1", job.getFilePath());
                job.setFilePath(null);
                jobService.saveOrUpdateJob(job);
                return ResponseEntity.ok("File deleted successfully");
            } catch (RuntimeException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete file: " + e.getMessage());
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
        }
    }



    @GetMapping("/user/{userId}")
    public List<Job> getJobsByUser(@PathVariable Integer userId) {
        return jobService.getJobsByUser(userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteJob(@PathVariable Integer id) {
        try {
            jobService.deleteJob(id);
            return ResponseEntity.ok("Job deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting job: " + e.getMessage());
        }
    }
    @GetMapping("/statistics/{userId}")
    public ResponseEntity<Map<String, Integer>> getJobStatistics(@PathVariable Integer userId) {
        Map<String, Integer> statistics = jobService.getJobStatisticsByUser(userId);
        return ResponseEntity.ok(statistics);
    }



}