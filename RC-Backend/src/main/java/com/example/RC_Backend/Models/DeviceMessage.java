package com.example.RC_Backend.Models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DeviceMessage {
    private String deviceId;
    private Map<String, String> message;
    private String messageType;
}
