package com.cristina.security.service;

import com.cristina.security.dto.*;
import com.cristina.security.entity.*;
import com.cristina.security.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AboutSectionRepository aboutSectionRepository;
    @Autowired
    private ContactSectionRepository contactSectionRepository;
    @Autowired
    private CustomSectionRepository customSectionRepository;
    @Autowired
    private EducationSectionRepository educationSectionRepository;
    @Autowired
    private ExperienceSectionRepository experienceSectionRepository;
    @Autowired
    private LinkSectionRepository linkSectionRepository;
    @Autowired
    private ProjectSectionRepository projectSectionRepository;
    @Autowired
    private SkillsSectionRepository skillsSectionRepository;
    @Autowired
    private VolunteeringSectionRepository volunteeringSectionRepository;

    @Transactional
    public Resume createResume(ResumeDTO resumeDTO) {
        User user = userRepository.findById(resumeDTO.getUserId()).orElseThrow(
                () -> new RuntimeException("User not found with id: " + resumeDTO.getUserId()));

        // Generate a UUID for the resume
        UUID resumeUUID = UUID.randomUUID();

        // Create a new Resume instance
        Resume resume = new Resume();
        resume.setId(resumeUUID);  // Set the generated UUID
        resume.setUser(user);
        resumeRepository.save(resume);
        System.out.print("AAAAAAAAAAAAAAAAA");
        System.out.println(resumeUUID);

        resume.setAboutSection(saveAboutSection(resumeDTO.getAboutSection(), user, resume));
        resume.setContactSection(saveContactSection(resumeDTO.getContactSection(), user, resume));
        resume.setEducationSections(saveEducationSections(resumeDTO.getEducationSections(), user, resume));
        resume.setExperienceSection(saveExperienceSections(resumeDTO.getExperienceSections(), user, resume));
        resume.setLinkSection(saveLinkSections(resumeDTO.getLinkSections(), user, resume));
        resume.setProjectSection(saveProjectSections(resumeDTO.getProjectSections(), user, resume));
        resume.setSkillSection(saveSkillsSections(resumeDTO.getSkillsSections(), user, resume));
        resume.setVolunteeringSection(saveVolunteeringSections(resumeDTO.getVolunteeringSections(), user, resume));
        resume.setCustomSection(saveCustomSections(resumeDTO.getCustomSections(), user, resume));

        System.out.print("AAAAAAAAAAAAAAAAAAAAAAA");
        System.out.print(resume.getId());
        return resumeRepository.save(resume);
    }

    private AboutSection saveAboutSection(AboutDTO dto, User user, Resume resume) {
        if (dto != null) {
            AboutSection section = new AboutSection();
            section.setSummary(dto.getSummary());
            section.setUser(user);
            section.setResume(resume);
            System.out.println(section.getResume().getId());
            System.out.println("--------------------------");
            System.out.println(resume.getId());// Asigură-te că resume-ul este setat corect
            return aboutSectionRepository.save(section);
        }
        return null;
    }


    private ContactSection saveContactSection(ContactDTO dto, User user, Resume resume) {
        if (dto != null) {
            ContactSection section = new ContactSection();
            section.setName(dto.getName());
            section.setStatus(dto.getStatus());
            section.setAddress(dto.getAddress());
            section.setCity(dto.getCity());
            section.setPostalCode(dto.getPostalCode());
            section.setPhone(dto.getPhone());
            section.setEmail(dto.getEmail());
            section.setUser(user);
            section.setResume(resume);
            return contactSectionRepository.save(section);
        }
        return null;
    }

    // Implement similar methods for other sections...

    private List<EducationSection> saveEducationSections(List<EducationDTO> dtos, User user, Resume resume) {
        return dtos.stream().map(dto -> {
            EducationSection section = new EducationSection();
            section.setSchool(dto.getSchool());
            section.setDegree(dto.getDegree());
            section.setStartDate(dto.getStartDate());
            section.setEndDate(dto.getEndDate());
            section.setUser(user);
            section.setResume(resume);
            return educationSectionRepository.save(section);
        }).collect(Collectors.toList());
    }

    private List<ExperienceSection> saveExperienceSections(List<ExperienceDTO> dtos, User user, Resume resume) {
        return dtos.stream().map(dto -> {
            ExperienceSection section = new ExperienceSection();
            section.setJobTitle(dto.getJobTitle());
            section.setEmployer(dto.getEmployer());
            section.setStartDate(dto.getStartDate());
            section.setEndDate(dto.getEndDate());
            section.setCity(dto.getCity());
            section.setDescription(dto.getDescription());
            section.setUser(user);
            section.setResume(resume);
            return experienceSectionRepository.save(section);
        }).collect(Collectors.toList());
    }

    // Save skills sections
    private List<SkillsSection> saveSkillsSections(List<SkillsDTO> dtos, User user, Resume resume) {
        return dtos.stream().map(dto -> {
            SkillsSection section = new SkillsSection();
            section.setSkillName(dto.getSkillName());
            section.setProficiencyLevel(dto.getProficiencyLevel());
            section.setUser(user);
            section.setResume(resume);
            return skillsSectionRepository.save(section);
        }).collect(Collectors.toList());
    }

    // Save project sections
    private List<ProjectSection> saveProjectSections(List<ProjectDTO> dtos, User user,Resume resume) {
        return dtos.stream().map(dto -> {
            ProjectSection section = new ProjectSection();
            section.setProjectName(dto.getProjectName());
            section.setTechnologiesUsed(dto.getTechnologiesUsed());
            section.setStartDate(dto.getStartDate());
            section.setEndDate(dto.getEndDate());
            section.setDescription(dto.getDescription());
            section.setUser(user);
            section.setResume(resume);
            return projectSectionRepository.save(section);
        }).collect(Collectors.toList());
    }

    // Save link sections
    private List<LinkSection> saveLinkSections(List<LinkDTO> dtos, User user, Resume resume) {
        return dtos.stream().map(dto -> {
            LinkSection section = new LinkSection();
            section.setLabel(dto.getLabel());
            section.setUrl(dto.getUrl());
            section.setUser(user);
            section.setResume(resume);
            return linkSectionRepository.save(section);
        }).collect(Collectors.toList());
    }

    // Save volunteering sections
    private List<VolunteeringSection> saveVolunteeringSections(List<VolunteeringDTO> dtos, User user, Resume resume) {
        return dtos.stream().map(dto -> {
            VolunteeringSection section = new VolunteeringSection();
            section.setRole(dto.getRole());
            section.setOrganization(dto.getOrganization());
            section.setStartDate(dto.getStartDate());
            section.setEndDate(dto.getEndDate());
            section.setCity(dto.getCity());
            section.setDescription(dto.getDescription());
            section.setUser(user);
            section.setResume(resume);
            return volunteeringSectionRepository.save(section);
        }).collect(Collectors.toList());
    }

    // Save custom sections
    private List<CustomSection> saveCustomSections(List<CustomSectionDTO> dtos, User user, Resume resume) {
        return dtos.stream().map(dto -> {
            CustomSection section = new CustomSection();
            section.setTitle(dto.getTitle());
            section.setDescription(dto.getDescription());
            section.setUser(user);
            section.setResume(resume);
            return customSectionRepository.save(section);
        }).collect(Collectors.toList());
    }
}


// Methods for Skills, Projects, Links, Volunteering, Custom Sections...

