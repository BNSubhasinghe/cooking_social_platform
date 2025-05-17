package Backend.Repository;

import Backend.Model.ChallengeModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Date;

public interface ChallengeRepository extends MongoRepository<ChallengeModel, String> {
    List<ChallengeModel> findByEndDateAfter(Date currentDate); 
    List<ChallengeModel> findByEndDateBefore(Date currentDate);
    List<ChallengeModel> findByUserId(String userId);
    List<ChallengeModel> findByUserIdAndEndDateAfter(String userId, Date currentDate);
    List<ChallengeModel> findByUserIdAndEndDateBefore(String userId, Date currentDate);
}