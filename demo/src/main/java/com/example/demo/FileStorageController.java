package com.example.demo;

import jakarta.annotation.PostConstruct;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/file")
public class FileStorageController {

    private final String fileStoragePath;
    private final List<String> storageFolders;

    public FileStorageController(FileStorageProperties properties) {
        Path parentDir = Paths.get("").toAbsolutePath().getParent();
        this.fileStoragePath = parentDir.resolve("backend-files").toString();
        this.storageFolders = properties.getFolders();
    }

    @PostConstruct
    public void initializeDirectories() {
        try {
            createDirectoryIfNotExists(Paths.get(fileStoragePath));
            for (String folder : storageFolders) {
                createDirectoryIfNotExists(Paths.get(fileStoragePath, folder));
            }
            System.out.println("Directories initialized!");
        } catch (Exception e) {
            System.out.println("Failed to initialize directories: " + e.getMessage());
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type) {

        // rename files
        // type empid timestamp

        Path targetDir = getTargetDirectory(type);
        if (!"org-logos".equals(type) && !"admin-pics".equals(type) && !"leave-attachments".equals(type)) {
            return ResponseEntity.badRequest().body("Invalid file type specified.");
        }

        assert targetDir != null;
        createDirectoryIfNotExists(targetDir);

        Path targetFilePath = targetDir.resolve(Objects.requireNonNull(file.getOriginalFilename()));
        File targetFile = targetFilePath.toFile();

        try {
            file.transferTo(targetFile);
            String fileUrl = "/" + type + "/" + file.getOriginalFilename();
            return ResponseEntity.ok("File uploaded successfully: " + fileUrl);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload file: " + e.getMessage());
        }
    }

    @GetMapping("/get")
    public ResponseEntity<Resource> getFile(
            @RequestParam("type") String type,
            @RequestParam("filename") String filename) {

        Path targetDir = getTargetDirectory(type);
        if (targetDir == null) {
            return ResponseEntity.badRequest().body(null);
        }

        Path filePath = targetDir.resolve(filename);
        Resource resource;

        try {
            resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .header("Content-Disposition", "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    private Path getTargetDirectory(String type) {
        if (storageFolders.contains(type)) {
            return Paths.get(fileStoragePath, type);
        } else {
            return null;
        }
    }

    private void createDirectoryIfNotExists(Path path) {
        File directory = path.toFile();
        if (!directory.exists() && !directory.mkdirs()) {
            System.out.println("Failed to create directory: " + path);
        }
    }
}
