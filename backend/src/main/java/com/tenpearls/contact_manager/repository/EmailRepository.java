package com.tenpearls.contact_manager.repository;

import com.tenpearls.contact_manager.entity.EmailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailRepository extends JpaRepository<EmailEntity, Long> {
}