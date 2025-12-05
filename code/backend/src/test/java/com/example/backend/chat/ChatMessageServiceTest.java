package com.example.backend.chat;

import com.example.backend.chatroom.ChatRoomService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatMessageServiceTest {

    @Mock
    private ChatMessageRepository repository;

    @Mock
    private ChatRoomService chatRoomService;

    @InjectMocks
    private ChatMessageService chatMessageService;

    private ChatMessage chatMessage;
    private final String senderId = "userA";
    private final String recipientId = "userB";
    private final String chatId = "userA_userB";

    @BeforeEach
    void setUp() {
        chatMessage = ChatMessage.builder()
                .senderId(senderId)
                .recipientId(recipientId)
                .content("Hello")
                .timestamp(new Date())
                .build();
    }

    @Test
    void save_ShouldSetChatIdAndSaveMessage() {
        // Arrange
        // Mock ChatRoomService to return a chatId and ensure it's called with createNewRoomIfNotExists=true
        when(chatRoomService.getChatRoomId(senderId, recipientId, true))
                .thenReturn(Optional.of(chatId));
        when(repository.save(any(ChatMessage.class))).thenReturn(chatMessage);

        // ArgumentCaptor to check the message saved
        ArgumentCaptor<ChatMessage> messageCaptor = ArgumentCaptor.forClass(ChatMessage.class);

        // Act
        ChatMessage savedMsg = chatMessageService.save(chatMessage);

        // Assert
        // 1. Verify ChatRoomService was called correctly
        verify(chatRoomService, times(1)).getChatRoomId(senderId, recipientId, true);

        // 2. Verify repository.save was called
        verify(repository, times(1)).save(messageCaptor.capture());

        // 3. Verify the chatId was set on the message before saving
        assertEquals(chatId, messageCaptor.getValue().getChatId());
        assertEquals(chatMessage, savedMsg);
    }

    @Test
    void save_ShouldThrowException_WhenChatIdCannotBeRetrieved() {
        // Arrange
        // Mock ChatRoomService to return an empty Optional
        when(chatRoomService.getChatRoomId(senderId, recipientId, true))
                .thenReturn(Optional.empty());

        // Act & Assert
        // The original code uses .orElseThrow(), which throws NoSuchElementException if Optional is empty
        assertThrows(java.util.NoSuchElementException.class, () -> chatMessageService.save(chatMessage));

        // Verify repository.save was never called
        verify(repository, never()).save(any(ChatMessage.class));
    }

    @Test
    void findChatMessages_ShouldReturnMessages_WhenChatIdExists() {
        // Arrange
        List<ChatMessage> mockMessages = List.of(
                ChatMessage.builder().chatId(chatId).content("m1").build(),
                ChatMessage.builder().chatId(chatId).content("m2").build()
        );
        // Mock ChatRoomService to return existing chatId
        when(chatRoomService.getChatRoomId(senderId, recipientId, false))
                .thenReturn(Optional.of(chatId));
        // Mock repository to return the messages
        when(repository.findByChatId(chatId)).thenReturn(mockMessages);

        // Act
        List<ChatMessage> result = chatMessageService.findChatMessages(senderId, recipientId);

        // Assert
        // 1. Verify ChatRoomService was called correctly (with create=false)
        verify(chatRoomService, times(1)).getChatRoomId(senderId, recipientId, false);

        // 2. Verify repository.findByChatId was called
        verify(repository, times(1)).findByChatId(chatId);

        // 3. Verify the list size and content
        assertEquals(2, result.size());
        assertEquals(mockMessages, result);
    }

    @Test
    void findChatMessages_ShouldReturnEmptyList_WhenChatIdDoesNotExist() {
        // Arrange
        // Mock ChatRoomService to return empty Optional
        when(chatRoomService.getChatRoomId(senderId, recipientId, false))
                .thenReturn(Optional.empty());

        // Act
        List<ChatMessage> result = chatMessageService.findChatMessages(senderId, recipientId);

        // Assert
        // 1. Verify ChatRoomService was called correctly (with create=false)
        verify(chatRoomService, times(1)).getChatRoomId(senderId, recipientId, false);

        // 2. Verify repository.findByChatId was never called
        verify(repository, never()).findByChatId(anyString());

        // 3. Verify the result is an empty list
        assertTrue(result.isEmpty());
        assertEquals(ArrayList.class, result.getClass());
    }
}