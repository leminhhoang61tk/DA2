package com.smartshipd.notification.service;

import com.smartshipd.notification.entity.NotificationEntity;
import com.smartshipd.notification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final JavaMailSender mailSender;
    private final UserClient userClient;
    
    @Autowired
    public NotificationService(
            NotificationRepository notificationRepository,
            JavaMailSender mailSender,
            UserClient userClient) {
        this.notificationRepository = notificationRepository;
        this.mailSender = mailSender;
        this.userClient = userClient;
    }
    
    @Transactional
    public NotificationEntity sendNotification(String type, String content, Long recipientId) {
        // Lưu thông báo vào cơ sở dữ liệu
        NotificationEntity notification = new NotificationEntity();
        notification.setType(type);
        notification.setContent(content);
        notification.setRecipientId(recipientId);
        
        NotificationEntity savedNotification = notificationRepository.save(notification);
        
        // Gửi email thông báo
        try {
            String recipientEmail = userClient.getUserEmail(recipientId);
            if (recipientEmail != null) {
                sendEmail(recipientEmail, "SmartShipD Notification", content);
            }
        } catch (Exception e) {
            // Log lỗi nhưng không ảnh hưởng đến việc lưu thông báo
            System.err.println("Failed to send email notification: " + e.getMessage());
        }
        
        return savedNotification;
    }
    
    public List<NotificationEntity> getNotificationsByRecipientId(Long recipientId) {
        return notificationRepository.findByRecipientIdOrderBySentAtDesc(recipientId);
    }
    
    public List<NotificationEntity> getUnreadNotificationsByRecipientId(Long recipientId) {
        return notificationRepository.findByRecipientIdAndIsReadOrderBySentAtDesc(recipientId, false);
    }
    
    @Transactional
    public NotificationEntity markNotificationAsRead(Long notificationId) {
        NotificationEntity notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + notificationId));
        
        notification.setRead(true);
        return notificationRepository.save(notification);
    }
    
    @Transactional
    public void markAllNotificationsAsRead(Long recipientId) {
        List<NotificationEntity> unreadNotifications = notificationRepository.findByRecipientIdAndIsReadOrderBySentAtDesc(recipientId, false);
        
        for (NotificationEntity notification : unreadNotifications) {
            notification.setRead(true);
        }
        
        notificationRepository.saveAll(unreadNotifications);
    }
    
    private void sendEmail(String to, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@smartshipd.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(content);
        mailSender.send(message);
    }
}