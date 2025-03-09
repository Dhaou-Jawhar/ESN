package nesstechnologies.fr.applicationesnbackend.services.Media;

import nesstechnologies.fr.applicationesnbackend.entities.Media;

import java.util.Optional;

public interface MediaService {
    public Optional<Media> getOne(Integer id);
    public void save(Media m);
    public void delete(Integer id);
    public boolean exists(Integer id);



    }
