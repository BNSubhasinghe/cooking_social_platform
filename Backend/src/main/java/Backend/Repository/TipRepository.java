package Backend.Repository;

import Backend.Model.TipModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TipRepository extends MongoRepository<TipModel, String> {
    List<TipModel> findByCategory(String category);
    List<TipModel> findByTitleContainingIgnoreCase(String title);
}
