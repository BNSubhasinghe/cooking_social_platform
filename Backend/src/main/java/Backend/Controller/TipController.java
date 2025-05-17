package Backend.Controller;

import Backend.Model.TipModel;
import Backend.Repository.TipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/tips")
@CrossOrigin
public class TipController {

    @Autowired
    private TipRepository tipRepo;

    @PostMapping
    public TipModel addTip(@RequestBody TipModel tip, @AuthenticationPrincipal UserDetails userDetails) {
        tip.setUserId(userDetails.getUsername());
        return tipRepo.save(tip);
    }

    @GetMapping
    public List<TipModel> getAllTips() {
        return tipRepo.findAll();
    }

    @GetMapping("/my")
    public List<TipModel> getMyTips(@AuthenticationPrincipal UserDetails userDetails) {
        return tipRepo.findByUserId(userDetails.getUsername());
    }

    @GetMapping("/search")
    public List<TipModel> searchByTitle(@RequestParam String title) {
        return tipRepo.findByTitleContainingIgnoreCase(title);
    }

    @GetMapping("/category")
    public List<TipModel> getByCategory(@RequestParam String category) {
        return tipRepo.findByCategory(category);
    }

    @GetMapping("/featured")
    public List<TipModel> getFeaturedTips() {
        return tipRepo.findAll().stream().filter(TipModel::isFeatured).toList();
    }

    @GetMapping("/tip-of-the-day")
    public TipModel getTipOfTheDay() {
        List<TipModel> tips = tipRepo.findAll();
        return tips.isEmpty() ? null : tips.get(new Random().nextInt(tips.size()));
    }

    @PutMapping("/{id}")
    public TipModel updateTip(@PathVariable String id, @RequestBody TipModel updatedTip, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<TipModel> optionalTip = tipRepo.findById(id);
        if (optionalTip.isPresent()) {
            TipModel tip = optionalTip.get();
            // Only allow update if user is owner
            if (!tip.getUserId().equals(userDetails.getUsername())) return null;
            tip.setTitle(updatedTip.getTitle());
            tip.setDescription(updatedTip.getDescription());
            tip.setCategory(updatedTip.getCategory());
            return tipRepo.save(tip);
        }
        return null;
    }

    @PutMapping("/{id}/rate")
    public TipModel rateTip(@PathVariable String id, @RequestParam int rating, @RequestParam String userId) {
        Optional<TipModel> optionalTip = tipRepo.findById(id);
        if (optionalTip.isPresent()) {
            TipModel tip = optionalTip.get();
            
            // Get previous rating if exists
            Integer previousRating = tip.getUserRating(userId);
            
            // Update user's rating
            tip.setUserRating(userId, rating);
            
            // Update average rating
            if (previousRating != null) {
                // If user has rated before, adjust the average
                double totalScore = tip.getAverageRating() * tip.getRatingCount();
                totalScore = totalScore - previousRating + rating;
                tip.setAverageRating(totalScore / tip.getRatingCount());
            } else {
                // If this is user's first rating
                double totalScore = tip.getAverageRating() * tip.getRatingCount();
                tip.setRatingCount(tip.getRatingCount() + 1);
                tip.setAverageRating((totalScore + rating) / tip.getRatingCount());
            }
            
            return tipRepo.save(tip);
        }
        return null;
    }

    @GetMapping("/{id}/user-rating")
    public ResponseEntity<Integer> getUserRating(@PathVariable String id, @RequestParam String userId) {
        try {
            Optional<TipModel> optionalTip = tipRepo.findById(id);
            if (optionalTip.isPresent()) {
                TipModel tip = optionalTip.get();
                Integer rating = tip.getUserRating(userId);
                return ResponseEntity.ok(rating != null ? rating : 0);
            }
            return ResponseEntity.ok(0); // Return 0 instead of 404 when tip not found
        } catch (Exception e) {
            return ResponseEntity.ok(0); // Return 0 for any error
        }
    }

    @DeleteMapping("/{id}")
    public String deleteTip(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<TipModel> optionalTip = tipRepo.findById(id);
        if (optionalTip.isPresent()) {
            TipModel tip = optionalTip.get();
            if (!tip.getUserId().equals(userDetails.getUsername())) return "Unauthorized";
            tipRepo.deleteById(id);
            return "Tip deleted successfully";
        }
        return "Tip not found";
    }
}

