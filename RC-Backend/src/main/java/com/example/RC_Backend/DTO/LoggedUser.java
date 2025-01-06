package com.example.RC_Backend.DTO;

import com.example.RC_Backend.Models.Settings;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class LoggedUser {
    private String email;
    private String firstname;
    private String lastname;
    private String jwt;
    private Settings settings;
}
