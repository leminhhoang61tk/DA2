package com.smartshipd.reporting.service;

import com.smartshipd.reporting.client.DriverClient;
import com.smartshipd.reporting.client.OrderClient;
import com.smartshipd.reporting.dto.DriverPerformanceDTO;
import com.smartshipd.reporting.dto.OrderStatisticsDTO;
import com.smartshipd.reporting.entity.ReportEntity;
import com.smartshipd.reporting.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportingService {
    
    private final ReportRepository reportRepository;
    private final OrderClient orderClient;
    private final DriverClient driverClient;
    
    @Autowired
    public ReportingService(
            ReportRepository reportRepository,
            OrderClient orderClient,
            DriverClient driverClient) {
        this.reportRepository = reportRepository;
        this.orderClient = orderClient;
        this.driverClient = driverClient;
    }
    
    public OrderStatisticsDTO generateOrderStatistics(String period) {
        // Lấy tất cả đơn hàng
        List<Map<String, Object>> allOrders = orderClient.getAllOrders();
        
        // Lọc theo khoảng thời gian
        LocalDateTime startDate = calculateStartDate(period);
        List<Map<String, Object>> filteredOrders = filterOrdersByDate(allOrders, startDate);
        
        // Tính toán thống kê
        OrderStatisticsDTO statistics = new OrderStatisticsDTO();
        statistics.setTotalOrders(filteredOrders.size());
        
        // Đếm số lượng đơn hàng theo trạng thái
        Map<String, List<Map<String, Object>>> ordersByStatus = filteredOrders.stream()
                .collect(Collectors.groupingBy(order -> order.get("status").toString()));
        
        statistics.setProcessingOrders(ordersByStatus.getOrDefault("PROCESSING", Collections.emptyList()).size());
        statistics.setAssignedOrders(ordersByStatus.getOrDefault("ASSIGNED", Collections.emptyList()).size());
        statistics.setInTransitOrders(ordersByStatus.getOrDefault("IN_TRANSIT", Collections.emptyList()).size());
        statistics.setDeliveredOrders(ordersByStatus.getOrDefault("DELIVERED", Collections.emptyList()).size());
        statistics.setCancelledOrders(ordersByStatus.getOrDefault("CANCELLED", Collections.emptyList()).size());
        
        // Tính tổng doanh thu
        BigDecimal totalRevenue = filteredOrders.stream()
                .map(order -> new BigDecimal(order.get("deliveryCost").toString()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        statistics.setTotalRevenue(totalRevenue);
        
        // Thống kê đơn hàng theo ngày
        Map<String, Integer> ordersByDate = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        filteredOrders.forEach(order -> {
            String createdAt = ((String) order.get("createdAt")).substring(0, 10); // Lấy phần ngày từ datetime
            ordersByDate.put(createdAt, ordersByDate.getOrDefault(createdAt, 0) + 1);
        });
        
        statistics.setOrdersByDate(ordersByDate);
        
        // Lưu báo cáo
        saveReport("ORDER_STATISTICS", Map.of(
                "period", period,
                "statistics", statistics
        ), null);
        
        return statistics;
    }
    
    public DriverPerformanceDTO generateDriverPerformance() {
        // Lấy tất cả tài xế
        List<Map<String, Object>> allDrivers = driverClient.getAllDrivers();
        
        List<DriverPerformanceDTO.DriverStatDTO> driverStats = new ArrayList<>();
        
        for (Map<String, Object> driver : allDrivers) {
            Long driverId = Long.valueOf(driver.get("driverId").toString());
            String driverName = (String) driver.get("name");
            
            // Lấy các đơn hàng của tài xế
            List<Map<String, Object>> driverOrders = orderClient.getOrdersByDriverId(driverId);
            
            // Lọc đơn hàng đã giao
            List<Map<String, Object>> deliveredOrders = driverOrders.stream()
                    .filter(order -> "DELIVERED".equals(order.get("status")))
                    .collect(Collectors.toList());
            
            // Tính toán thời gian giao hàng trung bình
            double averageDeliveryTime = 0;
            if (!deliveredOrders.isEmpty()) {
                // Giả định: thời gian giao hàng = thời gian cập nhật - thời gian tạo
                averageDeliveryTime = deliveredOrders.stream()
                        .mapToDouble(order -> {
                            LocalDateTime createdAt = LocalDateTime.parse(order.get("createdAt").toString());
                            LocalDateTime updatedAt = LocalDateTime.parse(order.get("updatedAt").toString());
                            return (updatedAt.toEpochSecond(java.time.ZoneOffset.UTC) - 
                                   createdAt.toEpochSecond(java.time.ZoneOffset.UTC)) / 60.0; // convert to minutes
                        })
                        .average()
                        .orElse(0);
            }
            
            // Tính tỷ lệ giao hàng đúng hạn
            double onTimeDeliveryRate = 0;
            if (!deliveredOrders.isEmpty()) {
                long onTimeDeliveries = deliveredOrders.stream()
                        .filter(order -> {
                            LocalDate expectedDeliveryDate = LocalDate.parse(order.get("expectedDeliveryDate").toString());
                            LocalDateTime updatedAt = LocalDateTime.parse(order.get("updatedAt").toString());
                            return !updatedAt.toLocalDate().isAfter(expectedDeliveryDate);
                        })
                        .count();
                
                onTimeDeliveryRate = (double) onTimeDeliveries / deliveredOrders.size() * 100;
            }
            
            DriverPerformanceDTO.DriverStatDTO driverStat = new DriverPerformanceDTO.DriverStatDTO(
                    driverId,
                    driverName,
                    driverOrders.size(),
                    deliveredOrders.size(),
                    averageDeliveryTime,
                    onTimeDeliveryRate
            );
            
            driverStats.add(driverStat);
        }
        
        DriverPerformanceDTO driverPerformance = new DriverPerformanceDTO(driverStats);
        
        // Lưu báo cáo
        saveReport("DRIVER_PERFORMANCE", Map.of(
                "driverPerformance", driverPerformance
        ), null);
        
        return driverPerformance;
    }
    
    public ReportEntity getReportById(Long reportId) {
        return reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + reportId));
    }
    
    public List<ReportEntity> getReportsByType(String reportType) {
        return reportRepository.findByReportType(reportType);
    }
    
    public List<ReportEntity> getReportsByCreatedBy(Long userId) {
        return reportRepository.findByCreatedBy(userId);
    }
    
    private ReportEntity saveReport(String reportType, Map<String, Object> reportData, Long createdBy) {
        ReportEntity report = new ReportEntity();
        report.setReportType(reportType);
        report.setReportData(reportData);
        report.setCreatedBy(createdBy);
        
        return reportRepository.save(report);
    }
    
    private LocalDateTime calculateStartDate(String period) {
        LocalDateTime now = LocalDateTime.now();
        
        return switch (period.toLowerCase()) {
            case "day" -> now.minusDays(1);
            case "week" -> now.minusWeeks(1);
            case "month" -> now.minusMonths(1);
            case "year" -> now.minusYears(1);
            default -> now.minusDays(30); // Mặc định là 30 ngày
        };
    }
    
    private List<Map<String, Object>> filterOrdersByDate(List<Map<String, Object>> orders, LocalDateTime startDate) {
        return orders.stream()
                .filter(order -> {
                    LocalDateTime createdAt = LocalDateTime.parse(order.get("createdAt").toString());
                    return createdAt.isAfter(startDate);
                })
                .collect(Collectors.toList());
    }
}