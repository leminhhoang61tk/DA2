package com.transportmanagement.utility;

import java.io.IOException;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import com.lowagie.text.DocumentException;

import jakarta.servlet.http.HttpServletResponse;

public interface StorageService {

	List<String> loadAll();

	String store(MultipartFile file);

	Resource load(String fileName);

	void delete(String fileName);

}