package com.tenpearls.contact_manager.repository;

import com.tenpearls.contact_manager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Returns Optional to handle missing records and avoid NullPointerException.
    Optional<User> findByEmail(String email);

}