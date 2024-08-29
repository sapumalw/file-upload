'use client';
import React, { useState } from 'react';

const Home = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileType, setFileType] = useState("org-logos");

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('type', fileType);

        try {
            const response = await fetch('http://localhost:9090/api/file/upload', {
                method: 'POST',
                body: formData,
            });
            window.location.reload();
            alert("File uploaded successfully");
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error uploading file.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">File Upload Example</h1>
            <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded"
            >
                <option value="org-logos">Organization Logo</option>
                <option value="admin-pics">Super Admin Picture</option>
                <option value="leave-attachments">Leave Attachment</option>
            </select>
            <input
                type="file"
                onChange={handleFileChange}
                className="mb-4 p-2 border border-gray-300 rounded"
            />
            <button
                onClick={handleFileUpload}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
                Upload File
            </button>
        </div>
    );
};

export default Home;
