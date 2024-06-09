package com.cristina.security.controller;

import com.cristina.security.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api")
public class FileUploadController {


    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);
    private final Map<String, Map<String, Object>> sessionData = new ConcurrentHashMap<>();

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }
        String id = UUID.randomUUID().toString();
        try {
            ResponseEntity<Map<String, Object>> response = sendFileToExternalAPI(file);
            if (response.getStatusCode().is2xxSuccessful()) {
                sessionData.put(id, response.getBody());
                logger.info("File uploaded and response stored with id {}", id);
                return ResponseEntity.ok().body(Map.of("id", id));
            } else {
                logger.error("External API call failed: {}", response.getStatusCode());
                return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
            }
        } catch (Exception e) {
            logger.error("Failed to process the file", e);
            return ResponseEntity.internalServerError().body("Failed to process the file: " + e.getMessage());
        }
    }

    private ResponseEntity<Map<String, Object>> sendFileToExternalAPI(MultipartFile file) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.set("X-API-Key", "Cy1NgcDdsF3lIA54EQyk74Iorw3GjCkS45zkhOby");

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file_name", file.getResource());

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        RestTemplate restTemplate = new RestTemplate();
        String serviceUrl = "https://api.superparser.com/parse";

        return restTemplate.exchange(serviceUrl, HttpMethod.POST, requestEntity, new ParameterizedTypeReference<>() {});
    }

    @GetMapping("/resume-data/{id}")
    public ResponseEntity<ResumeDTO> getProcessedResumeData(@PathVariable String id) {
        Map<String, Object> data = sessionData.get(id);
        if (data == null) {
            logger.warn("Data for ID {} not found", id);
            return ResponseEntity.notFound().build();
        }
        try {
            ResumeDTO resume = mapApiResponseToResumeDTO(data);
            logger.info("Resume data retrieved and mapped for ID {}", id);
            return ResponseEntity.ok(resume);
        } catch (Exception e) {
            logger.error("Error mapping data to ResumeDTO", e);
            return ResponseEntity.internalServerError().body(null);
        }
    }

    private ResumeDTO mapApiResponseToResumeDTO(Map<String, Object> apiResponse) {
        ResumeDTO resume = new ResumeDTO();
        Map<String, Object> data = (Map<String, Object>) apiResponse.get("data");

        if (data != null) {
            resume.setContactSection(mapContact(data));
            resume.setEducationSections(mapEducationSections(data));
            resume.setExperienceSections(mapExperienceSections(data));
            resume.setProjectSections(mapProjectSections(data));
            resume.setSkillsSections(mapSkillSections(data));
            resume.setAboutSection(mapAbout(data));
            logger.info("Resume data successfully mapped from API response.");
        } else {
            logger.warn("No data found in API response to map.");
        }

        return resume;
    }


    private ContactDTO mapContact(Map<String, Object> data) {
        ContactDTO contact = new ContactDTO();
        if (data.containsKey("email") && data.get("email") instanceof List) {
            List<Map<String, String>> emails = (List<Map<String, String>>) data.get("email");
            if (!emails.isEmpty() && emails.get(0).containsKey("email")) {
                contact.setEmail(emails.get(0).get("email"));
            }
        }
        if (data.containsKey("phone") && data.get("phone") instanceof List) {
            List<Map<String, String>> phones = (List<Map<String, String>>) data.get("phone");
            if (!phones.isEmpty() && phones.get(0).containsKey("phone")) {
                contact.setPhone(phones.get(0).get("phone"));
            }
        }
        if (data.containsKey("address") && data.get("address") instanceof Map) {
            Map<String, String> addressInfo = (Map<String, String>) data.get("address");
            contact.setCity(addressInfo.getOrDefault("city", "Not available"));
            contact.setAddress(addressInfo.get("address"));
            contact.setPostalCode(addressInfo.getOrDefault("postalCode", "700"));
        }
        // Presupunem că există un câmp pentru name și status în structura de date
        contact.setName((String) data.get("name"));
        contact.setStatus((String) data.getOrDefault("status", "Student"));

        return contact;
    }


    private List<EducationDTO> mapEducationSections(Map<String, Object> data) {
        List<EducationDTO> educations = new ArrayList<>();
        List<Map<String, Object>> educationEntries = (List<Map<String, Object>>) data.get("education");
        for (Map<String, Object> entry : educationEntries) {
            EducationDTO education = new EducationDTO();
            education.setSchool((String) entry.get("institute"));
            education.setDegree((String) entry.get("degree"));
            educations.add(education);
        }
        return educations;
    }

    private List<ExperienceDTO> mapExperienceSections(Map<String, Object> data) {
        List<ExperienceDTO> experiences = new ArrayList<>();
        // Presupunem că există o secțiune "experience" în răspunsul API-ului
        List<Map<String, Object>> experienceEntries = (List<Map<String, Object>>) data.get("experience");
        if (experienceEntries != null) {
            for (Map<String, Object> entry : experienceEntries) {
                ExperienceDTO experience = new ExperienceDTO();
                experience.setJobTitle((String) entry.get("jobTitle"));
                experience.setEmployer((String) entry.get("employer"));
                experience.setDescription((String) entry.get("description"));
                experience.setCity((String) entry.get("city"));
                // Adaugă logica pentru conversia datelor date în LocalDate dacă e necesar
                experiences.add(experience);
            }
        }
        return experiences;
    }

    private List<ProjectDTO> mapProjectSections(Map<String, Object> data) {
        List<ProjectDTO> projects = new ArrayList<>();
        List<Map<String, Object>> projectEntries = (List<Map<String, Object>>) data.get("projects");
        if (projectEntries != null) {
            for (Map<String, Object> entry : projectEntries) {
                ProjectDTO project = new ProjectDTO();
                project.setProjectName((String) entry.get("projectName"));
                project.setTechnologiesUsed((String) entry.get("technologiesUsed"));
                project.setDescription((String) entry.get("description"));
                projects.add(project);
                logger.info("Added project: {}", project.toString());
            }
        }
        return projects;
    }



    private List<SkillsDTO> mapSkillSections(Map<String, Object> data) {
        List<SkillsDTO> skills = new ArrayList<>();
        // Verificăm dacă datele pentru competențe sunt prezente și sunt o listă
        if (data.containsKey("skills") && data.get("skills") instanceof List) {
            List<Map<String, Object>> skillEntries = (List<Map<String, Object>>) data.get("skills");
            for (Map<String, Object> entry : skillEntries) {
                SkillsDTO skill = new SkillsDTO();
                if (entry.get("skillName") instanceof String) {
                    skill.setSkillName((String) entry.get("skillName"));
                    skills.add(skill);
                }
            }
        }
        return skills;
    }

    private AboutDTO mapAbout(Map<String, Object> data) {
        AboutDTO about = new AboutDTO();
        // Verifică dacă cheia există și evită ClassCastException
        if (data.containsKey("about_me") && data.get("about_me") instanceof String) {
            about.setSummary((String) data.get("about_me"));
        }
        return about;
    }





}
