package com.example.RC_Backend.Services;

import com.example.RC_Backend.DTO.API;
import com.example.RC_Backend.DTO.LoggedUser;
import com.example.RC_Backend.DTO.LoginForm;
import com.example.RC_Backend.DTO.RegisterForm;
import com.example.RC_Backend.Models.Settings;
import com.example.RC_Backend.Models.User;
import com.example.RC_Backend.Repositories.SettingsRepository;
import com.example.RC_Backend.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthenticationService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JWTService jwtService;
    @Autowired
    private SettingsRepository settingsRepository;

    public ResponseEntity<?> login(LoginForm user) {
        Optional<User> loginUser = userRepository.findByEmail(user.getEmail());
        if(loginUser.isPresent()) {
            try {
                Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
                if(authentication.isAuthenticated()) {
                    LoggedUser loggedUser = LoggedUser.builder()
                            .email(loginUser.get().getEmail())
                            .firstname(loginUser.get().getFirstname())
                            .lastname(loginUser.get().getLastname())
                            .jwt(jwtService.generateToken(loginUser.get()))
                            .settings(loginUser.get().getSettings())
                            .build();
                    return ResponseEntity.ok(loggedUser);
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new API("Email-ul sau parola sunt gresite!"));
                }
            } catch (AuthenticationException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new API("Email-ul sau parola sunt gresite!"));
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new API("Email-ul sau parola sunt gresite!"));
        }
    }

    public ResponseEntity<?> register(RegisterForm user) {
        if(!userRepository.existsByEmail(user.getEmail())) {
            User userToSave = new User();
            userToSave.setEmail(user.getEmail());
            userToSave.setPassword(passwordEncoder.encode(user.getPassword()));
            userToSave.setFirstname(user.getFirstname());
            userToSave.setLastname(user.getLastname());
            userToSave.setCreatedOn(LocalDateTime.now());
            userToSave = userRepository.saveAndFlush(userToSave);
            Settings settings = new Settings();
            settings.setUser(userToSave);
            settings = settingsRepository.saveAndFlush(settings);
            userToSave.setSettings(settings);
            userRepository.save(userToSave);
            return ResponseEntity.ok(new API("Contul a fost creat cu succes!"));
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new API("Acest email este deja folosit!"));
        }
    }
}
