package com.smartshipd.reporting.repository;

import com.smartshipd.reporting.entity.ReportEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportRepository extends JpaRepository<ReportEntity, Long> {
    List<ReportEntity> findByReportType(String reportType);
    List<ReportEntity> findByCreatedBy(Long createdBy);
}