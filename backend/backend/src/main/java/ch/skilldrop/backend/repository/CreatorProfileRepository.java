package ch.skilldrop.backend.repository;

import ch.skilldrop.backend.entity.CreatorProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreatorProfileRepository extends JpaRepository<CreatorProfile, Long> {
}