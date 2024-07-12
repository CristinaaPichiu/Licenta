package com.cristina.security.email;

public class PdfEmailRequest {
    private String recipient;
    private String subject;
    private String messageBody;
    private String attachmentPath;

    public PdfEmailRequest(String recipient, String subject, String messageBody, String attachmentPath) {
        this.recipient = recipient;
        this.subject = subject;
        this.messageBody = messageBody;
        this.attachmentPath = attachmentPath;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessageBody() {
        return messageBody;
    }

    public void setMessageBody(String messageBody) {
        this.messageBody = messageBody;
    }

    public String getAttachmentPath() {
        return attachmentPath;
    }

    public void setAttachmentPath(String attachmentPath) {
        this.attachmentPath = attachmentPath;
    }
}
