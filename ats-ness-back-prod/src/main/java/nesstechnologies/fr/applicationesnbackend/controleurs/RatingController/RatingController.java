package nesstechnologies.fr.applicationesnbackend.controleurs.RatingController;


import lombok.AllArgsConstructor;
import nesstechnologies.fr.applicationesnbackend.entities.Rating;
import nesstechnologies.fr.applicationesnbackend.repositories.RateRepository;
import nesstechnologies.fr.applicationesnbackend.services.Rating.RatingServiceImpl;
import org.springframework.web.bind.annotation.*;



@AllArgsConstructor
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/rating")
public class RatingController {
    private RatingServiceImpl ratingService;
    private RateRepository rateRepository;

    @PostMapping("/add/{value}/{id}")
    public Rating createRate (@PathVariable("value") float value,@PathVariable("id") int id) {
        return ratingService.createRate(value,id);
    }



    @GetMapping("/getRatingByCandidat/{id}")
    public float getAverageRatingForCandidat(@PathVariable("id") int id){
        return ratingService.getRatingByUser(id);
    }
}


