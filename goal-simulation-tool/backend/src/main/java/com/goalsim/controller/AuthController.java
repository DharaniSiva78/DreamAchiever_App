package com.goalsim.controller;

import com.goalsim.model.User;
import com.goalsim.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final UserService userService;
    
    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");
            
            if (email == null || password == null) {
                return ResponseEntity.badRequest().body("Email and password are required");
            }
            
            Optional<User> userOpt = userService.getUserByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid email or password");
            }
            
            User user = userOpt.get();
            if (!userService.validatePassword(password, user.getPassword())) {
                return ResponseEntity.badRequest().body("Invalid email or password");
            }
            
            // Remove password from response
            user.setPassword(null);
            
            // Generate simple token (in production, use JWT)
            String token = UUID.randomUUID().toString();
            
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("token", token);
            response.put("message", "Login successful");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Login failed: " + e.getMessage());
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            if (user.getEmail() == null || user.getPassword() == null || user.getUsername() == null) {
                return ResponseEntity.badRequest().body("Email, password, and username are required");
            }
            
            if (userService.emailExists(user.getEmail())) {
                return ResponseEntity.badRequest().body("Email already exists");
            }
            
            User createdUser = userService.createUser(user);
            
            // Remove password from response
            createdUser.setPassword(null);
            
            // Generate token
            String token = UUID.randomUUID().toString();
            
            Map<String, Object> response = new HashMap<>();
            response.put("user", createdUser);
            response.put("token", token);
            response.put("message", "Registration successful");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Registration failed: " + e.getMessage());
        }
    }
}