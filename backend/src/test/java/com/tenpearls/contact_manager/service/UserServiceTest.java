package com.tenpearls.contact_manager.service;

import com.tenpearls.contact_manager.entity.User;
import com.tenpearls.contact_manager.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        // Initializes Mockito annotations before each test execution.
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveUser_Success() {
        // 1. Create a mock user entity with test credentials.
        User mockUser = new User();
        mockUser.setEmail("test@10pearls.com");
        mockUser.setPassword("plainPassword123");

        // 2. Configure stubbing rules for password encoder and user repository mocks
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword123");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        // 3. Invoke the actual service layer method under test.
        User savedUser = userService.saveUser(mockUser);

        // 4. Run assertions to validate that the returned object matches expected values.
        assertNotNull(savedUser);
        assertEquals("test@10pearls.com", savedUser.getEmail());

        // Verify that userRepository.save() was executed exactly once.
        verify(userRepository, times(1)).save(mockUser);
        verify(passwordEncoder, times(1)).encode("plainPassword123");
    }
}