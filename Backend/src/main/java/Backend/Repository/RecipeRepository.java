package Backend.Repository;

import Backend.Model.RecipeModel;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface RecipeRepository extends MongoRepository<RecipeModel, String> {

    List<RecipeModel> findByCategoryContainingIgnoreCase(String category);
    RecipeModel findByTitle(String title);

    // Add this method to fetch recipe with comments in a single query
    @Query("SELECT r FROM RecipeModel r LEFT JOIN FETCH r.comments WHERE r.id = :id")
    Optional<RecipeModel> findByIdWithComments(@Param("id") String id);


}
