package ch.skilldrop.backend.repository;

import ch.skilldrop.backend.entity.CreatorProfile;
import ch.skilldrop.backend.entity.Drop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DropRepository extends JpaRepository<Drop, Long> {
    List<Drop> findByCreator(CreatorProfile creator);
}