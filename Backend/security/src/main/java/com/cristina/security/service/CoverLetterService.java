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
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new RuntimeException("User not found with email: " + email));

        CoverLetter coverLetter = new CoverLetter();
        coverLetter.setId(UUID.randomUUID());
        coverLetter.setUser(user);

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
        Pageable topOne = PageRequest.of(0, 1); // Fetch only the first result
        List<CoverLetter> coverLetters = coverLetterRepository.findLatestByUserId(userId, topOne);
        if (coverLetters.isEmpty()) {
            return Optional.empty();
        } else {
            CoverLetter latestCoverLetter = coverLetters.get(0);
            System.out.println("Found cover letter ID: " + latestCoverLetter.getId());
            return Optional.of(latestCoverLetter);
        }
    }

    public CoverLetter updateCoverLetter(UUID coverLetterId, CoverLetterDTO coverLetterDTO) throws Exception {
        logger.info("Updating cover letter with ID: {}", coverLetterId);

        CoverLetter coverLetter = coverLetterRepository.findById(coverLetterId)
                .orElseThrow(() -> new Exception("Cover letter not found with id: " + coverLetterId));

        // Log existing cover letter
        logger.info("Existing cover letter: {}", coverLetter);

        // Transformăm DTO-urile în entități
        CoverLetterContactUser contactUser = convertToEntity(coverLetterDTO.getContactUser());
        CoverLetterContactEmployer contactEmployer = convertToEntity(coverLetterDTO.getContactEmployer());
        CoverLetterBody body = convertToEntity(coverLetterDTO.getBody());

        // Log DTOs
        logger.info("DTOs: ContactUser - {}, ContactEmployer - {}, Body - {}", contactUser, contactEmployer, body);

        // Verificăm utilizatorul asociat cu contactUser, contactEmployer și body
        User user = coverLetter.getUser();
        contactUser.setUser(user);
        contactEmployer.setUser(user);
        body.setUser(user);

        // Actualizăm câmpurile scrisorii de intenție
        coverLetter.setCoverLetterContactUser(contactUser);
        coverLetter.setCoverLetterContactEmployer(contactEmployer);
        coverLetter.setCoverLetterBody(body);

        return coverLetterRepository.save(coverLetter);
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
}
