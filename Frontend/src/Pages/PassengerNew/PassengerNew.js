import './PassengerNew.css'
import React, { useState } from "react";
import { Form, Input, Select, Button, Row, Col, message, Upload } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from 'react-router-dom'
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const AddPassenger = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        driverName: "",
        licenseNumber: "",
        phoneNumber: "",
        address: "",
        image: [] // Initialize image as an empty array
    });

    const handleSubmit = async () => {
        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append("name", formData.name);
            formDataToSubmit.append("email", formData.email);
            formDataToSubmit.append("phoneNumber", formData.phoneNumber);
            formDataToSubmit.append("address", formData.address);
            formDataToSubmit.append("image", formData.image[0]?.originFileObj); // Access originFileObj of the File object

            const response = await fetch("http://localhost:5500/AddPassenger", {
                method: "POST",
                body: formDataToSubmit,
            });

            if (!response.ok) {
                throw new Error("Failed to add passenger");
            }

            message.success("Passenger added successfully");
            form.resetFields();
            navigate("/passengerList");
        } catch (error) {
            console.error("Error:", error);
            message.error("Failed to add passenger");
        }
    };

    const handleFormChange = (changedValues, allValues) => {
        setFormData(allValues);
    };

    return (
        <div className="form-container">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={formData}
                onValuesChange={handleFormChange}
            >
                <h1 className="form-title">Add Passenger</h1>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: "Please input passenger name!" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: "Please input email" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Phone Number"
                            name="phoneNumber"
                            rules={[
                                { required: true, message: "Please input your phone number!" },
                            ]}
                        >
                            <PhoneInput inputStyle={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[{ required: true, message: "Please input address!" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                </Row>
                <Row gutter={16}>
                    <Col span={24}>
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
                <Form.Item>
                    <Button className="submit-btn" type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddPassenger;
