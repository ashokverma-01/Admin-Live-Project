import './NewDriver.scss'
import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Row, Col, message, Upload } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from 'react-router-dom'
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const AddDriver = () => {
    const [form] = Form.useForm();
    const [cars, setCars] = useState([]);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        driverName: "",
        licenseNumber: "",
        phoneNumber: "",
        email: "",
        address: "",
        image: [] // Initialize image as an empty array
    });

    const handleSubmit = async () => {
        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append("driverName", formData.driverName);
            formDataToSubmit.append("licenseNumber", formData.licenseNumber);
            formDataToSubmit.append("phoneNumber", formData.phoneNumber);
            formDataToSubmit.append("email", formData.email);
            formDataToSubmit.append("carId", formData.car);
            formDataToSubmit.append("address", formData.address);
            formDataToSubmit.append("image", formData.image[0]?.originFileObj); // Access originFileObj of the File object

            const response = await fetch("http://localhost:5500/AddDriver", {
                method: "POST",
                body: formDataToSubmit,
            });

            if (!response.ok) {
                throw new Error("Failed to add Driver");
            }

            message.success("Driver added successfully");
            form.resetFields();
            navigate("/drivers");
        } catch (error) {
            console.error("Error:", error);
            message.error("Failed to add Driver");
        }
    };

    useEffect(() => {
        fetchCars(); // Fetch drivers when component mounts
    }, []);
    const fetchCars = async () => {
        try {
            const response = await fetch(`http://localhost:5500/Car`);
            if (!response.ok) {
                throw new Error("Failed to fetch cars");
            }
            const data = await response.json();
            setCars(data);
        } catch (error) {
            console.error("Error fetching cars:", error);
            message.error("Failed to fetch cars");
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
                <h1 className="form-title">Add Driver</h1>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Driver Name"
                            name="driverName"
                            rules={[{ required: true, message: "Please input driver name!" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="License Number"
                            name="licenseNumber"
                            rules={[{ required: true, message: "Please input license number!" }]}
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
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "Please input your email!" },
                            ]}
                        >
                            <Input />
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
                    <Col span={12}>
                        <Form.Item
                            label="Cars"
                            name="car"
                            rules={[{ required: true, message: "Please select car" }]}
                        >
                            <Select>
                                {cars.map((car) => (
                                    <Option key={car._id} value={car._id}>
                                        {car.carName}
                                    </Option>
                                ))}
                            </Select>
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

export default AddDriver;
