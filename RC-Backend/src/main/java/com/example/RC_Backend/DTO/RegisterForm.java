package com.example.RC_Backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegisterForm {
    private String email;
    private String firstname;
    private String lastname;
    private String password;
}
