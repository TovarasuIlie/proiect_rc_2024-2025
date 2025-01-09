package com.example.RC_Backend.Services;

import com.example.RC_Backend.DTO.SettingsDTO;
import com.example.RC_Backend.Models.Settings;
import com.example.RC_Backend.Models.User;
import com.example.RC_Backend.Repositories.SettingsRepository;
import com.example.RC_Backend.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Optional;

@Service
public class SettingsService {
    @Autowired
    private SettingsRepository settingsRepository;
    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<?> setSetting(SettingsDTO settingsDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> you = userRepository.findByEmail(authentication.getName());
        Settings settings = settingsRepository.findByUser(you.get());
        settings.setThreshold(settingsDTO.getThreshold());
        settings.setDesiredTemperature(settingsDTO.getDesiredTemperature());
        settingsRepository.save(settings);
        sendSettings(settings.getDesiredTemperature(), settings.getThreshold());
        return ResponseEntity.ok(settings);
    }

    public ResponseEntity<?> testingFan(boolean status) {
        sendTurnOnSignal(status);
        return ResponseEntity.ok().build();
    }

    private void sendSettings(Integer temperature, Integer threshold) {
        RestTemplate restTemplate = new RestTemplate();

        String uri = "http://192.168.10.3:80/set-temperature?temperature=" + temperature + "&threshold=" + threshold; // or any other uri

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.add("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36");

        HttpEntity<String> entity = new HttpEntity<>("parameters", headers);
        restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);
    }

    private void sendTurnOnSignal(boolean status) {
        RestTemplate restTemplate = new RestTemplate();

        String uri = "http://192.168.10.3:80/testing-fan?fanStatus=" + status; // or any other uri

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.add("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36");

        HttpEntity<String> entity = new HttpEntity<>("parameters", headers);
        restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);
    }
}
