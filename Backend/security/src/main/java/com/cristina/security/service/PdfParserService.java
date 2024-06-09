package com.cristina.security.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PdfParserService {

    private static final Logger logger = LoggerFactory.getLogger(PdfParserService.class);

    public Map<String, String> parsePdf(MultipartFile file) throws IOException {
        Map<String, String> extractedData = new HashMap<>();
        PDDocument document = PDDocument.load(file.getInputStream());
        try {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            // Log the full text for debugging
            logger.info("Full extracted text: {}", text.substring(0, Math.min(text.length(), 500))); // Print first 500 characters to avoid too long logs

            // Extracția secțiunilor
            extractedData.put("Contact", extractAndLogSection(text, "Contact", "^(?:Contact Information|Contact)$", "^EDUCATION$"));
            extractedData.put("Education", extractAndLogSection(text, "Education", "^EDUCATION$", "^SKILLS$"));
            extractedData.put("Skills", extractAndLogSection(text, "Skills", "^SKILLS$", "^EXPERIENCE$"));
            extractedData.put("Experience", extractAndLogSection(text, "Experience", "^EXPERIENCE$", "^PROJECTS$"));
            extractedData.put("Projects", extractAndLogSection(text, "Projects", "^PROJECTS$", "^LANGUAGES$"));
            extractedData.put("Languages", extractAndLogSection(text, "Languages", "^LANGUAGES$", null)); // Dacă e ultima secțiune

            return extractedData;
        } finally {
            document.close();
        }
    }

    private String extractAndLogSection(String text, String sectionName, String startRegex, String endRegex) {
        String section = extractSection(text, startRegex, endRegex);
        // Log the extracted section
        logger.info("{} section extracted: {}", sectionName, section.substring(0, Math.min(section.length(), 500))); // Print first 500 characters
        return section;
    }

    private String extractSection(String text, String startRegex, String endRegex) {
        Pattern startPattern = Pattern.compile(startRegex, Pattern.MULTILINE | Pattern.CASE_INSENSITIVE);
        Pattern endPattern = endRegex != null ? Pattern.compile(endRegex, Pattern.MULTILINE | Pattern.CASE_INSENSITIVE) : null;

        Matcher startMatcher = startPattern.matcher(text);
        if (startMatcher.find()) {
            int start = startMatcher.end();
            if (endPattern != null) {
                Matcher endMatcher = endPattern.matcher(text);
                if (endMatcher.find(start)) {
                    return text.substring(start, endMatcher.start()).trim();
                }
            }
            return text.substring(start).trim();
        }
        return "Section not found";
    }
}
