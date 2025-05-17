package Backend.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.HashMap;
import java.util.Map;
import java.time.LocalDateTime;

@Document("cookingTips") // MongoDB collection name
public class TipModel {
    @Id
    private String id;
    
    private String title;
    private String description;
    private String category; // Storage, Prep, Substitutes
    private double averageRating = 0;
    private int ratingCount = 0;
    private boolean featured = false; // For Admins to highlight
    private Map<String, Integer> userRatings = new HashMap<>(); // userId -> rating

    private String userId;
    private String userDisplayName; // Add this line
    private LocalDateTime createdAt; // Add this line

    public TipModel() {}

    public TipModel(String title, String description, String category) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.createdAt = LocalDateTime.now(); // Set createdAt on creation
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getAverageRating() { return averageRating; }
    public void setAverageRating(double averageRating) { this.averageRating = averageRating; }

    public int getRatingCount() { return ratingCount; }
    public void setRatingCount(int ratingCount) { this.ratingCount = ratingCount; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public Map<String, Integer> getUserRatings() { return userRatings; }
    public void setUserRatings(Map<String, Integer> userRatings) { this.userRatings = userRatings; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserDisplayName() { return userDisplayName; }
    public void setUserDisplayName(String userDisplayName) { this.userDisplayName = userDisplayName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Integer getUserRating(String userId) {
        return userRatings.get(userId);
    }

    public void setUserRating(String userId, int rating) {
        userRatings.put(userId, rating);
    }
}
