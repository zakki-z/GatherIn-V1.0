package com.example.backend.user;

import com.example.backend.user.enums.Role;
import com.example.backend.user.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document
public class User {
    @Id
    private String nickName;
    private String fullName;
    private String username;
    private String password;
    private String email;
    private Role role;
    private Status status;
}
