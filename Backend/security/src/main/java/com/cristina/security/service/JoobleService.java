package com.cristina.security.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.JsonNode;

@Service
public class JoobleService {
    private final String apiKey = "f8ff556b-4e22-40fd-b9fa-e9db42af5c15";
    private final String apiUrl = "https://jooble.org/api/" + apiKey;

    public JsonNode searchJobs(String keywords, String location) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        String requestJson = String.format("{\"keywords\":\"%s\",\"location\":\"%s\"}", keywords, location);
        HttpEntity<String> entity = new HttpEntity<>(requestJson, headers);

        ResponseEntity<JsonNode> response = restTemplate.exchange(apiUrl, HttpMethod.POST, entity, JsonNode.class);
        return response.getBody();
    }
}
