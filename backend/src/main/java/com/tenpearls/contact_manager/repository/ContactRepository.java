package com.tenpearls.contact_manager.repository;

import com.tenpearls.contact_manager.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; // Yeh import laazmi hai
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    Page<Contact> findByUserId(Long userId, Pageable pageable);
    Page<Contact> findByUserIdAndFirstNameContainingIgnoreCase(Long userId, String keyword, Pageable pageable);
}