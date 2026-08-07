package com.tenpearls.contact_manager.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Secret key used for signing the JWT digital signature.
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Token expiration time configuration (e.g., 10 hours).
    // Added 'L' to 1000 to cast the multiplication to long and prevent integer overflow.
    private static final long EXPIRATION_TIME = 1000L * 60 * 60 * 10;

    // Generates a new JWT token using the email identifier.
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY)
                .compact();
    }

    // Extracts the subject/email from the JWT payload.
    public String extractEmail(String token) {
        return Jwts.parserBuilder().setSigningKey(SECRET_KEY).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    // Validates token signature matching and expiration status.
    public boolean validateToken(String token, String userEmail) {
        final String extractedEmail = extractEmail(token);
        return (extractedEmail.equals(userEmail) && !isTokenExpired(token));
    }

    // Checks if the JWT token has expired.
    private boolean isTokenExpired(String token) {
        Date expirationDate = Jwts.parserBuilder().setSigningKey(SECRET_KEY).build()
                .parseClaimsJws(token).getBody().getExpiration();
        return expirationDate.before(new Date());
    }
}