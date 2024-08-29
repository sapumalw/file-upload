'use client';
import React, { useState } from 'react';

const Home = () => {
    const [fileType, setFileType] = useState("org-logos");
    const [fileName, setFileName] = useState("");
    const [fileUrl, setFileUrl] = useState(null);

    const handleFileTypeChange = (event) => {
        setFileType(event.target.value);
        setFileUrl(null); // Clear the displayed file when type changes
    };

    const handleFileNameChange = (event) => {
        setFileName(event.target.value);
    };

    const handleFetchFile = async () => {
        if (!fileName) {
            alert("Please enter a file name!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:9090/api/file/get?type=${fileType}&filename=${fileName}`);
            if (response.ok) {
                const fileBlob = await response.blob();
                const url = URL.createObjectURL(fileBlob);
                setFileUrl(url);
            } else {
                alert("File not found.");
                setFileUrl(null);
            }
        } catch (error) {
            console.error("Error fetching file:", error);
            alert("Error fetching file.");
            setFileUrl(null);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">Fetch File Example</h1>
            <select
                value={fileType}
                onChange={handleFileTypeChange}
                className="mb-4 p-2 border border-gray-300 rounded"
            >
                <option value="org-logos">Organization Logo</option>
                <option value="admin-pics">Super Admin Picture</option>
                <option value="leave-attachments">Leave Attachment</option>
            </select>
            <input
                type="text"
                placeholder="Enter file name"
                value={fileName}
                onChange={handleFileNameChange}
                className="mb-4 p-2 border border-gray-300 rounded"
            />
            <button
                onClick={handleFetchFile}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
                Fetch File
            </button>

            <div className="mt-8">
                {fileUrl && (
                    <img src={fileUrl} alt="Fetched file" className="max-w-full h-auto" />
                )}
            </div>
        </div>
    );
};

export default Home;
