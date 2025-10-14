package com.goalsim.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public Map<String, Object> handleError() {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", 404);
        errorResponse.put("message", "Endpoint not found. Available endpoints: /api/auth, /api/users, /api/goals, /api/simulations");
        errorResponse.put("timestamp", java.time.LocalDateTime.now().toString());
        return errorResponse;
    }
}