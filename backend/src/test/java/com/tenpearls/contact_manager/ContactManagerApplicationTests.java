package com.tenpearls.contact_manager;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"spring.datasource.url=",
		"spring.jpa.database-platform="
})
class ContactManagerApplicationTests {

	@Test
	void contextLoads() {
		// SonarQube rule: Empty test method should have a comment or throw exception
		// This test simply verifies if the Spring application context loads successfully.
	}
}