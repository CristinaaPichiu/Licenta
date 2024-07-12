package com.cristina.security.service;

import com.cristina.security.email.PdfEmailRequest;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class PdfEmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public PdfEmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public String sendPdfEmail(PdfEmailRequest request) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("cristinapichiu38@gmail.com");
            helper.setTo(request.getRecipient());
            helper.setSubject(request.getSubject());
            helper.setText(request.getMessageBody(), true);

            if (request.getAttachmentPath() != null && !request.getAttachmentPath().isEmpty()) {
                FileSystemResource file = new FileSystemResource(new File(request.getAttachmentPath()));
                helper.addAttachment("attachment.pdf", file);
            }

            mailSender.send(message);
            return "Email with PDF sent successfully";
        } catch (Exception e) {
            return "Failed to send email with PDF: " + e.getMessage();
        }
    }
}
