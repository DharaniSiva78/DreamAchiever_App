package com.goalsim.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "goals")
public class Goal {
    @Id
    private String id;
    private String userId;
    private String title;
    private String description;
    private GoalType type;
    private Double targetValue;
    private Double currentValue;
    private LocalDate startDate;
    private LocalDate targetDate;
    private Map<String, Object> constraints;
    private GoalStatus status;
    private ProgressType progressType;
    private LocalDateTime lastProgressUpdate;
    private Double weeklyProgress;
    private Double monthlyProgress;
    
    public enum GoalType {
        FINANCIAL, HEALTH, CAREER, PERSONAL_DEVELOPMENT
    }
    
    public enum GoalStatus {
        ACTIVE, COMPLETED, CANCELLED
    }
    
    public enum ProgressType {
        DAILY, WEEKLY, MONTHLY
    }

    // Constructors
    public Goal() {}

    public Goal(String userId, String title, String description, GoalType type, 
                Double targetValue, Double currentValue, LocalDate targetDate) {
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.type = type;
        this.targetValue = targetValue;
        this.currentValue = currentValue;
        this.startDate = LocalDate.now();
        this.targetDate = targetDate;
        this.status = GoalStatus.ACTIVE;
        this.progressType = ProgressType.WEEKLY;
        this.lastProgressUpdate = LocalDateTime.now();
        this.weeklyProgress = 0.0;
        this.monthlyProgress = 0.0;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public GoalType getType() { return type; }
    public void setType(GoalType type) { this.type = type; }
    
    public Double getTargetValue() { return targetValue; }
    public void setTargetValue(Double targetValue) { this.targetValue = targetValue; }
    
    public Double getCurrentValue() { return currentValue; }
    public void setCurrentValue(Double currentValue) { this.currentValue = currentValue; }
    
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    
    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }
    
    public Map<String, Object> getConstraints() { return constraints; }
    public void setConstraints(Map<String, Object> constraints) { this.constraints = constraints; }
    
    public GoalStatus getStatus() { return status; }
    public void setStatus(GoalStatus status) { this.status = status; }
    
    public ProgressType getProgressType() { return progressType; }
    public void setProgressType(ProgressType progressType) { this.progressType = progressType; }
    
    public LocalDateTime getLastProgressUpdate() { return lastProgressUpdate; }
    public void setLastProgressUpdate(LocalDateTime lastProgressUpdate) { this.lastProgressUpdate = lastProgressUpdate; }
    
    public Double getWeeklyProgress() { return weeklyProgress; }
    public void setWeeklyProgress(Double weeklyProgress) { this.weeklyProgress = weeklyProgress; }
    
    public Double getMonthlyProgress() { return monthlyProgress; }
    public void setMonthlyProgress(Double monthlyProgress) { this.monthlyProgress = monthlyProgress; }
}