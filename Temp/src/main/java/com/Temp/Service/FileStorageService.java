package com.Temp.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String storeFile(MultipartFile file, Long candidateId) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || 
                (!contentType.equals("application/pdf") && 
                 !contentType.equals("application/msword") && 
                 !contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))) {
                throw new RuntimeException("Only PDF and Word documents are allowed");
            }

            // Generate unique filename
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = originalFilename != null && originalFilename.contains(".") ? 
                originalFilename.substring(originalFilename.lastIndexOf(".")) : ".pdf";
            String filename = "cv_" + candidateId + "_" + UUID.randomUUID().toString() + fileExtension;

            // Copy file to target location
            Path targetLocation = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return filename;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + file.getOriginalFilename() + ". Please try again!", ex);
        }
    }

    public String storeProfilePicture(MultipartFile file, Long candidateId) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Validate file type - allow images only
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("Only image files are allowed");
            }

            // Generate unique filename
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = (originalFilename != null && originalFilename.contains(".")) ? 
                originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
            String filename = "profile_" + candidateId + "_" + UUID.randomUUID().toString() + fileExtension;

            // Copy file to target location
            Path targetLocation = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return filename;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store profile picture " + file.getOriginalFilename() + ". Please try again!", ex);
        }
    }

    public String storeRecruiterProfilePicture(MultipartFile file, Long recruiterId) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Validate file type - allow images only
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new RuntimeException("Only image files are allowed");
            }

            // Generate unique filename for recruiter
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = (originalFilename != null && originalFilename.contains(".")) ? 
                originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
            String filename = "profile_recruiter_" + recruiterId + "_" + UUID.randomUUID().toString() + fileExtension;

            // Copy file to target location
            Path targetLocation = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return filename;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store recruiter profile picture " + file.getOriginalFilename() + ". Please try again!", ex);
        }
    }

    public Resource loadFileAsResource(String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + filename);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + filename, ex);
        }
    }

    public boolean deleteFile(String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            return Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file " + filename, ex);
        }
    }

    public boolean fileExists(String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            return Files.exists(filePath);
        } catch (Exception ex) {
            return false;
        }
    }
}
