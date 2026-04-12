package ch.skilldrop.backend.repository;

import ch.skilldrop.backend.entity.Drop;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DropRepository extends JpaRepository<Drop, Long> {
}