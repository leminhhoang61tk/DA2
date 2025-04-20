package com.smartshipd.notification.repository;

import com.smartshipd.notification.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    List<NotificationEntity> findByRecipientIdOrderBySentAtDesc(Long recipientId);
    List<NotificationEntity> findByRecipientIdAndIsReadOrderBySentAtDesc(Long recipientId, boolean isRead);
}