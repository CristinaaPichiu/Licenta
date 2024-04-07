package com.cristina.security.email;

// Java Program to Illustrate Creation Of
// Service implementation class


// Importing required classes
import com.cristina.security.email.EmailDetails;
import java.io.File;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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

    // Metoda pentru a trimite un email simplu
    public String sendSimpleMail(EmailDetails details) {
        try {
            // Crearea unui mesaj de email simplu
            SimpleMailMessage mailMessage = new SimpleMailMessage();

            // Setarea detaliilor necesare
            mailMessage.setFrom(sender);
            mailMessage.setTo(details.getRecipient());
            mailMessage.setText(details.getMsgBody());
            mailMessage.setSubject(details.getSubject());

            // Trimiterea emailului
            javaMailSender.send(mailMessage);

            // Returnarea unui mesaj de succes în caz de trimitere reușită
            return "Mail sent successfully!";
        } catch (Exception e) {
            // Înregistrarea detaliilor excepției
            e.printStackTrace();

            // Returnarea unui mesaj de eroare în caz de excepție
            return "Error while sending mail: " + e.getMessage();
        }
    }

    
}
