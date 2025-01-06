package com.example.RC_Backend.Controller;

import com.example.RC_Backend.DTO.SettingsDTO;
import com.example.RC_Backend.Services.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/Settings")
@CrossOrigin
public class SettingsController {

    @Autowired
    private SettingsService settingsService;

    @PostMapping("set-settings")
    public ResponseEntity<?> setSettings(@RequestBody SettingsDTO settingsDTO) {
        return settingsService.setSetting(settingsDTO);
    }

    @GetMapping("testing-fan/{status}")
    public ResponseEntity<?> setSettings(@PathVariable boolean status) {
        return settingsService.testingFan(status);
    }
}
