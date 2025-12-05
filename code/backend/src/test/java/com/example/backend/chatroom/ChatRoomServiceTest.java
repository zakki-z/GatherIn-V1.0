package com.example.backend.chatroom;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatRoomServiceTest {

    @Mock
    private ChatRoomRepository chatRoomRepository;

    @InjectMocks
    private ChatRoomService chatRoomService;

    private final String senderId = "userA";
    private final String recipientId = "userB";
    private final String expectedChatId = "userA_userB";
    private ChatRoom existingChatRoom;

    @BeforeEach
    void setUp() {
        existingChatRoom = ChatRoom.builder()
                .chatId(expectedChatId)
                .senderId(senderId)
                .recipientId(recipientId)
                .build();
    }

    @Test
    void getChatRoomId_ShouldReturnExistingId_WhenRoomFound() {
        // Arrange
        when(chatRoomRepository.findBySenderIdAndRecipientId(senderId, recipientId))
                .thenReturn(Optional.of(existingChatRoom));

        // Act
        Optional<String> result = chatRoomService.getChatRoomId(senderId, recipientId, true);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(expectedChatId, result.get());

        // Verify no new room was created
        verify(chatRoomRepository, never()).save(any(ChatRoom.class));
    }

    @Test
    void getChatRoomId_ShouldReturnEmpty_WhenRoomNotFoundAndCreateIsFalse() {
        // Arrange
        when(chatRoomRepository.findBySenderIdAndRecipientId(senderId, recipientId))
                .thenReturn(Optional.empty());

        // Act
        Optional<String> result = chatRoomService.getChatRoomId(senderId, recipientId, false);

        // Assert
        assertTrue(result.isEmpty());

        // Verify findBySenderIdAndRecipientId was called, but save was not
        verify(chatRoomRepository, times(1)).findBySenderIdAndRecipientId(senderId, recipientId);
        verify(chatRoomRepository, never()).save(any(ChatRoom.class));
    }

    @Test
    void getChatRoomId_ShouldCreateAndReturnNewId_WhenRoomNotFoundAndCreateIsTrue() {
        // Arrange
        when(chatRoomRepository.findBySenderIdAndRecipientId(senderId, recipientId))
                .thenReturn(Optional.empty());

        // ArgumentCaptor to capture both ChatRoom objects saved
        ArgumentCaptor<ChatRoom> chatRoomCaptor = ArgumentCaptor.forClass(ChatRoom.class);

        // Act
        Optional<String> result = chatRoomService.getChatRoomId(senderId, recipientId, true);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(expectedChatId, result.get());

        // Verify that chatRoomRepository.save was called exactly twice (for A->B and B->A)
        verify(chatRoomRepository, times(2)).save(chatRoomCaptor.capture());

        // Verify the saved entities
        List<ChatRoom> savedRooms = chatRoomCaptor.getAllValues();
        assertEquals(2, savedRooms.size());

        // Check senderRecipient mapping
        ChatRoom sr = savedRooms.get(0);
        assertEquals(expectedChatId, sr.getChatId());
        assertEquals(senderId, sr.getSenderId());
        assertEquals(recipientId, sr.getRecipientId());

        // Check recipientSender mapping
        ChatRoom rs = savedRooms.get(1);
        assertEquals(expectedChatId, rs.getChatId());
        assertEquals(recipientId, rs.getSenderId());
        assertEquals(senderId, rs.getRecipientId());
    }
}