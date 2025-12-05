package com.example.backend.chat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatControllerTest {

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @Mock
    private ChatMessageService chatMessageService;

    @InjectMocks
    private ChatController chatController;

    private ChatMessage incomingMessage;
    private ChatMessage savedMessage;

    @BeforeEach
    void setUp() {
        // Setup incoming message payload
        incomingMessage = ChatMessage.builder()
                .senderId("userA")
                .recipientId("userB")
                .content("Test message")
                .timestamp(new Date())
                .build();

        // Setup the message after it's saved by the service (with ID, chatId, etc.)
        savedMessage = ChatMessage.builder()
                .id("msg123")
                .chatId("userA_userB")
                .senderId("userA")
                .recipientId("userB")
                .content("Test message")
                .timestamp(incomingMessage.getTimestamp())
                .build();
    }

    // ------------------------------------------
    // WebSocket / MessageMapping Tests
    // ------------------------------------------

    @Test
    void processMessage_ShouldSaveMessageAndSendNotificationToRecipient() {
        // Arrange
        // Mock the service call to return the saved message
        when(chatMessageService.save(incomingMessage)).thenReturn(savedMessage);

        // Captors for SimpMessagingTemplate arguments
        ArgumentCaptor<String> userCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> destinationCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<ChatNotification> notificationCaptor = ArgumentCaptor.forClass(ChatNotification.class);

        // Act
        chatController.processMessage(incomingMessage);

        // Assert
        // 1. Verify that chatMessageService.save was called once
        verify(chatMessageService, times(1)).save(incomingMessage);

        // 2. Verify messagingTemplate.convertAndSendToUser was called once
        verify(messagingTemplate, times(1)).convertAndSendToUser(
                userCaptor.capture(),
                destinationCaptor.capture(),
                notificationCaptor.capture()
        );

        // 3. Check the arguments passed to convertAndSendToUser
        assertEquals(savedMessage.getRecipientId(), userCaptor.getValue(), "Should send to the recipient ID");
        assertEquals("/queue/messages", destinationCaptor.getValue(), "Should send to the private queue");

        // 4. Check the payload (ChatNotification) content
        ChatNotification notification = notificationCaptor.getValue();
        assertEquals(savedMessage.getId(), notification.getId());
        assertEquals(savedMessage.getSenderId(), notification.getSenderId());
        assertEquals(savedMessage.getRecipientId(), notification.getRecipientId());
        assertEquals(savedMessage.getContent(), notification.getContent());
    }

    // ------------------------------------------
    // REST / GetMapping Tests
    // ------------------------------------------

    @Test
    void findChatMessages_ShouldCallServiceAndReturnOkResponse() {
        // Arrange
        String sender = "userA";
        String recipient = "userB";
        List<ChatMessage> mockMessages = List.of(savedMessage);

        // Mock the service call
        when(chatMessageService.findChatMessages(sender, recipient)).thenReturn(mockMessages);

        // Act
        ResponseEntity<List<ChatMessage>> responseEntity = chatController.findChatMessages(sender, recipient);

        // Assert
        // 1. Verify that chatMessageService.findChatMessages was called once
        verify(chatMessageService, times(1)).findChatMessages(sender, recipient);

        // 2. Verify the HTTP status code is OK (200)
        assertEquals(200, responseEntity.getStatusCodeValue());

        // 3. Verify the body contains the list of messages
        assertTrue(responseEntity.hasBody());
        assertEquals(mockMessages, responseEntity.getBody());
    }
}