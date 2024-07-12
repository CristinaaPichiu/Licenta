package com.cristina.security.controller;

import com.cristina.security.service.JoobleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/jooble")
public class JoobleController {
    @Autowired
    private JoobleService joobleService;

    @PostMapping("/search")
    public JsonNode searchJobs(@RequestBody Map<String, String> request) {
        String keywords = request.get("keywords");
        String location = request.get("location");
        System.out.print(keywords + " " + location);
        return joobleService.searchJobs(keywords, location);
    }
}
