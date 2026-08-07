package com.tenpearls.contact_manager.controller;

import com.tenpearls.contact_manager.entity.User;
import com.tenpearls.contact_manager.service.UserService;
import org.slf4j.Logger; // Logger Import
import org.slf4j.LoggerFactory; // LoggerFactory Import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.tenpearls.contact_manager.security.JwtUtil;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class UserController {

    // Initializes the logger instance for application tracing and debugging.
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public User createUser(@RequestBody User user) {
        logger.info("New user registration request received for email: {}", user.getEmail());
        return userService.saveUser(user);
    }

    @GetMapping
    public List<User> getUsers() {
        logger.info("Fetching all users list");
        return userService.getAllUsers();
    }

    // Handles incoming HTTP DELETE requests to remove a user by their unique identifier.
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        logger.info("Delete request received for User ID: {}", id);
        return userService.deleteUser(id);
    }

    // Handles HTTP PUT requests to update an existing user's profile information.
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        logger.info("Update request received for User ID: {}", id);
        return userService.updateUser(id, userDetails);
    }

    // Processes authentication requests and returns a secure JWT token along with user details upon successful login.
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody User loginRequest) {
        // ---> 2. LOGIN REQUEST LOG <---
        logger.info("Login attempt received for email: {}", loginRequest.getEmail());

        try {
            // 1. Delegates authentication verification to Spring Security.
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // 2. Generates a secure JSON Web Token (JWT) upon successful verification.
            String token = jwtUtil.generateToken(loginRequest.getEmail());

            // 3. Retrieves the user entity details from the database using the email.
            User loggedInUser = userService.getUserByEmail(loginRequest.getEmail());

            // 4. Initializes the response map to return token and user context.
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);

            // Injects user identification parameters into the response container.
            if (loggedInUser != null) {
                response.put("id", loggedInUser.getId());
                response.put("email", loggedInUser.getEmail());
            }

            // ---> SUCCESS LOG <---
            logger.info("Login successful for email: {}", loginRequest.getEmail());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // ---> FAILURE/ERROR LOG <---
            logger.error("Login failed for email: {}. Reason: Invalid credentials", loginRequest.getEmail());

            Map<String, Object> error = new HashMap<>();
            error.put("error", "Email ya Password ghalat hai!");
            return ResponseEntity.status(401).body(error);
        }
    }

    // New Endpoint: Change Password
    @PutMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody Map<String, String> request) {
        // ---> 3. PASSWORD CHANGE LOG <---
        logger.info("Password change attempt initiated for User ID: {}", id);

        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        boolean isChanged = userService.changePassword(id, oldPassword, newPassword);

        if (isChanged) {
            logger.info("Password successfully updated for User ID: {}", id);
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } else {
            logger.warn("Password change failed for User ID: {}. Invalid old password.", id);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid old password or user not found"));
        }
    }
}