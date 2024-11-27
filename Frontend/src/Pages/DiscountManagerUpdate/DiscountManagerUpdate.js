import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Row, Col, DatePicker } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useParams, useNavigate } from 'react-router-dom'
import moment from 'moment'

const { Option } = Select;

const UpdateDiscount = ({ discountId }) => {
    const [couponCode, setCouponCode] = useState("");
    const [totalCoupon, setTotalCoupon] = useState("");
    const [discountType, setDiscountType] = useState("percentage");
    const [discountAmount, setDiscountAmount] = useState("");
    const [userType, setUserType] = useState("all");
    const [maxUsers, setMaxUsers] = useState("");
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");
    const [startDate, setStartDate] = useState(null); // Changed initial value to null
    const [endDate, setEndDate] = useState(null); // Changed initial value to null
    const [error, setError] = useState(null);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch discount data based on discountId when component mounts
        fetchDiscountData();
    }, []);

    const fetchDiscountData = async () => {
        try {
            const response = await fetch(`http://localhost:5500/discountUpdateFetch/${params.id}`);
            const data = await response.json();
            setCouponCode(data.couponCode);
            setTotalCoupon(data.totalCoupon);
            setDiscountType(data.discountType);
            setDiscountAmount(data.discountAmount);
            setUserType(data.userType);
            setMaxUsers(data.maxUsers);
            setMinAmount(data.minAmount);
            setMaxAmount(data.maxAmount);
            setStartDate(data.startDate);
            setEndDate(data.endDate);
        } catch (error) {
            console.error("Error fetching discount data:", error);
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:5500/discountUpdate/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    couponCode,
                    totalCoupon,
                    discountType,
                    discountAmount,
                    userType,
                    maxUsers,
                    minAmount,
                    maxAmount,
                    startDate,
                    endDate
                })
            });
            const data = await response.json();
            console.log("Discount updated successfully:", data);
            navigate('/discountManagerList'); // Redirect to discounts page after update
        } catch (error) {
            console.error("Error updating discount:", error);
            setError(error.message || "Failed to update discount");
        }
    };

    return (
        <div className="form-container">
            <Form onFinish={handleUpdate} layout="vertical">
                <h1 className="form-title">Update Discount Data</h1>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Coupon Code" initialValue={couponCode}>
                            <Input
                                value={couponCode}
                                className="input-field"
                                onChange={e => setCouponCode(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="No. Of Use" initialValue={totalCoupon}>
                            <Input
                                value={totalCoupon}
                                className="input-field"
                                type="number"
                                onChange={e => setTotalCoupon(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Discount Type" initialValue={discountType}>
                            <Select
                                value={discountType}
                                className="form-select"
                                onChange={value => setDiscountType(value)}
                            >
                                <Option value="percentage">Percentage (%)</Option>
                                <Option value="flat">Flat</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={`Discount Amount (${discountType === "percentage" ? "%" : "$"})`}
                            initialValue={discountAmount}
                        >
                            <Input
                                value={discountAmount}
                                className="input-field"
                                type="number"
                                onChange={e => setDiscountAmount(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="User Type" initialValue={userType}>
                            <Select
                                value={userType}
                                className="form-select"
                                onChange={value => setUserType(value)}
                            >
                                <Option value="all">All Users</Option>
                                <Option value="new">New Users</Option>
                                <Option value="existing">Existing Users</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Maximum Users" initialValue={maxUsers}>
                            <Input
                                value={maxUsers}
                                className="input-field"
                                type="number"
                                onChange={e => setMaxUsers(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Minimum Amount" initialValue={minAmount}>
                            <Input
                                value={minAmount}
                                className="input-field"
                                type="number"
                                onChange={e => setMinAmount(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Maximum Amount" initialValue={maxAmount}>
                            <Input
                                value={maxAmount}
                                className="input-field"
                                type="number"
                                onChange={e => setMaxAmount(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Start Date" initialValue={startDate}>
                            <DatePicker
                                value={startDate ? moment(startDate) : null} // Add moment for date format
                                className="input-field"
                                onChange={date => setStartDate(date ? date.toISOString() : null)} // Convert date to ISO string
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="End Date" initialValue={endDate}>
                            <DatePicker
                                value={endDate ? moment(endDate) : null} // Add moment for date format
                                className="input-field"
                                onChange={date => setEndDate(date ? date.toISOString() : null)} // Convert date to ISO string
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Button className="submit-btn" type="primary" htmlType="submit">Update Discount</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdateDiscount;
