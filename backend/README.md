# 📇 Contact Manager - Enterprise REST API

![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-brightgreen.svg)
![Security](https://img.shields.io/badge/Spring_Security-JWT-blue.svg)
![Testing](https://img.shields.io/badge/Testing-JUnit_5_%7C_Mockito-red.svg)
![Database](https://img.shields.io/badge/Database-SQL_Server-lightgrey.svg)

A robust, enterprise-grade backend API developed in **Java** and **Spring Boot**. This project demonstrates industry-standard backend architecture, focusing on clean code, secure data transfer, strict validation protocols, and structured error handling. It serves as the powerful backend engine for the [Contact Manager React Application](https://github.com/AkramSE/Contact-Manager-UI.git).

# ✨ Features

- 🔐 JWT Authentication & Authorization
- 👤 User Registration & Login
- 📇 Contact CRUD Operations
- 📄 Pagination & Search
- ✅ DTO Architecture
- ✅ Bean Validation
- 🛡️ Global Exception Handling
- 🔑 BCrypt Password Encryption
- 📜 SLF4J + Logback Logging
- 🧪 JUnit 5 & Mockito Testing
- 🗄️ Spring Data JPA + Hibernate

---

# 🛠️ Tech Stack

| Technology | Version |
|------------|----------|
| Java | 17 |
| Spring Boot | 3.x |
| Spring Security | Latest |
| JWT | io.jsonwebtoken |
| Spring Data JPA | Hibernate |
| Database | MySQL / SQL Server |
| Testing | JUnit 5, Mockito |

---

# 📁 Project Structure

```text
src/main/java/com/tenpearls/contact_manager/
├── config/
├── controller/
├── dto/
├── entity/
├── exception/
├── repository/
├── security/
└── service/
```

---

# 🚀 Getting Started

Clone Repository

```bash
git clone https://github.com/AkramSE/Contact-Manager-API.git
cd Contact-Manager-API
```

---

## Configure Database

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/contact_manager_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

---

## Run Application

```bash
./mvnw clean install
./mvnw spring-boot:run
```

---

# 🔐 Security

- JWT based authentication
- Stateless Sessions
- BCrypt Password Hashing
- Protected REST Endpoints

---

# 📌 Backend Architecture

```text
Controller
    │
    ▼
Service
    │
    ▼
Repository
    │
    ▼
Database
```

DTOs isolate API payloads from database entities.

---

# 🧪 Testing

- Unit Testing using JUnit 5
- Mockito for Service Layer Testing
- Isolated Business Logic Tests

---

# 🌐 Frontend Repository

https://github.com/AkramSE/Contact-Manager-UI

---

# 👨‍💻 Author

**Muhammad Akram**

LinkedIn

https://linkedin.com/in/muhammad-akram-se

GitHub

https://github.com/AkramSE

---

Made with ❤️ using **Java**, **Spring Boot**, and **Spring Security**.
