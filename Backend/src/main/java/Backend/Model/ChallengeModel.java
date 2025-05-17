package Backend.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.HashSet;
import java.util.Set;

@Document("challenges")
public class ChallengeModel {
    @Id
    private String id;
    private String title;
    private String description;
    private String theme;
    private String imageUrl;
    private Date startDate;
    private Date endDate;
    private List<Submission> submissions = new ArrayList<>();
    private String userId; // userId should be the MongoDB _id string
    private Set<String> votedUserIds = new HashSet<>();

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }
    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }
    public List<Submission> getSubmissions() { return submissions; }
    public void setSubmissions(List<Submission> submissions) { this.submissions = submissions; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Set<String> getVotedUserIds() { return votedUserIds; }
    public void setVotedUserIds(Set<String> votedUserIds) { this.votedUserIds = votedUserIds; }

    public static class Submission {
        private String recipeId;
        private int votes;
        private Set<String> votedUserIds = new HashSet<>();

        // Add a default constructor for MongoDB mapping
        public Submission() {}

        // Optionally, add a constructor for convenience
        public Submission(String recipeId, int votes) {
            this.recipeId = recipeId;
            this.votes = votes;
        }

        // Getters and Setters
        public String getRecipeId() { return recipeId; }
        public void setRecipeId(String recipeId) { this.recipeId = recipeId; }
        public int getVotes() { return votes; }
        public void setVotes(int votes) { this.votes = votes; }
        public Set<String> getVotedUserIds() { return votedUserIds; }
        public void setVotedUserIds(Set<String> votedUserIds) { this.votedUserIds = votedUserIds; }
    }
}