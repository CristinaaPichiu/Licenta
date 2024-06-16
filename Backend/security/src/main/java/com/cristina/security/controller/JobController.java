package com.cristina.security.controller;

import com.cristina.security.entity.Job;
import com.cristina.security.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
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

    // Endpoint-uri pentru update și delete
}
