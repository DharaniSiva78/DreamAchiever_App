package com.goalsim.controller;

import com.goalsim.model.Goal;
import com.goalsim.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/goals")
public class GoalController {
    
    private final GoalService goalService;
    
    @Autowired
    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }
    
    @PostMapping
    public ResponseEntity<Goal> createGoal(@RequestBody Goal goal) {
        Goal createdGoal = goalService.createGoal(goal);
        return ResponseEntity.ok(createdGoal);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Goal>> getUserGoals(@PathVariable String userId) {
        List<Goal> goals = goalService.getUserGoals(userId);
        return ResponseEntity.ok(goals);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Goal> getGoalById(@PathVariable String id) {
        Optional<Goal> goal = goalService.getGoalById(id);
        return goal.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Goal> updateGoal(@PathVariable String id, @RequestBody Goal goalDetails) {
        try {
            Goal updatedGoal = goalService.updateGoal(id, goalDetails);
            return ResponseEntity.ok(updatedGoal);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/progress")
    public ResponseEntity<Goal> updateProgress(@PathVariable String id, @RequestBody Map<String, Double> progress) {
        try {
            Double progressToAdd = progress.get("progress");
            Goal updatedGoal = goalService.updateProgress(id, progressToAdd);
            return ResponseEntity.ok(updatedGoal);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/user/{userId}/completed-count")
    public ResponseEntity<Integer> getCompletedGoalsCount(@PathVariable String userId) {
        int count = goalService.getCompletedGoalsCount(userId);
        return ResponseEntity.ok(count);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable String id) {
        goalService.deleteGoal(id);
        return ResponseEntity.ok().build();
    }
}