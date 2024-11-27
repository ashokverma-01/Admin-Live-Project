import { useState } from "react";
import React from "react";
import { Form, Input, Button, DatePicker, Select, message, Row, Col } from "antd";
import moment from "moment";
import './DiscountManagerNew.css'
import axios from 'axios'
import { useNavigate } from "react-router-dom"; // Import useNavigate

const { Option } = Select;

const DiscountManagerAddForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const [discountType, setDiscountType] = useState("percentage");
    const navigate = useNavigate(); // Use useNavigate hook

    const handleDiscountTypeChange = (value) => {
        setDiscountType(value);
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Send a POST request to your API endpoint
            const response = await axios.post("http://localhost:5500/AddDiscount", values);
            console.log("Form values:", values);
            console.log("Server response:", response.data);
            message.success("Discount added successfully");
            setLoading(false);
            form.resetFields();
            navigate("/discountManagerList"); 
        } catch (error) {
            console.error("Error:", error.response.data);
            message.error("Failed to add discount");
            setLoading(false);
            // navigate("/discountManagerList") // Use navigate here
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <Form
            className="form-container"
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Coupon Code"
                        name="couponCode"
                        rules={[
                            { required: true, message: "Please enter coupon code" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label="No. Of Use"
                        name="totalCoupon"
                        rules={[
                            { required: true, message: "Please enter coupon code" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Discount Type"
                        name="discountType"
                        rules={[
                            { required: true, message: "Please select discount type" },
                        ]}
                    >
                        <Select
                            placeholder="Select type"
                            onChange={handleDiscountTypeChange}
                            defaultValue="percentage"
                        >
                            <Option value="percentage">Percentage (%)</Option>
                            <Option value="flat">Flat</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label={`Discount Amount (${discountType === "percentage" ? "%" : "USD"})`}
                        name="discountAmount"
                        rules={[
                            { required: true, message: "Please enter discount amount" },
                        ]}
                    >
                        <Input
                            placeholder={`Enter discount amount (${discountType === "percentage" ? "%" : "USD"})`}
                            type="number"
                        />
                    </Form.Item>

                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label="User Type"
                        name="userType"
                        rules={[
                            { required: true, message: "Please select user type" },
                        ]}
                    >
                        <Select placeholder="Select user type">
                            <Option value="all">All Users</Option>
                            <Option value="new">New Users</Option>
                            <Option value="existing">Existing Users</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Maximum Users"
                        name="maxUsers"
                        rules={[
                            { required: true, message: "Please enter maximum Users" },
                        ]}
                    >
                        <Input type="number" addonAfter="$" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Minimum Amount"
                        name="minAmount"
                        rules={[
                            { required: true, message: "Please enter minimum amount" },
                        ]}
                    >
                        <Input type="number" addonAfter="$" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Maximum Amount"
                        name="maxAmount"
                        rules={[
                            { required: true, message: "Please enter maximum amount" },
                        ]}
                    >
                        <Input type="number" addonAfter="$" />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Start Date"
                        name="startDate"
                        rules={[
                            { required: true, message: "Please select start date" },
                        ]}
                    >
                        <DatePicker
                            format="YYYY-MM-DD"
                            disabledDate={(current) =>
                                current && current < moment().startOf("day")
                            }
                            style={{ width: '100%' }} // Adjusted width
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label="End Date"
                        name="endDate"
                        rules={[{ required: true, message: "Please select end date" }]}
                    >
                        <DatePicker
                            format="YYYY-MM-DD"
                            disabledDate={(current) =>
                                current &&
                                current <
                                moment().startOf("day").add(1, "days")
                            }
                            style={{ width: '100%' }} // Adjusted width
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col xs={24}>
                    <Form.Item>
                        <Button
                            className="submit-btn"
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            Add Discount
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default DiscountManagerAddForm;
