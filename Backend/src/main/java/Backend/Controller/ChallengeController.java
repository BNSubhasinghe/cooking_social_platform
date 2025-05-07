package Backend.Controller;

import Backend.Model.ChallengeModel;
import Backend.Repository.ChallengeRepository;
import Backend.DTO.ChallengeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    @Autowired
    private ChallengeRepository challengeRepository;

    private final String UPLOAD_DIR = "src/main/uploads/challenges/";
    private final SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");

    @GetMapping("/")
    public List<ChallengeModel> getAllChallenges() {
        return challengeRepository.findAll();
    }

    @GetMapping("/active")
    public List<ChallengeModel> getActiveChallenges() {
        return challengeRepository.findByEndDateAfter(new Date());
    }

    @GetMapping("/past")
    public List<ChallengeModel> getPastChallenges() {
        return challengeRepository.findByEndDateBefore(new Date());
    }

    @GetMapping("/{id}")
    public ChallengeModel getChallengeById(@PathVariable String id) {
        return challengeRepository.findById(id).orElse(null);
    }

    @PostMapping("/")
    public ChallengeModel createChallenge(@ModelAttribute ChallengeRequest req) throws IOException {
        Date startDate = parseDate(req.getStartDate());
        Date endDate = parseDate(req.getEndDate());

        ChallengeModel challenge = new ChallengeModel();
        challenge.setTitle(req.getTitle());
        challenge.setDescription(req.getDescription());
        challenge.setTheme(req.getTheme());
        challenge.setStartDate(startDate);
        challenge.setEndDate(endDate);

        MultipartFile file = req.getFile();
        if (file != null && !file.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(UPLOAD_DIR);
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            challenge.setImageUrl("/uploads/challenges/" + fileName);
        }

        return challengeRepository.save(challenge);
    }

    @PutMapping("/{id}")
    public ChallengeModel updateChallenge(
            @PathVariable String id,
            @ModelAttribute ChallengeRequest req) throws IOException {

        ChallengeModel challenge = challengeRepository.findById(id).orElse(null);
        if (challenge == null) return null;

        if (req.getTitle() != null) challenge.setTitle(req.getTitle());
        if (req.getDescription() != null) challenge.setDescription(req.getDescription());
        if (req.getTheme() != null) challenge.setTheme(req.getTheme());
        if (req.getStartDate() != null) challenge.setStartDate(parseDate(req.getStartDate()));
        if (req.getEndDate() != null) challenge.setEndDate(parseDate(req.getEndDate()));

        MultipartFile file = req.getFile();
        if (file != null && !file.isEmpty()) {
            // Delete old image if exists
            if (challenge.getImageUrl() != null) {
                String oldFileName = challenge.getImageUrl().replace("/uploads/challenges/", "");
                Path oldImagePath = Paths.get(UPLOAD_DIR + oldFileName);
                if (Files.exists(oldImagePath)) {
                    Files.delete(oldImagePath);
                }
            }
            
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(UPLOAD_DIR);
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            challenge.setImageUrl("/uploads/challenges/" + fileName);
        }

        return challengeRepository.save(challenge);
    }

    @DeleteMapping("/{id}")
    public String deleteChallenge(@PathVariable String id) {
        ChallengeModel challenge = challengeRepository.findById(id).orElse(null);
        if (challenge != null && challenge.getImageUrl() != null) {
            try {
                String fileName = challenge.getImageUrl().replace("/uploads/challenges/", "");
                Path imagePath = Paths.get(UPLOAD_DIR + fileName);
                if (Files.exists(imagePath)) {
                    Files.delete(imagePath);
                }
            } catch (IOException e) {
                System.err.println("Failed to delete image: " + e.getMessage());
            }
        }
        challengeRepository.deleteById(id);
        return "Challenge with ID " + id + " deleted.";
    }

    @PostMapping("/{id}/submit")
    public ChallengeModel submitRecipe(
            @PathVariable String id,
            @RequestParam("recipeId") String recipeId) {

        ChallengeModel challenge = challengeRepository.findById(id).orElse(null);
        if (challenge == null) return null;

        ChallengeModel.Submission submission = new ChallengeModel.Submission();
        submission.setRecipeId(recipeId);
        submission.setVotes(0);

        challenge.getSubmissions().add(submission);
        return challengeRepository.save(challenge);
    }

    @PostMapping("/{id}/vote/{recipeId}")
    public ChallengeModel voteForSubmission(
            @PathVariable String id,
            @PathVariable String recipeId) {

        ChallengeModel challenge = challengeRepository.findById(id).orElse(null);
        if (challenge == null) return null;

        for (ChallengeModel.Submission submission : challenge.getSubmissions()) {
            if (submission.getRecipeId().equals(recipeId)) {
                submission.setVotes(submission.getVotes() + 1);
                break;
            }
        }

        return challengeRepository.save(challenge);
    }

    @GetMapping("/{id}/leaderboard")
    public List<ChallengeModel.Submission> getLeaderboard(@PathVariable String id) {
        ChallengeModel challenge = challengeRepository.findById(id).orElse(null);
        if (challenge == null) return null;

        challenge.getSubmissions().sort((a, b) -> Integer.compare(b.getVotes(), a.getVotes()));
        return challenge.getSubmissions();
    }

    private Date parseDate(String dateStr) {
        try {
            return formatter.parse(dateStr);
        } catch (Exception e) {
            throw new RuntimeException("Invalid date format. Expected yyyy-MM-dd'T'HH:mm", e);
        }
    }
}