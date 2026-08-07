package com.tenpearls.contact_manager.service;

import com.tenpearls.contact_manager.entity.User;
import com.tenpearls.contact_manager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User saveUser(User user) {
        // 1. Encrypt user password.
        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);

        // 2. Assign default user role.
        user.setRole("ROLE_USER");

        // 3. Persist entity data to database.
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Permanently delete user entity by ID.
    public String deleteUser(Long id) {
        userRepository.deleteById(id);
        return "User deleted successfully!";
    }

    // Update user profile fields.
    public User updateUser(Long id, User userDetails) {
        User existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setName(userDetails.getName());
        existingUser.setEmail(userDetails.getEmail());
        existingUser.setPassword(userDetails.getPassword());
        existingUser.setRole(userDetails.getRole());

        return userRepository.save(existingUser);
    }

    // Find user entity by email attribute.
    public User getUserByEmail(String email) {
        // Unwraps user entity from Optional container or returns null.
        return userRepository.findByEmail(email).orElse(null);
    }

    // Process account password update.
    public boolean changePassword(Long userId, String oldPassword, String newPassword) {
        // Process account password update.
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return false; // User can't find
        }

        // 2. Verify if the provided old password matches the stored encrypted password.
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return false; // Return false if old password validation fails.
        }

        // 3. Encrypt and save the new account password.
        String encryptedNewPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encryptedNewPassword);

        userRepository.save(user);
        return true;
    }
}