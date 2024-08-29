# File Upload Mechanism

### We have different methods to save files:
- File System Storage
- Database Storage (BLOBs)
- Object Storage
- Network File System
- Content Delivery Networks

### Based on our requirements, we are using the file system storage mechanism.
The backend initializes the folder structure according to the file types specified in the `application.yml` file. The frontend sends the file to the backend, where it is saved on the server. When the frontend requests a file, the backend serves the file as a blob.

### TODO
- Implement file renaming when saving to ensure uniqueness.
- Create a permission mechanism for file access (e.g., only the user who uploaded the file can access it, and super admins can access all files).
