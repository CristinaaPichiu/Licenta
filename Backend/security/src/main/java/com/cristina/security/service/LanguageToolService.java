package com.cristina.security.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class LanguageToolService {

    private static final String API_URL = "https://api.languagetool.org/v2/check";

    public String checkText(String text) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(API_URL)
                .queryParam("text", text)
                .queryParam("language", "en-US");

        HttpEntity<String> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(uriBuilder.toUriString(), request, String.class);
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to process the text: " + e.getMessage();
        }
    }
}