package nesstechnologies.fr.applicationesnbackend.services.User;

import lombok.AllArgsConstructor;
import nesstechnologies.fr.applicationesnbackend.repositories.UserRepo;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private UserRepo userRepo;

    public int enableAppUser(String email) {
        return userRepo.enableUser(email);
    }
}
