package com.cristina.security.controller;

import com.cristina.security.models.TextRequest;
import com.cristina.security.service.LanguageToolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LanguageToolController {

    private final LanguageToolService languageToolService;

    @Autowired  // Injectare prin constructor
    public LanguageToolController(LanguageToolService languageToolService) {
        this.languageToolService = languageToolService;
    }

    @PostMapping("/checkText")
    public String checkText(@RequestBody TextRequest request) {
        return languageToolService.checkText(request.getText());
    }
}
