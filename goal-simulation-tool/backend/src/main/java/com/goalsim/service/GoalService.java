package com.goalsim.service;

import com.goalsim.model.Goal;
import com.goalsim.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class GoalService {
    
    private final GoalRepository goalRepository;
    
    @Autowired
    public GoalService(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }
    
    public Goal createGoal(Goal goal) {
        if (goal.getStartDate() == null) {
            goal.setStartDate(LocalDate.now());
        }
        if (goal.getStatus() == null) {
            goal.setStatus(Goal.GoalStatus.ACTIVE);
        }
        if (goal.getCurrentValue() == null) {
            goal.setCurrentValue(0.0);
        }
        if (goal.getProgressType() == null) {
            goal.setProgressType(Goal.ProgressType.WEEKLY);
        }
        goal.setLastProgressUpdate(LocalDateTime.now());
        goal.setWeeklyProgress(0.0);
        goal.setMonthlyProgress(0.0);
        
        return goalRepository.save(goal);
    }
    
    public List<Goal> getUserGoals(String userId) {
        return goalRepository.findByUserId(userId);
    }
    
    public Optional<Goal> getGoalById(String id) {
        return goalRepository.findById(id);
    }
    
    public Goal updateGoal(String id, Goal goalDetails) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        
        if (goalDetails.getTitle() != null) goal.setTitle(goalDetails.getTitle());
        if (goalDetails.getDescription() != null) goal.setDescription(goalDetails.getDescription());
        if (goalDetails.getTargetValue() != null) goal.setTargetValue(goalDetails.getTargetValue());
        if (goalDetails.getCurrentValue() != null) {
            goal.setCurrentValue(goalDetails.getCurrentValue());
            // Auto-update status if target is reached
            if (goal.getCurrentValue() >= goal.getTargetValue()) {
                goal.setStatus(Goal.GoalStatus.COMPLETED);
            }
        }
        if (goalDetails.getTargetDate() != null) goal.setTargetDate(goalDetails.getTargetDate());
        if (goalDetails.getStatus() != null) goal.setStatus(goalDetails.getStatus());
        if (goalDetails.getType() != null) goal.setType(goalDetails.getType());
        if (goalDetails.getProgressType() != null) goal.setProgressType(goalDetails.getProgressType());
        
        goal.setLastProgressUpdate(LocalDateTime.now());
        
        return goalRepository.save(goal);
    }
    
    public Goal updateProgress(String id, Double progressToAdd) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        
        double newValue = (goal.getCurrentValue() != null ? goal.getCurrentValue() : 0.0) + progressToAdd;
        goal.setCurrentValue(newValue);
        
        // Update weekly and monthly progress
        updateProgressMetrics(goal, progressToAdd);
        
        // Auto-complete if target reached
        if (newValue >= goal.getTargetValue()) {
            goal.setStatus(Goal.GoalStatus.COMPLETED);
        }
        
        goal.setLastProgressUpdate(LocalDateTime.now());
        return goalRepository.save(goal);
    }
    
    private void updateProgressMetrics(Goal goal, Double progress) {
        // Update weekly progress
        if (goal.getWeeklyProgress() == null) goal.setWeeklyProgress(0.0);
        goal.setWeeklyProgress(goal.getWeeklyProgress() + progress);
        
        // Update monthly progress
        if (goal.getMonthlyProgress() == null) goal.setMonthlyProgress(0.0);
        goal.setMonthlyProgress(goal.getMonthlyProgress() + progress);
    }
    
    public void deleteGoal(String id) {
        goalRepository.deleteById(id);
    }
    
    public int getCompletedGoalsCount(String userId) {
        List<Goal> goals = goalRepository.findByUserId(userId);
        return (int) goals.stream()
                .filter(goal -> goal.getStatus() == Goal.GoalStatus.COMPLETED)
                .count();
    }
}