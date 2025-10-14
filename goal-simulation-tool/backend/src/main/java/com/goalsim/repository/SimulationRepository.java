package com.goalsim.repository;

import com.goalsim.model.Simulation;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SimulationRepository extends MongoRepository<Simulation, String> {
    List<Simulation> findByGoalIdAndUserId(String goalId, String userId);
    List<Simulation> findByUserId(String userId);
}