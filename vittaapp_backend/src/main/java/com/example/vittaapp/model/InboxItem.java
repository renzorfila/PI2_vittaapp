package com.example.vittaapp.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class InboxItem {
    private Long userId;        // id do outro (profissional)
    private String name;
    private String initial;
    private String lastMessage;
    private LocalDateTime time;
    private Long unread;
}

