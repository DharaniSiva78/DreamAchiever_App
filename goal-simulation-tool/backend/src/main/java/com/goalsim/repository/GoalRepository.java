package com.goalsim.repository;

import com.goalsim.model.Goal;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface GoalRepository extends MongoRepository<Goal, String> {
    List<Goal> findByUserId(String userId);
    List<Goal> findByUserIdAndStatus(String userId, Goal.GoalStatus status);
}