import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, Upload, Image } from "antd";
import { useParams, useNavigate } from 'react-router-dom';

const Bannerupdate = () => {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);
    const [prevImage, setPrevImage] = useState(null); // State to store the previous image URL
    const [error, setError] = useState(null);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch brand data based on brandId when component mounts
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:5500/UpdateBanner/${params.id}`);
            const data = await response.json();
            setTitle(data.title);
            setImage(data.image);
            setPrevImage(data.image); // Set the previous image URL
        } catch (error) {
            setError(error.message);
        }
    };
    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append("title", title);
            // Check if the image is not null and it's not equal to the previous image
            if (image !== prevImage) {
                formData.append("image", image);
            } else {
                // If image is null or equal to the previous image, append the previous image to avoid setting it to null in the database
                formData.append("prevImage", prevImage);
            }

            const response = await fetch(`http://localhost:5500/UpdateBanner/${params.id}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to update banner");
            }

            navigate('/bannerList');
        } catch (error) {
            setError(error.message);
        }
    }



    const handleImageChange = (info) => {
        if (info.file.status === 'done' || info.file.status === 'error') {
            // If file is uploaded successfully or there is an error
            const file = info.file.originFileObj;
            setImage(file); // Set the image object
        }
    };



    return (
        <div className="new-car-form-container">
            <Form onFinish={handleUpdate} layout="vertical">
                <h1 className="form-title">Update Banner Data</h1>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Banner Title">
                            <Input
                                value={title}
                                className="input-field"
                                onChange={e => setTitle(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Image">
                            <Upload onChange={handleImageChange}>
                                <Button>Upload</Button>
                            </Upload>
                            {(image || prevImage) && (
                                <div>
                                    <img src={`http://localhost:5500/${image || prevImage}`} alt="Uploaded" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />

                                </div>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Button className="submit-btn" type="primary" htmlType="submit"> Update </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Bannerupdate;
