package com.goalsim.controller;

import com.goalsim.model.Simulation;
import com.goalsim.service.SimulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/simulations")
public class SimulationController {
    
    private final SimulationService simulationService;
    
    @Autowired
    public SimulationController(SimulationService simulationService) {
        this.simulationService = simulationService;
    }
    
    @PostMapping("/run/{goalId}")
    public ResponseEntity<Simulation> runSimulation(
            @PathVariable String goalId,
            @RequestBody Map<String, Object> parameters) {
        try {
            Simulation simulation = simulationService.runSimulation(goalId, parameters);
            return ResponseEntity.ok(simulation);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/goal/{goalId}")
    public ResponseEntity<List<Simulation>> getGoalSimulations(@PathVariable String goalId) {
        List<Simulation> simulations = simulationService.getSimulationsByGoal(goalId);
        return ResponseEntity.ok(simulations);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Simulation>> getUserSimulations(@PathVariable String userId) {
        List<Simulation> simulations = simulationService.getUserSimulations(userId);
        return ResponseEntity.ok(simulations);
    }
}