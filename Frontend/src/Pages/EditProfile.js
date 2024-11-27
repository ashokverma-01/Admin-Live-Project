import React, { useState } from "react";
import { Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const UploadFile = () => {
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);

    const handleUpload = async ({ file }) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch("http://localhost:5500/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload file.");
            }

            const data = await response.json();
            setImageUrl(data.imagePath); // Set imageUrl to the path of the uploaded image
            message.success("File uploaded successfully.");
        } catch (error) {
            console.error("Error uploading file:", error);
            message.error("Failed to upload file.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <Upload
                name="file"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={(e) => handleUpload(e)}
            >
                <Button icon={<UploadOutlined />} loading={uploading}>
                    Choose File
                </Button>
            </Upload>
            {imageUrl && (
                <div>
                    <p>Uploaded Image:</p>
                    <img src={`http://localhost:5500/${imageUrl}`} alt="Uploaded" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                </div>
            )}

        </div>
    );
};

export default UploadFile;
