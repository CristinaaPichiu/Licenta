package com.cristina.security.email;

// Importing required classes
import com.cristina.security.email.EmailDetails;
import com.cristina.security.email.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Annotation
@RestController
@RequestMapping("/api/v1/email")
@RequiredArgsConstructor
// Class
public class EmailController {

    @Autowired private EmailService emailService;

    // Sending a simple Email

    @PostMapping("/sendWith")
    public String sendMailWithAttachment(
            @RequestBody EmailDetails details)
    {
        String status
                = emailService.sendMailWithAttachment(details);

        return status;
    }


}
