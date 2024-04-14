package com.cristina.security.auth;

import com.cristina.security.config.JwtService;
import com.cristina.security.email.EmailDetails;
import com.cristina.security.user.Role;
import com.cristina.security.user.User;
import com.cristina.security.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.cristina.security.email.EmailService;


@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private static final Logger LOGGER = LoggerFactory.getLogger(EmailService.class);


    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        repository.save(user);


        var jwtToken = jwtService.generateToken(user);

        try {
            EmailDetails emailDetails = new EmailDetails();
            emailDetails.setRecipient(user.getEmail());
            String messageBody = "<div style='font-family: Arial, sans-serif; color: #333;'>"
                    + "<p>Dear user,</p>"
                    + "<p>Welcome to <strong>SkillMap</strong>!</p>"
                    + "<p>We're excited to have you join our community of talented individuals. "
                    + "<strong>SkillMap</strong> is your platform to showcase your unique skills "
                    + "and talents in a digital portfolio format.</p>"
                    + "<p>Don't hesitate to reach out if you have any questions or need assistance. "
                    + "Our team is dedicated to providing you with the best possible experience on <strong>SkillMap</strong>.</p>"
                    + "<p>Best regards,<br>The SkillMap Team</p>"
                    + "</div>";
            emailDetails.setMsgBody(messageBody);
            emailDetails.setSubject("Welcome email");
            emailDetails.setAttachment("C:/Users/Hp/Desktop/logo.png");
            String emailStatus = emailService.sendMailWithAttachment(emailDetails);
            LOGGER.info("E-mail status: {}", emailStatus);
        } catch (Exception e) {
            LOGGER.error("Eroare la trimiterea e-mailului: {}", e.getMessage());
        }



        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);



        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}
