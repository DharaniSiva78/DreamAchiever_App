package com.goalsim.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, String> home() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "GoalSim Backend API is running!");
        response.put("status", "active");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }

    @GetMapping("/api")
    public Map<String, String> apiInfo() {
        Map<String, String> response = new HashMap<>();
        response.put("name", "GoalSim API");
        response.put("version", "1.0.0");
        response.put("description", "Interactive Goal Simulation Tool Backend");
        response.put("endpoints", "/api/auth, /api/users, /api/goals, /api/simulations");
        return response;
    }
}