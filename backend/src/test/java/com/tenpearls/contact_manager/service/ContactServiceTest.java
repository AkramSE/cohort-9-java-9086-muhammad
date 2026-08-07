package com.tenpearls.contact_manager.service;

import com.tenpearls.contact_manager.entity.Contact;
import com.tenpearls.contact_manager.entity.User;
import com.tenpearls.contact_manager.repository.ContactRepository;
import com.tenpearls.contact_manager.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ContactServiceTest {

    @Mock
    private ContactRepository contactRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ContactService contactService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddContact_Success() {
        // 1. Initialize mock User and Contact entities.
        User mockUser = new User();
        mockUser.setId(1L);

        Contact mockContact = new Contact();
        mockContact.setFirstName("Hassan");
        mockContact.setLastName("Akram");

        // 2. Configure stubbing rules for repository mock behaviors.
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        when(contactRepository.save(any(Contact.class))).thenReturn(mockContact);

        // 3. Invoke service layer method to add contact.
        Contact savedContact = contactService.addContact(1L, mockContact);

        // 4. Run assertions to validate the returned response data.
        assertNotNull(savedContact);
        assertEquals("Hassan", savedContact.getFirstName());

        // Verify exact repository execution invocation counts.
        verify(userRepository, times(1)).findById(1L);
        verify(contactRepository, times(1)).save(mockContact);
    }
}