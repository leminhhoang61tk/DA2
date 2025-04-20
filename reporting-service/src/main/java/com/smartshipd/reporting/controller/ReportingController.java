package com.smartshipd.reporting.controller;

import com.smartshipd.common.dto.ApiResponse;
import com.smartshipd.reporting.dto.DriverPerformanceDTO;
import com.smartshipd.reporting.dto.OrderStatisticsDTO;
import com.smartshipd.reporting.entity.ReportEntity;
import com.smartshipd.reporting.service.ReportingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
public class ReportingController {
    
    private final ReportingService reportingService;
    
    @Autowired
    public ReportingController(ReportingService reportingService) {
        this.reportingService = reportingService;
    }
    
    @GetMapping("/orders/statistics")
    public ResponseEntity<ApiResponse<OrderStatisticsDTO>> generateOrderStatistics(
            @RequestParam(defaultValue = "month") String period) {
        try {
            OrderStatisticsDTO statistics = reportingService.generateOrderStatistics(period);
            return ResponseEntity.ok(ApiResponse.success(statistics));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/drivers/performance")
    public ResponseEntity<ApiResponse<DriverPerformanceDTO>> generateDriverPerformance() {
        try {
            DriverPerformanceDTO performance = reportingService.generateDriverPerformance();
            return ResponseEntity.ok(ApiResponse.success(performance));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/{reportId}")
    public ResponseEntity<ApiResponse<ReportEntity>> getReportById(@PathVariable Long reportId) {
        try {
            ReportEntity report = reportingService.getReportById(reportId);
            return ResponseEntity.ok(ApiResponse.success(report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/type/{reportType}")
    public ResponseEntity<ApiResponse<List<ReportEntity>>> getReportsByType(@PathVariable String reportType) {
        List<ReportEntity> reports = reportingService.getReportsByType(reportType);
        return ResponseEntity.ok(ApiResponse.success(reports));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ReportEntity>>> getReportsByCreatedBy(@PathVariable Long userId) {
        List<ReportEntity> reports = reportingService.getReportsByCreatedBy(userId);
        return ResponseEntity.ok(ApiResponse.success(reports));
    }
}