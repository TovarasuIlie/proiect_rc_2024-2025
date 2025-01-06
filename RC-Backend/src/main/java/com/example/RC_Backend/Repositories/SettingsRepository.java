package com.example.RC_Backend.Repositories;

import com.example.RC_Backend.Models.Settings;
import com.example.RC_Backend.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SettingsRepository extends JpaRepository<Settings, User> {
    Settings findByUser(User user);
}
