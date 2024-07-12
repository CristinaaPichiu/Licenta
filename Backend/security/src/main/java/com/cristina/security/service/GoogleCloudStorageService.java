package com.cristina.security.service;


import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class GoogleCloudStorageService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleCloudStorageService.class);

    private final Storage storage = StorageOptions.getDefaultInstance().getService();


    @Value("${google.cloud.storage.bucket}")
    private String bucketName;

    @Value("${google.cloud.storage.profile-bucket}")
    private String profileBucketName;

    @Value("${google.cloud.credentials.file.path}")
    private String credentialsPath;

    private Storage getStorage() throws IOException {
        GoogleCredentials credentials = GoogleCredentials.fromStream(new FileInputStream(credentialsPath));
        return StorageOptions.newBuilder().setCredentials(credentials).build().getService();
    }

    public String uploadFile(String filePath, String fileName) throws IOException {
        Storage storage = getStorage();
        BlobId blobId = BlobId.of(bucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
        storage.create(blobInfo, new FileInputStream(filePath));
        return blobId.getName();
    }

    public byte[] downloadFile(String fileName) throws IOException {
        Storage storage = getStorage();
        Blob blob = storage.get(BlobId.of(bucketName, fileName));
        if (blob == null) {
            throw new IOException("No such object");
        }
        return blob.getContent();
    }

    public void deleteFile(String bucketName, String objectName) {
        try {
            Storage storage = getStorage();
            BlobId blobId = BlobId.of(bucketName, objectName);
            boolean deleted = storage.delete(blobId);
            if (!deleted) {
                throw new RuntimeException("Failed to delete file: " + objectName);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file due to IO exception: " + objectName, e);
        }
    }

    public String uploadProfilePicture(String filePath, String fileName) throws IOException {
        Storage storage = getStorage();
        BlobId blobId = BlobId.of(profileBucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
        try (InputStream inputStream = new FileInputStream(filePath)) {
            storage.create(blobInfo, inputStream);
        }
        return blobId.getName();
    }



    public String getProfilePictureUrl(String fileName) {
        return "https://storage.googleapis.com/" + profileBucketName + "/" + fileName;
    }

    public void deleteFile(String objectName) {
        try {
            Storage storage = getStorage();
            BlobId blobId = BlobId.of(profileBucketName, objectName);
            boolean deleted = storage.delete(blobId);
            if (!deleted) {
                throw new RuntimeException("Failed to delete file: " + objectName);
            }
            logger.info("File deleted successfully: {}", objectName);
        } catch (IOException e) {
            logger.error("Failed to delete file due to IO exception: {}", objectName, e);
            throw new RuntimeException("Failed to delete file due to IO exception: " + objectName, e);
        }
    }



}
