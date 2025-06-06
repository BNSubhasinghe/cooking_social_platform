package Backend.Repository;

import Backend.Model.FoodLog;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface FoodLogRepository extends MongoRepository<FoodLog, String> {
    List<FoodLog> findByUserIdAndDate(String userId, LocalDate date);

    List<FoodLog> findByUserIdAndDateBetween(String userId, LocalDate startDate, LocalDate endDate);
}