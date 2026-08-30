package com.emlak.backend.service.storage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

// TODO: Faz 2 / Prod geçişinde bu service AWS S3 / MinIO implementasyonu ile genişletilecek
@Service
public class LocalStorageServiceImpl implements StorageService {

    private static final Logger log = LoggerFactory.getLogger(LocalStorageServiceImpl.class);

    private final Path uploadLocation;

    public LocalStorageServiceImpl(@Value("${app.upload.dir:uploads}") String uploadDir) {
        this.uploadLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadLocation);
        } catch (IOException e) {
            throw new RuntimeException("Yükleme dizini oluşturulamadı: " + uploadLocation, e);
        }
    }

    @Override
    public String storeFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Boş dosya yüklenemez");
        }

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String extension = "";
        int extIndex = originalFilename.lastIndexOf(".");
        if (extIndex > 0) {
            extension = originalFilename.substring(extIndex);
        }

        String storedFileName = UUID.randomUUID().toString() + extension;

        try {
            Path targetLocation = this.uploadLocation.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + storedFileName;
        } catch (IOException ex) {
            log.error("Dosya kaydedilemedi: {}", storedFileName, ex);
            throw new RuntimeException("Dosya kaydedilemedi: " + storedFileName, ex);
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        if (!StringUtils.hasText(fileUrl) || !fileUrl.startsWith("/uploads/")) {
            return;
        }

        try {
            String fileName = fileUrl.substring("/uploads/".length());
            Path filePath = this.uploadLocation.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.warn("Dosya silinirken hata oluştu: {}", fileUrl, e);
        }
    }
}
