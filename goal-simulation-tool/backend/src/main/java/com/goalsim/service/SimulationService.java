package com.goalsim.service;

import com.goalsim.model.Goal;
import com.goalsim.model.Simulation;
import com.goalsim.repository.GoalRepository;
import com.goalsim.repository.SimulationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SimulationService {
    
    private final SimulationRepository simulationRepository;
    private final GoalRepository goalRepository;
    
    @Autowired
    public SimulationService(SimulationRepository simulationRepository, GoalRepository goalRepository) {
        this.simulationRepository = simulationRepository;
        this.goalRepository = goalRepository;
    }
    
    public Simulation runSimulation(String goalId, Map<String, Object> parameters) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        
        Simulation simulation = new Simulation();
        simulation.setGoalId(goalId);
        simulation.setUserId(goal.getUserId());
        simulation.setParameters(parameters);
        simulation.setCreatedAt(LocalDateTime.now());
        simulation.setScenarioName((String) parameters.getOrDefault("scenarioName", "Default Scenario"));
        
        Map<String, Object> results = runSimulationLogic(goal, parameters);
        simulation.setResults(results);
        
        return simulationRepository.save(simulation);
    }
    
    private Map<String, Object> runSimulationLogic(Goal goal, Map<String, Object> parameters) {
        switch (goal.getType()) {
            case FINANCIAL:
                return runFinancialSimulation(goal, parameters);
            case HEALTH:
                return runHealthSimulation(goal, parameters);
            case CAREER:
                return runCareerSimulation(goal, parameters);
            case PERSONAL_DEVELOPMENT:
                return runPersonalDevelopmentSimulation(goal, parameters);
            default:
                throw new RuntimeException("Unsupported goal type: " + goal.getType());
        }
    }
    
    private Map<String, Object> runFinancialSimulation(Goal goal, Map<String, Object> parameters) {
        double monthlyContribution = getDoubleParameter(parameters, "monthlyContribution", 500.0);
        double interestRate = getDoubleParameter(parameters, "interestRate", 5.0);
        double additionalIncome = getDoubleParameter(parameters, "additionalIncome", 0.0);
        double targetAmount = goal.getTargetValue();
        double currentAmount = goal.getCurrentValue() != null ? goal.getCurrentValue() : 0.0;
        
        double monthlyRate = interestRate / 100 / 12;
        double totalMonthlyContribution = monthlyContribution + additionalIncome;
        
        int months = 0;
        double balance = currentAmount;
        List<Map<String, Object>> progressData = new ArrayList<>();
        
        while (balance < targetAmount && months < 600) {
            balance = balance * (1 + monthlyRate) + totalMonthlyContribution;
            months++;
            
            if (months % 12 == 0 || balance >= targetAmount) {
                Map<String, Object> progressPoint = new HashMap<>();
                progressPoint.put("month", months);
                progressPoint.put("balance", Math.round(balance * 100.0) / 100.0);
                progressPoint.put("contributions", totalMonthlyContribution * months);
                progressPoint.put("interestEarned", balance - (currentAmount + totalMonthlyContribution * months));
                progressData.add(progressPoint);
            }
        }
        
        Map<String, Object> results = new HashMap<>();
        results.put("monthsToComplete", months);
        results.put("completionDate", LocalDate.now().plusMonths(months).toString());
        results.put("totalContributions", Math.round(totalMonthlyContribution * months * 100.0) / 100.0);
        results.put("finalBalance", Math.round(balance * 100.0) / 100.0);
        results.put("totalInterest", Math.round((balance - (currentAmount + totalMonthlyContribution * months)) * 100.0) / 100.0);
        results.put("progressData", progressData);
        
        return results;
    }
    
    private Map<String, Object> runHealthSimulation(Goal goal, Map<String, Object> parameters) {
        double currentWeight = getDoubleParameter(parameters, "currentWeight", 180.0);
        double targetWeight = goal.getTargetValue();
        double weeklyLoss = getDoubleParameter(parameters, "weeklyLoss", 0.5);
        double exerciseDays = getDoubleParameter(parameters, "exerciseDays", 3.0);
        double calorieDeficit = getDoubleParameter(parameters, "calorieDeficit", 500.0);
        
        double weightToLose = currentWeight - targetWeight;
        int weeks = (int) Math.ceil(weightToLose / weeklyLoss);
        
        List<Map<String, Object>> progressData = new ArrayList<>();
        double currentProgressWeight = currentWeight;
        
        for (int week = 0; week <= weeks; week++) {
            if (week % 4 == 0 || week == weeks) {
                Map<String, Object> progressPoint = new HashMap<>();
                progressPoint.put("week", week);
                progressPoint.put("weight", Math.round(currentProgressWeight * 10.0) / 10.0);
                progressPoint.put("totalLoss", Math.round((currentWeight - currentProgressWeight) * 10.0) / 10.0);
                progressData.add(progressPoint);
            }
            currentProgressWeight = Math.max(targetWeight, currentProgressWeight - weeklyLoss);
        }
        
        Map<String, Object> results = new HashMap<>();
        results.put("weeksToComplete", weeks);
        results.put("completionDate", LocalDate.now().plusWeeks(weeks).toString());
        results.put("progressData", progressData);
        results.put("dailyCalorieTarget", 2000 - calorieDeficit);
        results.put("recommendedExercise", exerciseDays + " days per week");
        
        return results;
    }
    
    private Map<String, Object> runCareerSimulation(Goal goal, Map<String, Object> parameters) {
        double currentSalary = getDoubleParameter(parameters, "currentSalary", 60000.0);
        double targetSalary = goal.getTargetValue();
        double annualIncrease = getDoubleParameter(parameters, "annualIncrease", 8.0);
        double extraHours = getDoubleParameter(parameters, "extraHours", 5.0);
        double skillDevelopment = getDoubleParameter(parameters, "skillDevelopment", 10.0);
        
        int years = 0;
        double projectedSalary = currentSalary;
        List<Map<String, Object>> progressData = new ArrayList<>();
        
        while (projectedSalary < targetSalary && years < 20) {
            double bonusEffect = extraHours * 0.01;
            double skillEffect = skillDevelopment * 0.015;
            double totalIncrease = annualIncrease + bonusEffect + skillEffect;
            
            projectedSalary = projectedSalary * (1 + totalIncrease / 100);
            years++;
            
            Map<String, Object> progressPoint = new HashMap<>();
            progressPoint.put("year", years);
            progressPoint.put("salary", Math.round(projectedSalary));
            progressPoint.put("totalGrowth", Math.round(projectedSalary - currentSalary));
            progressPoint.put("growthRate", Math.round(totalIncrease * 10.0) / 10.0);
            progressData.add(progressPoint);
        }
        
        Map<String, Object> results = new HashMap<>();
        results.put("yearsToComplete", years);
        results.put("completionDate", LocalDate.now().plusYears(years).toString());
        results.put("progressData", progressData);
        results.put("finalSalary", Math.round(projectedSalary));
        results.put("totalGrowth", Math.round(projectedSalary - currentSalary));
        
        return results;
    }
    
    private Map<String, Object> runPersonalDevelopmentSimulation(Goal goal, Map<String, Object> parameters) {
        double currentSkill = getDoubleParameter(parameters, "currentSkill", 3.0);
        double targetSkill = goal.getTargetValue();
        double weeklyPractice = getDoubleParameter(parameters, "weeklyPractice", 5.0);
        double learningEfficiency = getDoubleParameter(parameters, "learningEfficiency", 7.0);
        
        double skillGap = targetSkill - currentSkill;
        double weeklyProgress = weeklyPractice * (learningEfficiency / 10.0) * 0.2;
        
        int weeks = (int) Math.ceil(skillGap / weeklyProgress);
        List<Map<String, Object>> progressData = new ArrayList<>();
        double currentProgressSkill = currentSkill;
        
        for (int week = 0; week <= weeks; week++) {
            if (week % 4 == 0 || week == weeks) {
                Map<String, Object> progressPoint = new HashMap<>();
                progressPoint.put("week", week);
                progressPoint.put("skillLevel", Math.round(currentProgressSkill * 10.0) / 10.0);
                progressPoint.put("progress", Math.round((currentProgressSkill - currentSkill) * 10.0) / 10.0);
                progressData.add(progressPoint);
            }
            currentProgressSkill = Math.min(targetSkill, currentProgressSkill + weeklyProgress);
        }
        
        Map<String, Object> results = new HashMap<>();
        results.put("weeksToComplete", weeks);
        results.put("completionDate", LocalDate.now().plusWeeks(weeks).toString());
        results.put("progressData", progressData);
        results.put("recommendedPractice", weeklyPractice + " hours per week");
        results.put("estimatedMastery", weeks <= 26 ? "Beginner to Intermediate" : "Intermediate to Advanced");
        
        return results;
    }
    
    private double getDoubleParameter(Map<String, Object> parameters, String key, double defaultValue) {
        Object value = parameters.get(key);
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        return defaultValue;
    }
    
    public List<Simulation> getSimulationsByGoal(String goalId) {
        Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        return simulationRepository.findByGoalIdAndUserId(goalId, goal.getUserId());
    }
    
    public List<Simulation> getUserSimulations(String userId) {
        return simulationRepository.findByUserId(userId);
    }
}