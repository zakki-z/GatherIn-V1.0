package com.example.backend.user;

import com.example.backend.user.enums.Role;
import com.example.backend.user.enums.Status;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    @EqualsAndHashCode.Include
    private String id;
    @Indexed(unique = true)
    private String username;
    private String fullName;
    private String password;
    private String email;
    private Role role;
    private Status status;
}
