package com.cristina.security.controller;

import com.cristina.security.entity.Job;
import com.cristina.security.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @PostMapping
    public Job addJob(@RequestBody Job job) {
        return jobService.saveJob(job);
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


    // Endpoint-uri pentru update și delete
}
