import React, { useState } from "react";
import { Form, Input, Button, message, Row, Col, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons"; // Import UploadOutlined icon
import { useNavigate } from "react-router-dom";
import "./NewBrand.scss";

const NewBrand = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        brand: "",
        description: "",
        image: [] // State variable to hold image file
    });

    const handleSubmit = async () => {
        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append("brand", formData.brand);
            formDataToSubmit.append("description", formData.description);
            formDataToSubmit.append("image", formData.image[0]?.originFileObj); // Append image file to form data

            const response = await fetch("http://localhost:5500/AddBrand", {
                method: "POST",
                body: formDataToSubmit // Send form data with image file
            });

            if (!response.ok) {
                throw new Error("Failed to add brand");
            }

            message.success("Brand added successfully");
            form.resetFields();
            navigate("/brands");
        } catch (error) {
            console.error("Error:", error);
            message.error("Failed to add brand");
        }
    };

    const handleFormChange = (changedValues, allValues) => {
        setFormData(allValues);
    };



    return (
        <div className="new-car-form-container">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={formData}
                onValuesChange={handleFormChange}
            >
                <h1 className="form-title">Add New Brand</h1>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Brand Name"
                            name="brand"
                            rules={[{ required: true, message: "Please enter brand" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: "Please enter description" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Image"
                            name="image"
                            rules={[{ required: true, message: "Please select an image" }]}
                            valuePropName="fileList"
                            getValueFromEvent={(e) => e.fileList}
                        >
                            <Upload beforeUpload={() => false}>
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item>
                            <Button className="submit-btn2" type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default NewBrand;
