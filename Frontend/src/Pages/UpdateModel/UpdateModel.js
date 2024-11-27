import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Row, Col, message } from "antd";
import { useParams, useNavigate } from 'react-router-dom';

const { Option } = Select;

const UpdateModel = () => {
    const [model, setModel] = useState("");
    const [brand, setBrand] = useState("");
    const [brandsList, setBrandsList] = useState([]);
    const [error, setError] = useState(null);
    const params = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        fetchData();
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await fetch("http://localhost:5500/brands");
            if (!response.ok) {
                throw new Error("Failed to fetch brands");
            }
            const data = await response.json();
            setBrandsList(data);
        } catch (error) {
            console.error("Error fetching brands:", error);
            message.error("Failed to fetch brands");
        }
    };

    const fetchData = async () => {
        try {
            let result = await fetch(`http://localhost:5500/UpdateModel/${params.id}`);
            if (!result.ok) {
                throw new Error("Failed to fetch model data");
            }
            result = await result.json();
            setModel(result.model);
            setBrand(result.brand._id); // Update to set the brand ID instead of the entire brand object
        } catch (error) {
            setError(error.message);
        }
    };

    const handleUpdate = async () => {
        try {
            // Validate if model and brand are not empty
            if (!model || !brand) {
                throw new Error("Model and brand are required");
            }

            // Find the selected brand object based on the brand ID
            const selectedBrand = brandsList.find(brandObj => brandObj._id === brand);
            if (!selectedBrand) {
                throw new Error("Invalid brand selected");
            }

            // Construct the request body
            const requestBody = {
                model,
                brand: selectedBrand._id // Send the brand ID instead of the brand name
            };

            // Make the PUT request to update the model
            const response = await fetch(`http://localhost:5500/UpdateModel/${params.id}`, {
                method: 'PUT',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Check if the request was successful
            if (!response.ok) {
                throw new Error("Failed to update model data");
            }

            // Parse the response JSON
            const result = await response.json();
            console.log(result);

            // Navigate to the model page upon successful update
            navigate('/model');
        } catch (error) {
            setError(error.message);
        }
    };



    return (
        <div className="new-car-form-container">
            <Form onFinish={handleUpdate} layout="vertical">
                <h1 className="form-title">Update Model Data</h1>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Model Name"
                            initialValue={model}
                        >
                            <Input className="input-field" value={model} onChange={e => setModel(e.target.value)} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Brand" initialValue={brand}>
                            {/* Conditional rendering to ensure brandsList is populated */}
                            {brandsList.length > 0 && (
                                <Select
                                    className="input-field"
                                    value={brand}
                                    onChange={(value) => setBrand(value)}
                                >
                                    {brandsList.map(brand => (
                                        <Option key={brand._id} value={brand._id}>
                                            {brand.brand}
                                        </Option>
                                    ))}
                                </Select>
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

export default UpdateModel;
