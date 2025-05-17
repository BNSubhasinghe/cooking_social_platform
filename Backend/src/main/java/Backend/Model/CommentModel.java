package Backend.Model;

import java.io.Serializable;
import java.util.UUID;

public class CommentModel implements Serializable {
    private String id;
    private String user;
    private String text;
    private String avatar;
    private String time;
    private Double rating;
    private Integer helpful;

    public CommentModel() {
        this.id = UUID.randomUUID().toString();
        this.rating = 0.0;
        this.helpful = 0;
    }

    public CommentModel(String user, String text, String avatar, String time, Double rating) {
        this();
        this.user = user;
        this.text = text;
        this.avatar = avatar;
        this.time = time;
        this.rating = rating != null ? rating : 0.0;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating != null ? rating : 0.0; }

    public Integer getHelpful() { return helpful; }
    public void setHelpful(Integer helpful) { this.helpful = helpful != null ? helpful : 0; }
}