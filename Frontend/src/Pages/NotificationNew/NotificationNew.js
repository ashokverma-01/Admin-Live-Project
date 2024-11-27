import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Row, Col, Select, Checkbox } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import './NotificationNew.css'
const { Option } = Select;

const NotificationForm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [userData, setUserData] = useState([]);
    const [driverData, setDriverData] = useState([]);
    const [formData, setFormData] = useState({
        recipientType: "",
        title: "",
        messageText: "",
        selectedUsers: [],
        selectedDrivers: [],
        additionalInput: "",
        selectAllUsers: false,
        selectAllDrivers: false
    });

    useEffect(() => {
        fetchDataUser();
        fetchDataDriver();
    }, []);

    const fetchDataUser = async () => {
        try {
            const response = await fetch("http://localhost:5500/User");
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            const jsonData = await response.json();
            setUserData(jsonData); // Update state with user data
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchDataDriver = async () => {
        try {
            const response = await fetch("http://localhost:5500/Driver");
            if (!response.ok) {
                throw new Error("Failed to fetch driver data");
            }
            const jsonData = await response.json();
            setDriverData(jsonData); // Update state with driver data
        } catch (error) {
            console.error("Error fetching driver data:", error);
        }
    };
    const handleSubmit = async () => {
        try {
            if (!formData.recipientType || !formData.title || !formData.messageText) {
                message.error("Please fill all fields");
                return;
            }

            const response = await fetch('http://localhost:5500/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipientType: formData.recipientType,
                    title: formData.title,
                    messageText: formData.messageText,
                    selectedUsers: formData.selectedUsers,
                    selectedDrivers: formData.selectedDrivers
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send notification');
            }

            form.resetFields();
            setFormData({
                recipientType: "",
                title: "",
                messageText: "",
                selectedUsers: [],
                selectedDrivers: [],
                additionalInput: "",
                selectAllUsers: false
            });
            navigate('/notificationList');
            message.success("Notification sent successfully");
        } catch (error) {
            console.error("Error:", error);
            message.error("Failed to send notification");
        }
    };

    const handleFormChange = (changedValues, allValues) => {
        setFormData(allValues);
    };

    const handleSelectAllUsers = (e) => {
        const { checked } = e.target;
        const allUsers = checked ? ['all'] : [];
        const additionalInput = checked ? '' : formData.additionalInput;
        setFormData({ ...formData, selectedUsers: allUsers, selectAllUsers: checked, additionalInput });
    };

    const handleSelectAllDrivers = (e) => {
        const { checked } = e.target;
        const allDrivers = checked ? ['all'] : [];
        const additionalInput = checked ? '' : formData.additionalInput;
        setFormData({ ...formData, selectedDrivers: allDrivers, selectAllDrivers: checked, additionalInput });
    };

    return (
        <div className="notification-form-container">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={formData}
                onValuesChange={handleFormChange}
            >
                <h1 className="form-title">Send Notification</h1>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label=" Type"
                            name="recipientType"
                            rules={[{ required: true, message: "Please select recipient type" }]}
                        >
                            <Select
                                placeholder="Select recipient type"
                                onChange={(value) => setFormData({ ...formData, recipientType: value })}
                            >
                                <Option value="all">All</Option>
                                <Option value="user">User</Option>
                                <Option value="driver">Driver</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        {formData.recipientType === "user" && (
                            <Form.Item
                                label="Selected Users"
                                name="selectedUsers"
                                rules={[{ required: true, message: "Please select users" }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Select users"
                                    showSearch
                                    onChange={(values) => setFormData({ ...formData, selectedUsers: values })}
                                >
                                    {userData.map((user) => (
                                        <Option key={user._id} value={user._id}>{user.firstname}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        )}
                        {formData.recipientType === "driver" && (
                            <Form.Item
                                label="Selected Drivers"
                                name="selectedDrivers"
                                rules={[{ required: true, message: "Please select drivers" }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Select drivers"
                                    showSearch
                                    onChange={(values) => setFormData({ ...formData, selectedDrivers: values })}
                                >
                                    {driverData.map((driver) => (
                                        <Option key={driver._id} value={driver._id}>{driver.driverName}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        )}
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[{ required: true, message: "Please enter title" }]}
                        >
                            <Input placeholder="Enter title" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Message"
                            name="messageText"
                            rules={[{ required: true, message: "Please enter message" }]}
                        >
                            <Input.TextArea placeholder="Enter message" autoSize={{ minRows: 3 }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item>
                            <Button className="submit-btn" type="primary" htmlType="submit" icon={<SendOutlined />}>
                                Send Notification
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default NotificationForm;
