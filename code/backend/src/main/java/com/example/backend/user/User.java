package com.example.backend.user;

import com.example.backend.user.enums.Role;
import com.example.backend.user.enums.Status;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document
public class User {
    @Id
    private String nickName;
    private String fullName;
    private String password;
    private String email;
    private Role role;
    private Status status;
}
