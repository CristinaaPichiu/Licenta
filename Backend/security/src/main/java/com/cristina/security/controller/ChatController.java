package com.cristina.security.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/v1/chat")
public class ChatController {

    private static final Logger log = LoggerFactory.getLogger(ChatController.class);
    private final String apiKey = "sk-proj-4heEUfEPln95aSzDmIQAT3BlbkFJq9IMDwdz3aqS9DTfUb2w";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/first")
    public ResponseEntity<?> getChatResponse(@RequestBody Map<String, Object> requestData) {
        log.info("Received data: {}", requestData);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        List<Map<String, Object>> messages = new ArrayList<>();
        Map<String, Object> message = new HashMap<>();

        String content = requestData.containsKey("summaryData") ?
                "Write a short description about me based on this info: " + requestData.get("summaryData").toString() :
                requestData.getOrDefault("prompt", "").toString();

        message.put("role", requestData.containsKey("summaryData") ? "system" : "user");
        message.put("content", content);
        messages.add(message);

        Map<String, Object> bodyMap = new HashMap<>();
        bodyMap.put("model", "gpt-3.5-turbo");
        bodyMap.put("messages", messages);
        bodyMap.put("max_tokens", 150);

        try {
            HttpEntity<String> request = new HttpEntity<>(objectMapper.writeValueAsString(bodyMap), headers);
            String response = restTemplate.postForObject("https://api.openai.com/v1/chat/completions", request, String.class);
            log.info("Received response from OpenAI: {}", response);

            return extractContentFromResponse(response);
        } catch (JsonProcessingException e) {
            log.error("Error processing JSON", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("JSON processing error: " + e.getMessage());
        } catch (Exception e) {
            log.error("API request failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("API request failed: " + e.getMessage());
        }
    }

    private ResponseEntity<?> extractContentFromResponse(String response) throws JsonProcessingException {
        JsonNode rootNode = objectMapper.readTree(response);
        JsonNode choicesNode = rootNode.path("choices");
        if (!choicesNode.isEmpty() && choicesNode.get(0) != null) {
            JsonNode messageNode = choicesNode.get(0).path("message").path("content");
            if (!messageNode.isMissingNode()) {
                return ResponseEntity.ok().body(Collections.singletonMap("content", messageNode.asText()));
            }
        }
        return ResponseEntity.ok("No response content available");
    }




}
