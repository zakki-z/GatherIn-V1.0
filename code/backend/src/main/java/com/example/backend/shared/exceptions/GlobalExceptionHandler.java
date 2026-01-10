package com.example.backend.shared.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UserExistsException.class)
    public ResponseEntity<String> handleException(UserExistsException userExistsException) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(userExistsException.getMessage());
    }
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleException(UserNotFoundException userNotFoundException) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(userNotFoundException.getMessage());
    }
    @ExceptionHandler(InvalidUserCredentials.class)
    public ResponseEntity<String> handleException(InvalidUserCredentials invalidUserCredentials) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(invalidUserCredentials.getMessage());
    }
    @ExceptionHandler
    public ResponseEntity<String> handleException(ChatRoomNotFoundException chatRoomNotFoundException) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(chatRoomNotFoundException.getMessage());
    }
}
