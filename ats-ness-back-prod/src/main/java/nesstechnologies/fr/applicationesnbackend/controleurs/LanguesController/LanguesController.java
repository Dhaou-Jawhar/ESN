package nesstechnologies.fr.applicationesnbackend.controleurs.LanguesController;

import lombok.AllArgsConstructor;
import nesstechnologies.fr.applicationesnbackend.services.Langues.LanguesServices;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/langues")
public class LanguesController {
    private final LanguesServices languesServices;


    @PostMapping("/add/{value}/{id}")
    public ResponseEntity<String> addRatingToLangue(
            @PathVariable("value") float value,@PathVariable("id") int id ) {
        try {
            languesServices.addRatingToLangue(value, id);
            return new ResponseEntity<>("Rating added successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    @GetMapping("/getRatingByLangueId/{id}")
    public float getAverageRatingForLanguage(@PathVariable("id") int id){
        return languesServices.getRatingByLanguage(id);
    }
}
