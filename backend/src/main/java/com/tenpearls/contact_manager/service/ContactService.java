package com.tenpearls.contact_manager.service;

import com.tenpearls.contact_manager.entity.Contact;
import com.tenpearls.contact_manager.entity.User;
import com.tenpearls.contact_manager.repository.ContactRepository;
import com.tenpearls.contact_manager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
@Service
public class ContactService {
    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private UserRepository userRepository;

    public Contact addContact(Long userId, Contact contact) {
        com.tenpearls.contact_manager.entity.User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        contact.setUser(user);

        if (contact.getEmails() != null) {
            for (com.tenpearls.contact_manager.entity.EmailEntity email : contact.getEmails()) {
                email.setContact(contact);
            }
        }

        if (contact.getPhones() != null) {
            for (com.tenpearls.contact_manager.entity.PhoneEntity phone : contact.getPhones()) {
                phone.setContact(contact);
            }
        }

        return contactRepository.save(contact);
    }
    public Page<Contact> getContactsByUserId(Long userId, String keyword, int page, int size) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);

        if (keyword != null && !keyword.trim().isEmpty()) {
            return contactRepository.findByUserIdAndFirstNameContainingIgnoreCase(userId, keyword, pageable);
        }

        // Otherwise, execute the default retrieval method.
        return contactRepository.findByUserId(userId, pageable);
    }
    public void deleteContact(Long contactId) {
        contactRepository.deleteById(contactId);
    }

    public Contact updateContact(Long contactId, Contact contactDetails) {
        Contact existingContact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found with id: " + contactId));

        // 1. Update basic profile fields.
        existingContact.setFirstName(contactDetails.getFirstName());
        existingContact.setLastName(contactDetails.getLastName());
        existingContact.setTitle(contactDetails.getTitle());

        // 2. Update emails list clear old data, append new data.
        if (contactDetails.getEmails() != null) {
            existingContact.getEmails().clear();
            for (com.tenpearls.contact_manager.entity.EmailEntity email : contactDetails.getEmails()) {
                email.setContact(existingContact);
                existingContact.getEmails().add(email);
            }
        }

        // 3. Update phones list clear old data, append new data.
        if (contactDetails.getPhones() != null) {
            existingContact.getPhones().clear();
            for (com.tenpearls.contact_manager.entity.PhoneEntity phone : contactDetails.getPhones()) {
                phone.setContact(existingContact);
                existingContact.getPhones().add(phone);
            }
        }

        return contactRepository.save(existingContact);
    }
}