package com.tenpearls.contact_manager.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "contacts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Contact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    @NotBlank(message="First name is mandatory")
    private String firstName;

    private String lastName;

    private String title;

    // Database Relationship: Many Contacts can belong to a single User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Collection Mapping: A single Contact can have multiple Emails and Phone numbers associated with it
    // update the relation of email
    @OneToMany(mappedBy = "contact", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<EmailEntity> emails = new java.util.ArrayList<>();

    // updates the relation of phone
    @OneToMany(mappedBy = "contact", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<PhoneEntity> phones = new java.util.ArrayList<>();
}
