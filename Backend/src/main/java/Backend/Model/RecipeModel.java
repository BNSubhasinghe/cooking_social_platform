package Backend.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document("recipes") // MongoDB collection name
public class RecipeModel {

    @Id
    private String id;

    private String title;
    private String description;
    private String ingredients;
    private String instructions;
    private String cookingTime;
    private String category;
    private String cuisineType;
    private String mediaUrl;

    private double averageRating = 0;
    private int ratingCount = 0;

    private List<CommentModel> comments = new ArrayList<>();

    // Constructors
    public RecipeModel() {}

    public RecipeModel(String id, String title, String description, String ingredients,
                       String instructions, String cookingTime,
                       String category, String cuisineType, String mediaUrl) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.ingredients = ingredients;
        this.instructions = instructions;
        this.cookingTime = cookingTime;
        this.category = category;
        this.cuisineType = cuisineType;
        this.mediaUrl = mediaUrl;
    }

    // Getters & Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIngredients() { return ingredients; }
    public void setIngredients(String ingredients) { this.ingredients = ingredients; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public String getCookingTime() { return cookingTime; }
    public void setCookingTime(String cookingTime) { this.cookingTime = cookingTime; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCuisineType() { return cuisineType; }
    public void setCuisineType(String cuisineType) { this.cuisineType = cuisineType; }

    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }

    public double getAverageRating() { return averageRating; }
    public void setAverageRating(double averageRating) { this.averageRating = averageRating; }

    public int getRatingCount() { return ratingCount; }
    public void setRatingCount(int ratingCount) { this.ratingCount = ratingCount; }

    public List<CommentModel> getComments() { return comments; }
    public void setComments(List<CommentModel> comments) { this.comments = comments; }
}
