package com.smartshipd.tracking.repository;

import com.smartshipd.tracking.document.TrackingDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface TrackingRepository extends MongoRepository<TrackingDocument, String> {
    List<TrackingDocument> findByOrderIdOrderByTimestampDesc(Long orderId);
    Optional<TrackingDocument> findFirstByOrderIdOrderByTimestampDesc(Long orderId);
}