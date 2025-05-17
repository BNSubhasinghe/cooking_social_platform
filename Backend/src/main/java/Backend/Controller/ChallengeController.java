package Backend.Controller;

import Backend.Model.ChallengeModel;
import Backend.Repository.ChallengeRepository;
import Backend.DTO.ChallengeRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.security.Principal;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/challenges")
@CrossOrigin(origins = "http://localhost:5173")
public class ChallengeController {

    @Autowired
    private ChallengeRepository challengeRepository;

    private final String UPLOAD_DIR = "src/main/uploads/challenges/";
    private final SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");

    @GetMapping("/")
    public List<ChallengeModel> getAllChallenges(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            String userId = userDetails.getUsername();
            return challengeRepository.findByUserId(userId);
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    @GetMapping("/active")
    public List<ChallengeModel> getActiveChallenges(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (userDetails == null) {
                System.err.println("UserDetails is null!");
                return Collections.emptyList();
            }
            String userId = userDetails.getUsername();
            return challengeRepository.findByUserIdAndEndDateAfter(userId, new Date());
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    @GetMapping("/past")
    public List<ChallengeModel> getPastChallenges(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (userDetails == null) {
                System.err.println("UserDetails is null!");
                return Collections.emptyList();
            }
            String userId = userDetails.getUsername();
            return challengeRepository.findByUserIdAndEndDateBefore(userId, new Date());
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    @GetMapping("/all")
    public List<ChallengeModel> getAllChallengesNoAuth() {
        List<ChallengeModel> challenges = challengeRepository.findAll();
        System.out.println("Found challenges: " + challenges.size());
        return challenges;
    }

    @GetMapping("/active/all")
    public List<ChallengeModel> getAllActiveChallenges() {
        return challengeRepository.findByEndDateAfter(new Date());
    }

    @GetMapping("/{id}")
    public ChallengeModel getChallengeById(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        ChallengeModel challenge = challengeRepository.findById(id).orElse(null);
        if (challenge == null) return null;
        String userId = userDetails.getUsername();
        if (!challenge.getUserId().equals(userId)) return null;
        return challenge;
    }

    @PostMapping(value = "/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createChallenge(@ModelAttribute ChallengeRequest req, @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        // Null check for userDetails
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        // Log incoming request fields for debugging
        System.out.println("Received challenge:");
        System.out.println("Title: " + req.getTitle());
        System.out.println("Theme: " + req.getTheme());
        System.out.println("StartDate: " + req.getStartDate());
        System.out.println("EndDate: " + req.getEndDate());
        System.out.println("Description: " + req.getDescription());
        System.out.println("File: " + (req.getFile() != null ? req.getFile().getOriginalFilename() : "null"));

        Date startDate = parseDate(req.getStartDate());
        Date endDate = parseDate(req.getEndDate());

        ChallengeModel challenge = new ChallengeModel();
        challenge.setTitle(req.getTitle());
        challenge.setDescription(req.getDescription());
        challenge.setTheme(req.getTheme());
        challenge.setStartDate(startDate);
        challenge.setEndDate(endDate);
        challenge.setUserId(userDetails.getUsername());

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

        return ResponseEntity.ok(challengeRepository.save(challenge));
    }

    @PutMapping("/{id}")
    public ChallengeModel updateChallenge(
            @PathVariable String id,
            @ModelAttribute ChallengeRequest req,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {

        ChallengeModel challenge = challengeRepository.findById(id).orElse(null);
        if (challenge == null) return null;
        String userId = userDetails.getUsername();
        if (!challenge.getUserId().equals(userId)) return null;

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
    public String deleteChallenge(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        ChallengeModel challenge = challengeRepository.findById(id).orElse(null);
        if (challenge == null) return "Challenge not found.";
        String userId = userDetails.getUsername();
        if (!challenge.getUserId().equals(userId)) return "Unauthorized";
        if (challenge.getImageUrl() != null) {
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
            @RequestParam("recipeId") String recipeId,
            @AuthenticationPrincipal UserDetails userDetails) {

        ChallengeModel challenge = challengeRepository.findById(id).orElse(null);
        if (challenge == null) return null;

        ChallengeModel.Submission submission = new ChallengeModel.Submission();
        submission.setRecipeId(recipeId);
        submission.setVotes(0);

        challenge.getSubmissions().add(submission);
        return challengeRepository.save(challenge);
    }

    @PostMapping("/{id}/vote/{recipeId}")
    public ResponseEntity<?> voteForSubmission(
            @PathVariable String id,
            @PathVariable String recipeId,
            @AuthenticationPrincipal UserDetails userDetails) {

        ChallengeModel challenge = challengeRepository.findById(id).orElse(null);
        if (challenge == null) return ResponseEntity.badRequest().body("Challenge not found");
        if (userDetails == null) return ResponseEntity.status(401).body("Unauthorized");

        String userId = userDetails.getUsername();
        boolean found = false;
        for (ChallengeModel.Submission submission : challenge.getSubmissions()) {
            if (submission.getRecipeId().equals(recipeId)) {
                if (submission.getVotedUserIds().contains(userId)) {
                    return ResponseEntity.badRequest().body("You have already voted for this recipe.");
                }
                submission.setVotes(submission.getVotes() + 1);
                submission.getVotedUserIds().add(userId);
                found = true;
                break;
            }
        }
        if (!found) return ResponseEntity.badRequest().body("Submission not found.");

        challengeRepository.save(challenge);
        return ResponseEntity.ok(challenge);
    }

    @GetMapping("/{id}/leaderboard")
    public List<ChallengeModel.Submission> getLeaderboard(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        ChallengeModel challenge = challengeRepository.findById(id).orElse(null);
        if (challenge == null) return null;

        challenge.getSubmissions().sort((a, b) -> Integer.compare(b.getVotes(), a.getVotes()));
        return challenge.getSubmissions();
    }

    private Date parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        try {
            return new SimpleDateFormat("yyyy-MM-dd'T'HH:mm").parse(dateStr);
        } catch (Exception e) {
            try {
                return new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").parse(dateStr);
            } catch (Exception ex) {
                throw new RuntimeException("Invalid date format. Expected yyyy-MM-dd'T'HH:mm or yyyy-MM-dd'T'HH:mm:ss, got: " + dateStr, ex);
            }
        }
    }
}