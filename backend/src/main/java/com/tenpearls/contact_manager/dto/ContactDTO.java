package com.tenpearls.contact_manager.dto;

import lombok.Data;

@Data
public class ContactDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String title;
    private java.util.List<com.tenpearls.contact_manager.entity.EmailEntity> emails;
    private java.util.List<com.tenpearls.contact_manager.entity.PhoneEntity> phones;
}