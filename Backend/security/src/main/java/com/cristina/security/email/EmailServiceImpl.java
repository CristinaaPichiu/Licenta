package com.cristina.security.email;

// Java Program to Illustrate Creation Of
// Service implementation class


// Importing required classes
import com.cristina.security.email.EmailDetails;
import java.io.File;
import java.io.UnsupportedEncodingException;
import javax.mail.MessagingException;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

// Annotation
@Service
// Class
// Implementing EmailService interface
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String sender;




    public String sendMailWithAttachment(EmailDetails details) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper;

        try {
            helper = new MimeMessageHelper(mimeMessage, true); // true pentru atașamente
            helper.setFrom(new InternetAddress(sender, "SkillMap Team"));
            helper.setTo(details.getRecipient());
            helper.setSubject(details.getSubject());
            helper.setText(details.getMsgBody(), true); // true pentru a interpreta string-ul ca HTML

            // Adăugarea atașamentului, dacă este prezent
            if (details.getAttachment() != null && !details.getAttachment().isEmpty()) {
                FileSystemResource file = new FileSystemResource(new File(details.getAttachment()));
                helper.addAttachment(file.getFilename(), file);
            }

            // Trimiterea e-mailului
            javaMailSender.send(mimeMessage);
            return "Mail sent Successfully";
        } catch (jakarta.mail.MessagingException e) {
            // Logarea și returnarea mesajului de eroare
            e.printStackTrace();
            return "Error while sending mail: " + e.getMessage();
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }
}
