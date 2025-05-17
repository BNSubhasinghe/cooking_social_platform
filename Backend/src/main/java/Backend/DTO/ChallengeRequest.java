package Backend.DTO;

import org.springframework.web.multipart.MultipartFile;

public class ChallengeRequest {
    private String title;
    private String description;
    private String theme;
    private String startDate;
    private String endDate;
    private MultipartFile file;
    private String userId;

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public MultipartFile getFile() { return file; }
    public void setFile(MultipartFile file) { this.file = file; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
