package Backend.Controller;

import Backend.Exception.RecipeNotFoundException;
import Backend.Model.CommentModel;
import Backend.Model.RecipeModel;
import Backend.Repository.RecipeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("http://localhost:5173")
public class RecipeController {

    @Autowired
    private RecipeRepository recipeRepository;

    private final String UPLOAD_DIR = "src/main/uploads/";

    // ✅ Add new recipe (pure JSON)
    @PostMapping("/recipes")
    public ResponseEntity<?> addRecipe(@RequestBody RecipeModel recipe) {
        try {
            RecipeModel saved = recipeRepository.save(recipe);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error saving recipe: " + e.getMessage());
        }
    }

    // ✅ Upload image only
    @PostMapping("/recipes/image")
    public String uploadImage(@RequestParam("file") MultipartFile file) {
        String fileName = file.getOriginalFilename();
        try {
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) uploadDir.mkdirs();
            file.transferTo(Paths.get(UPLOAD_DIR + fileName));
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Image upload failed");
        }
    }

    // ✅ Get all recipes
    @GetMapping("/recipes")
    public List<RecipeModel> getAllRecipes() {
        return recipeRepository.findAll();
    }

    // ✅ Get recipe by ID with comments
    @GetMapping("/recipes/{id}")
    public RecipeModel getRecipeById(@PathVariable String id) {
        return recipeRepository.findById(id)
                .orElseThrow(() -> new RecipeNotFoundException(id));
    }

    // ✅ Filter recipes by category
    @GetMapping("/recipes/category/{category}")
    public List<RecipeModel> getByCategory(@PathVariable String category) {
        return recipeRepository.findByCategoryContainingIgnoreCase(category);
    }

    // ✅ Serve uploaded image
    @GetMapping("/recipes/image/{filename}")
    public ResponseEntity<FileSystemResource> getImage(@PathVariable String filename) {
        File file = new File(UPLOAD_DIR + filename);
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new FileSystemResource(file));
    }

    // ✅ Update recipe with optional image
    @PutMapping("/recipes/update/{id}")
    public RecipeModel updateRecipe(
            @RequestPart("recipeDetails") String recipeDetails,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @PathVariable String id
    ) {
        ObjectMapper mapper = new ObjectMapper();
        RecipeModel updatedRecipe;
        try {
            updatedRecipe = mapper.readValue(recipeDetails, RecipeModel.class);
        } catch (IOException e) {
            throw new RuntimeException("Error parsing recipeDetails", e);
        }

        RecipeModel existing = recipeRepository.findById(id)
                .orElseThrow(() -> new RecipeNotFoundException(id));

        existing.setTitle(updatedRecipe.getTitle());
        existing.setIngredients(updatedRecipe.getIngredients());
        existing.setInstructions(updatedRecipe.getInstructions());
        existing.setCookingTime(updatedRecipe.getCookingTime());
        existing.setCategory(updatedRecipe.getCategory());
        existing.setCuisineType(updatedRecipe.getCuisineType());
        existing.setDescription(updatedRecipe.getDescription());

        if (file != null && !file.isEmpty()) {
            String fileName = file.getOriginalFilename();
            try {
                file.transferTo(Paths.get(UPLOAD_DIR + fileName));
                existing.setMediaUrl(fileName);
            } catch (IOException e) {
                throw new RuntimeException("Image saving failed", e);
            }
        }

        return recipeRepository.save(existing);
    }

    // ✅ Delete recipe and image
    @DeleteMapping("/recipes/{id}")
    public String deleteRecipe(@PathVariable String id) {
        RecipeModel recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RecipeNotFoundException(id));

        String fileName = recipe.getMediaUrl();
        if (fileName != null && !fileName.isEmpty()) {
            File imageFile = new File(UPLOAD_DIR + fileName);
            if (imageFile.exists()) {
                imageFile.delete();
            }
        }

        recipeRepository.deleteById(id);
        return "Recipe with ID " + id + " and image deleted.";
    }

    // ⭐ Rate recipe
    @PutMapping("/recipes/{id}/rate")
    public RecipeModel rateRecipe(@PathVariable String id, @RequestParam double rating) {
        RecipeModel recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RecipeNotFoundException(id));

        double total = recipe.getAverageRating() * recipe.getRatingCount();
        int newCount = recipe.getRatingCount() + 1;
        double newAverage = (total + rating) / newCount;

        recipe.setRatingCount(newCount);
        recipe.setAverageRating(newAverage);
        return recipeRepository.save(recipe);
    }

    // 💬 Add new comment
    @PostMapping("/recipes/{id}/comment")
    public RecipeModel addComment(@PathVariable String id, @RequestBody CommentModel comment) {
        RecipeModel recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RecipeNotFoundException(id));

        recipe.getComments().add(0, comment); // add to beginning
        return recipeRepository.save(recipe);
    }

    // 💬 Update a comment
    @PutMapping("/recipes/{recipeId}/comment/{commentId}")
    public RecipeModel updateComment(
            @PathVariable String recipeId,
            @PathVariable String commentId,
            @RequestBody CommentModel updatedComment
    ) {
        RecipeModel recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RecipeNotFoundException(recipeId));

        recipe.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .ifPresent(c -> {
                    c.setText(updatedComment.getText());
                    c.setTime(updatedComment.getTime());
                    c.setAvatar(updatedComment.getAvatar());
                    c.setUser(updatedComment.getUser());
                });

        return recipeRepository.save(recipe);
    }

    // 💬 Delete a comment
    @DeleteMapping("/recipes/{recipeId}/comment/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable String recipeId,
            @PathVariable String commentId
    ) {
        try {
            RecipeModel recipe = recipeRepository.findById(recipeId)
                    .orElseThrow(() -> new RecipeNotFoundException(recipeId));

            List<CommentModel> updatedComments = recipe.getComments().stream()
                    .filter(c -> !c.getId().equals(commentId))
                    .collect(Collectors.toList());

            recipe.setComments(updatedComments);
            recipeRepository.save(recipe);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete comment: " + e.getMessage());
        }
    }
}
