package com.example.RC_Backend.Controller;

import com.example.RC_Backend.DTO.LoginForm;
import com.example.RC_Backend.DTO.RegisterForm;
import com.example.RC_Backend.Services.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/Authentication")
@CrossOrigin
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("login-account")
    public ResponseEntity<?> loginAccount(@RequestBody LoginForm user) {
        return authenticationService.login(user);
    }

    @PostMapping("register-account")
    public ResponseEntity<?> registerAccount(@RequestBody RegisterForm user) {
        return authenticationService.register(user);
    }
}
