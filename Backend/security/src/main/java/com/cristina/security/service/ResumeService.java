package com.cristina.security.service;

import com.cristina.security.dto.*;
import com.cristina.security.entity.*;
import com.cristina.security.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


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

        System.out.println("Attempting to create a resume for {}" + resumeDTO.getContactSection().getEmail());

        String email = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new RuntimeException("User not found with email: " + email));
        UUID resumeUUID = UUID.randomUUID();

        Resume resume = new Resume();
        resume.setId(resumeUUID);
        resume.setUser(user);
        resumeRepository.save(resume);
        System.out.print("AAAAAAAAAAAAAAAAA");
        System.out.println(resumeUUID);

        System.out.print("Saved initial Resume with ID: {}" + resume.getId());
        System.out.print("Saved initial Resume with ID: {}" + resume.getAboutSection());
        System.out.print("Saved initial Resume with ID: {}" + resume.getExperienceSection());
        System.out.print("Saved initial Resume with ID: {}" + resume.getEducationSections());


        resume.setAboutSection(saveAboutSection(resumeDTO.getAboutSection(), user, resume));
        resume.setContactSection(saveContactSection(resumeDTO.getContactSection(), user, resume));
        resume.setEducationSections(saveEducationSections(resumeDTO.getEducationSections(), user, resume));
        resume.setExperienceSection(saveExperienceSections(resumeDTO.getExperienceSections(), user, resume));
        resume.setLinkSection(saveLinkSections(resumeDTO.getLinkSections(), user, resume));
        resume.setProjectSection(saveProjectSections(resumeDTO.getProjectSections(), user, resume));
        resume.setSkillSection(saveSkillsSections(resumeDTO.getSkillsSections(), user, resume));
        resume.setVolunteeringSection(saveVolunteeringSections(resumeDTO.getVolunteeringSections(), user, resume));
        resume.setCustomSection(saveCustomSections(resumeDTO.getCustomSections(), user, resume));
        resume.setTemplateId(resumeDTO.getTemplateId());


        System.out.print("AAAAAAAAAAAAAAAAAAAAAAA");
        System.out.print(resume.getId());
        return resumeRepository.save(resume);
    }

    @Transactional
    public Resume updateResume(UUID resumeId, ResumeDTO resumeDTO) throws Exception {
        String email = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new RuntimeException("User not found with email: " + email));
        System.out.print("Pas1");

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new Exception("Resume not found with id: " + resumeId));
        System.out.print("Pas2");
        if (resumeDTO.getAboutSection() != null) {
            resume.setAboutSection(saveAboutSection(resumeDTO.getAboutSection(), user, resume));
        }
        if (resumeDTO.getContactSection() != null) {
            resume.setContactSection(saveContactSection(resumeDTO.getContactSection(), user, resume));
        }
        if (resumeDTO.getEducationSections() != null) {
            resume.getEducationSections().clear();
            resume.getEducationSections().addAll(saveEducationSections(resumeDTO.getEducationSections(), user, resume));
        }
        if (resumeDTO.getExperienceSections() != null) {
            resume.getExperienceSection().clear();
            resume.getExperienceSection().addAll(saveExperienceSections(resumeDTO.getExperienceSections(), user, resume));
        }
        if (resumeDTO.getLinkSections() != null) {
            resume.getLinkSection().clear();
            resume.getLinkSection().addAll(saveLinkSections(resumeDTO.getLinkSections(), user, resume));
        }
        if (resumeDTO.getProjectSections() != null) {
            resume.getProjectSection().clear();
            resume.getProjectSection().addAll(saveProjectSections(resumeDTO.getProjectSections(), user, resume));
        }
        if (resumeDTO.getSkillsSections() != null) {
            resume.getSkillSection().clear();
            resume.getSkillSection().addAll(saveSkillsSections(resumeDTO.getSkillsSections(), user, resume));
        }
        if (resumeDTO.getVolunteeringSections() != null) {
            resume.getVolunteeringSection().clear();
            resume.getVolunteeringSection().addAll(saveVolunteeringSections(resumeDTO.getVolunteeringSections(), user, resume));
        }
        if (resumeDTO.getCustomSections() != null) {
            resume.getCustomSection().clear();
            resume.getCustomSection().addAll(saveCustomSections(resumeDTO.getCustomSections(), user, resume));
        }

        if (resumeDTO.getTemplateId() != null) {
            resume.setTemplateId(resumeDTO.getTemplateId());
        }

        System.out.print("Pas3");


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
            System.out.println(resume.getId());
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

    private List<SkillsSection> saveSkillsSections(List<SkillsDTO> dtos, User user, Resume resume) {
        return dtos.stream().map(dto -> {
            SkillsSection section = new SkillsSection();
            section.setSkillName(dto.getSkillName());
            section.setUser(user);
            section.setResume(resume);
            return skillsSectionRepository.save(section);
        }).collect(Collectors.toList());
    }

    private List<ProjectSection> saveProjectSections(List<ProjectDTO> dtos, User user, Resume resume) {
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

    public Resume getResumeDetails(UUID resumeId) throws Exception {
        return resumeRepository.findById(resumeId)
                .orElseThrow(() -> new Exception("Resume not found with id: " + resumeId));
    }

    public Optional<Resume> getLatestResumeByUserId(Integer userId) {
        System.out.println("Fetching latest resume for user ID: " + userId);
        Pageable topOne = (Pageable) PageRequest.of(0, 1);
        List<Resume> resumes = resumeRepository.findLatestByUserId(userId, topOne);
        if (resumes.isEmpty()) {
            return Optional.empty();
        } else {
            Resume latestResume = resumes.get(0);
            System.out.println("Found resume ID: " + latestResume.getId());
            return Optional.of(latestResume);
        }
    }

    public List<ResumeDTO> getAllResumesByUserId(Integer userId) {
        List<Resume> resumes = resumeRepository.findAllByUserId(userId);
        return resumes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    private ResumeDTO convertToDTO(Resume resume) {
        ResumeDTO dto = new ResumeDTO();
        dto.setId(resume.getId());
        dto.setTemplateId(resume.getTemplateId());
        dto.setContactSection(convertContactSection(resume.getContactSection()));
        dto.setAboutSection(convertAboutSection(resume.getAboutSection()));
        dto.setEducationSections(resume.getEducationSections().stream().map(this::convertEducationSection).collect(Collectors.toList()));
        dto.setExperienceSections(resume.getExperienceSection().stream().map(this::convertExperienceSection).collect(Collectors.toList()));
        dto.setSkillsSections(resume.getSkillSection().stream().map(this::convertSkillsSection).collect(Collectors.toList()));
        dto.setProjectSections(resume.getProjectSection().stream().map(this::convertProjectSection).collect(Collectors.toList()));
        dto.setVolunteeringSections(resume.getVolunteeringSection().stream().map(this::convertVolunteeringSection).collect(Collectors.toList()));
        dto.setLinkSections(resume.getLinkSection().stream().map(this::convertLinkSection).collect(Collectors.toList()));
        dto.setCustomSections(resume.getCustomSection().stream().map(this::convertCustomSection).collect(Collectors.toList()));
        return dto;
    }
    private ContactDTO convertContactSection(ContactSection section) {
        ContactDTO dto = new ContactDTO();
        dto.setName(section.getName());
        dto.setStatus(section.getStatus());
        dto.setAddress(section.getAddress());
        dto.setCity(section.getCity());
        dto.setPostalCode(section.getPostalCode());
        dto.setPhone(section.getPhone());
        dto.setEmail(section.getEmail());
        return dto;
    }
    private AboutDTO convertAboutSection(AboutSection section) {
        AboutDTO dto = new AboutDTO();
        dto.setSummary(section.getSummary());
        return dto;
    }
    private EducationDTO convertEducationSection(EducationSection section) {
        EducationDTO dto = new EducationDTO();
        dto.setSchool(section.getSchool());
        dto.setDegree(section.getDegree());
        dto.setStartDate(section.getStartDate());
        dto.setEndDate(section.getEndDate());
        return dto;
    }
    private ExperienceDTO convertExperienceSection(ExperienceSection section) {
        ExperienceDTO dto = new ExperienceDTO();
        dto.setJobTitle(section.getJobTitle());
        dto.setEmployer(section.getEmployer());
        dto.setStartDate(section.getStartDate());
        dto.setEndDate(section.getEndDate());
        dto.setCity(section.getCity());
        dto.setDescription(section.getDescription());
        return dto;
    }
    private SkillsDTO convertSkillsSection(SkillsSection section) {
        SkillsDTO dto = new SkillsDTO();
        dto.setSkillName(section.getSkillName());
        return dto;
    }
    private ProjectDTO convertProjectSection(ProjectSection section) {
        ProjectDTO dto = new ProjectDTO();
        dto.setProjectName(section.getProjectName());
        dto.setTechnologiesUsed(section.getTechnologiesUsed());
        dto.setStartDate(section.getStartDate());
        dto.setEndDate(section.getEndDate());
        dto.setDescription(section.getDescription());
        return dto;
    }
    private VolunteeringDTO convertVolunteeringSection(VolunteeringSection section) {
        VolunteeringDTO dto = new VolunteeringDTO();
        dto.setRole(section.getRole());
        dto.setOrganization(section.getOrganization());
        dto.setStartDate(section.getStartDate());
        dto.setEndDate(section.getEndDate());
        dto.setCity(section.getCity());
        dto.setDescription(section.getDescription());
        return dto;
    }
    private LinkDTO convertLinkSection(LinkSection section) {
        LinkDTO dto = new LinkDTO();
        dto.setLabel(section.getLabel());
        dto.setUrl(section.getUrl());
        return dto;
    }
    private CustomSectionDTO convertCustomSection(CustomSection section) {
        CustomSectionDTO dto = new CustomSectionDTO();
        dto.setTitle(section.getTitle());
        dto.setDescription(section.getDescription());
        return dto;
    }

    public void updateResumePictureUrl(UUID resumeId, String profilePictureUrl) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found with ID: " + resumeId));
        resume.setProfilePictureUrl(profilePictureUrl);
        resumeRepository.save(resume);
    }

    public Optional<Resume> findById(UUID id) {
        return resumeRepository.findById(id);
    }

    public void deleteResume(UUID resumeId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new IllegalArgumentException("Resume not found"));

        resumeRepository.delete(resume);
    }



}