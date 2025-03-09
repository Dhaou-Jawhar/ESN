package nesstechnologies.fr.applicationesnbackend.services.Media;
import lombok.AllArgsConstructor;
import nesstechnologies.fr.applicationesnbackend.entities.Media;
import nesstechnologies.fr.applicationesnbackend.repositories.mediaRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
public class MediaServiceImpl implements MediaService{
   private final mediaRepo mediaRep;



    public Optional<Media> getOne(Integer id){
        return mediaRep.findById(id);
    }

    public void save(Media m){
        mediaRep.save(m);
    }

    public void delete(Integer id){
        mediaRep.deleteById(id);
    }

    public boolean exists(Integer id){
        return mediaRep.existsById(id);
    }
}
