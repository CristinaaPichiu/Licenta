package com.cristina.security.service;

import com.cristina.security.dto.*;
import com.cristina.security.entity.*;
import com.cristina.security.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CoverLetterService {
    private static final Logger logger = LoggerFactory.getLogger(CoverLetterService.class);


    @Autowired
    private CoverLetterRepository coverLetterRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CoverLetterBodyRepository coverLetterBodyRepository;
    @Autowired
    private CoverLetterContactEmployerRepository coverLetterContactEmployerRepository;
    @Autowired
    private CoverLetterContactUserRepository coverLetterContactUserRepository;

    @Transactional
    public CoverLetter createCoverLetter(CoverLetterDTO coverLetterDTO) {
        String email = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        logger.info("Creating cover letter for user: {}", email);

        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new RuntimeException("User not found with email: " + email));

        logger.info("User retrieved from database: {}", user);


        CoverLetter coverLetter = new CoverLetter();
        coverLetter.setId(UUID.randomUUID());
        coverLetter.setUser(user);
        coverLetter.setTemplateId(coverLetterDTO.getTemplateId());

        logger.info("Cover letter created with ID: {}", coverLetter.getId());


        CoverLetterContactUser contactUser = saveContactUser(coverLetterDTO.getContactUser(), user, coverLetter);
        CoverLetterContactEmployer contactEmployer = saveContactEmployer(coverLetterDTO.getContactEmployer(), user, coverLetter);
        CoverLetterBody body = saveCoverLetterBody(coverLetterDTO.getBody(), user, coverLetter);
        coverLetter.setCoverLetterContactUser(contactUser);
        coverLetter.setCoverLetterContactEmployer(contactEmployer);
        coverLetter.setCoverLetterBody(body);

        return coverLetterRepository.save(coverLetter);

    }

    private CoverLetterContactUser saveContactUser(CoverLetterContactUserDTO dto, User user, CoverLetter coverLetter) {
        CoverLetterContactUser contactUser = new CoverLetterContactUser();
        contactUser.setFirstName(dto.getFirstName());
        contactUser.setLastName(dto.getLastName());
        contactUser.setStatus(dto.getStatus());
        contactUser.setAddress(dto.getAddress());
        contactUser.setCity(dto.getCity());
        contactUser.setPostalCode(dto.getPostalCode());
        contactUser.setPhone(dto.getPhone());
        contactUser.setEmail(dto.getEmail());
        contactUser.setUser(user);
        contactUser.setCoverLetter(coverLetter);
        return coverLetterContactUserRepository.save(contactUser);
    }

    private CoverLetterContactEmployer saveContactEmployer(CoverLetterContactEmployerDTO dto, User user, CoverLetter coverLetter) {
        CoverLetterContactEmployer contactEmployer = new CoverLetterContactEmployer();
        contactEmployer.setTitle(dto.getTitle());
        contactEmployer.setFirstName(dto.getFirstName());
        contactEmployer.setLastName(dto.getLastName());
        contactEmployer.setPosition(dto.getPosition());
        contactEmployer.setOrganisation(dto.getOrganisation());
        contactEmployer.setAddress(dto.getAddress());
        contactEmployer.setUser(user);
        contactEmployer.setCoverLetter(coverLetter);
        return coverLetterContactEmployerRepository.save(contactEmployer);
    }

    private CoverLetterBody saveCoverLetterBody(CoverLetterBodyDTO dto, User user, CoverLetter coverLetter) {
        CoverLetterBody body = new CoverLetterBody();
        body.setBody(dto.getBody());
        body.setUser(user);
        body.setCoverLetter(coverLetter);
        return coverLetterBodyRepository.save(body);
    }

    public CoverLetter getCoverLetterDetails(UUID coverLetterId) throws Exception {
        return coverLetterRepository.findById(coverLetterId)
                .orElseThrow(() -> new Exception("Cover letter not found with id: " + coverLetterId));
    }

    public Optional<CoverLetter> getLatestCoverLetterByUserId(Integer userId) {
        System.out.println("Fetching latest cover letter for user ID: " + userId);
        Pageable topOne = PageRequest.of(0, 1);
        List<CoverLetter> coverLetters = coverLetterRepository.findLatestByUserId(userId, topOne);
        if (coverLetters.isEmpty()) {
            return Optional.empty();
        } else {
            CoverLetter latestCoverLetter = coverLetters.get(0);
            System.out.println("Found cover letter ID: " + latestCoverLetter.getId());
            return Optional.of(latestCoverLetter);
        }
    }

    @Transactional
    public CoverLetter updateCoverLetter(UUID coverLetterId, CoverLetterDTO coverLetterDTO) throws Exception {
        logger.info("Updating cover letter with ID: {}", coverLetterId);

        CoverLetter existingCoverLetter = coverLetterRepository.findById(coverLetterId)
                .orElseThrow(() -> new Exception("Cover letter not found with id: " + coverLetterId));

        logger.info("Existing cover letter: {}", existingCoverLetter);

        CoverLetterContactUser contactUser = existingCoverLetter.getCoverLetterContactUser();
        updateContactUserFromDTO(contactUser, coverLetterDTO.getContactUser());
        coverLetterContactUserRepository.save(contactUser);

        CoverLetterContactEmployer contactEmployer = existingCoverLetter.getCoverLetterContactEmployer();
        updateContactEmployerFromDTO(contactEmployer, coverLetterDTO.getContactEmployer());
        coverLetterContactEmployerRepository.save(contactEmployer);

        CoverLetterBody body = existingCoverLetter.getCoverLetterBody();
        updateBodyFromDTO(body, coverLetterDTO.getBody());
        coverLetterBodyRepository.save(body);

        return existingCoverLetter;
    }

    private void updateContactUserFromDTO(CoverLetterContactUser contactUser, CoverLetterContactUserDTO dto) {
        contactUser.setFirstName(dto.getFirstName());
        contactUser.setLastName(dto.getLastName());
        contactUser.setStatus(dto.getStatus());
        contactUser.setAddress(dto.getAddress());
        contactUser.setCity(dto.getCity());
        contactUser.setPostalCode(dto.getPostalCode());
        contactUser.setPhone(dto.getPhone());
        contactUser.setEmail(dto.getEmail());
    }

    private void updateContactEmployerFromDTO(CoverLetterContactEmployer contactEmployer, CoverLetterContactEmployerDTO dto) {
        contactEmployer.setTitle(dto.getTitle());
        contactEmployer.setFirstName(dto.getFirstName());
        contactEmployer.setLastName(dto.getLastName());
        contactEmployer.setPosition(dto.getPosition());
        contactEmployer.setOrganisation(dto.getOrganisation());
        contactEmployer.setAddress(dto.getAddress());
    }

    private void updateBodyFromDTO(CoverLetterBody body, CoverLetterBodyDTO dto) {
        body.setBody(dto.getBody());
    }



    private CoverLetterContactUser convertToEntity(CoverLetterContactUserDTO dto) {
        CoverLetterContactUser entity = new CoverLetterContactUser();
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setStatus(dto.getStatus());
        entity.setAddress(dto.getAddress());
        entity.setCity(dto.getCity());
        entity.setPostalCode(dto.getPostalCode());
        entity.setPhone(dto.getPhone());
        entity.setEmail(dto.getEmail());
        return entity;
    }

    private CoverLetterContactEmployer convertToEntity(CoverLetterContactEmployerDTO dto) {
        CoverLetterContactEmployer entity = new CoverLetterContactEmployer();
        entity.setTitle(dto.getTitle());
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setPosition(dto.getPosition());
        entity.setOrganisation(dto.getOrganisation());
        entity.setAddress(dto.getAddress());
        return entity;
    }

    private CoverLetterBody convertToEntity(CoverLetterBodyDTO dto) {
        CoverLetterBody entity = new CoverLetterBody();
        entity.setBody(dto.getBody());
        return entity;
    }

    public List<CoverLetterDTO> getAllCoverLettersByUserId(Integer userId) {
        List<CoverLetter> coverLetters = coverLetterRepository.findAllByUserId(userId);
        return coverLetters.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CoverLetterDTO convertToDTO(CoverLetter coverLetter) {
        CoverLetterDTO dto = new CoverLetterDTO();
        dto.setId(coverLetter.getId());
        dto.setTemplateId(coverLetter.getTemplateId());
        dto.setTemplateId(coverLetter.getTemplateId());
        dto.setContactUser(convertContactUser(coverLetter.getCoverLetterContactUser()));
        dto.setContactEmployer(convertContactEmployer(coverLetter.getCoverLetterContactEmployer()));
        dto.setBody(convertBody(coverLetter.getCoverLetterBody()));
        return dto;
    }

    private CoverLetterContactUserDTO convertContactUser(CoverLetterContactUser contactUser) {
        if (contactUser == null) {
            return null;
        }
        CoverLetterContactUserDTO dto = new CoverLetterContactUserDTO();
        dto.setFirstName(contactUser.getFirstName());
        dto.setLastName(contactUser.getLastName());
        dto.setStatus(contactUser.getStatus());
        dto.setAddress(contactUser.getAddress());
        dto.setCity(contactUser.getCity());
        dto.setPostalCode(contactUser.getPostalCode());
        dto.setPhone(contactUser.getPhone());
        dto.setEmail(contactUser.getEmail());
        return dto;
    }

    private CoverLetterContactEmployerDTO convertContactEmployer(CoverLetterContactEmployer contactEmployer) {
        if (contactEmployer == null) {
            return null;
        }
        CoverLetterContactEmployerDTO dto = new CoverLetterContactEmployerDTO();
        dto.setTitle(contactEmployer.getTitle());
        dto.setFirstName(contactEmployer.getFirstName());
        dto.setLastName(contactEmployer.getLastName());
        dto.setPosition(contactEmployer.getPosition());
        dto.setOrganisation(contactEmployer.getOrganisation());
        dto.setAddress(contactEmployer.getAddress());
        return dto;
    }

    private CoverLetterBodyDTO convertBody(CoverLetterBody body) {
        if (body == null) {
            return null;
        }
        CoverLetterBodyDTO dto = new CoverLetterBodyDTO();
        dto.setBody(body.getBody());
        return dto;
    }








}
