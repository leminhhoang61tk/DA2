package com.smartshipd.common.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    private Long notificationId;
    private String type;
    private String content;
    private Long recipientId;
    private boolean isRead;
    private LocalDateTime sentAt;
}