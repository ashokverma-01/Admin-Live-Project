import './newUser.scss'
import React, { useState } from "react";
import { Form, Input, Select, Button, Row, Col } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Link, useNavigate } from 'react-router-dom'

const { Option } = Select;

const Addusers = () => {
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [technology, setTechnology] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState(false);
    const Navigate = useNavigate();

    const handleSubmit = async () => {
        // Extracting the form data from state variables
        const formData = { firstname, lastname, email, technology, age, gender, phoneNumber, address };

        // Check if any field is empty
        if (!formData.firstname || !formData.lastname || !formData.email || !formData.technology || !formData.age || !formData.gender || !formData.phoneNumber || !formData.address) {
            setError(true);
            return false; // Return false if any field is empty
        }

        console.log(formData);

        try {
            let result = await fetch("http://localhost:5500/Adduser", {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!result.ok) {
                throw new Error('Failed to add user');
            }

            result = await result.json();
            console.warn(result);
            Navigate('/users')

            // Clear input fields after successful form submission
            setFirstName("");
            setLastName("");
            setEmail("");
            setTechnology("");
            setAge("");
            setGender("");
            setPhoneNumber("");
            setAddress("");

            // Reset form validation error state
            setError(false);
        } catch (error) {
            console.error("Error:", error);
            // Handle error state here if needed
        }
    };


    return (

        <div className="form-container">
            <Form onFinish={handleSubmit} layout="vertical">
                <h1 className="form-title">Add User Data</h1>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="First Name"
                            name="firstname"
                            rules={[{ required: true, message: "Please input your name!" }]}
                        >
                            <Input
                                className="input-field"
                                value={firstname}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Last Name"
                            name="lastname"
                            rules={[{ required: true, message: "Please input your lastname!" }]}
                        >
                            <Input
                                className="input-field"
                                value={lastname}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: "Please input your email!" }]}
                        >
                            <Input
                                className="input-field"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Technology"
                            name="technology"
                            rules={[{ required: true, message: "Please input your technology" }]}
                        >
                            <Input
                                className="input-field"
                                type="technology"
                                value={technology}
                                onChange={(e) => setTechnology(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Age"
                            name="age"
                            rules={[{ required: true, message: "Please input your age!" }]}
                        >
                            <Input
                                className="input-field"
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Gender"
                            name="gender"
                            rules={[
                                { required: true, message: "Please select your gender!" },
                            ]}
                        >
                            <Select
                                className="form-select"
                                value={gender}
                                onChange={(value) => setGender(value)}
                            >
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                                <Option value="other">Other</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Phone Number"
                            name="phoneNumber"
                            rules={[
                                { required: true, message: "Please input your phone number!" },
                            ]}
                        >
                            <PhoneInput
                                country={"india"}
                                className="phone-input"
                                value={phoneNumber}
                                inputStyle={{ width: '100%' }}
                                onChange={setPhoneNumber}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[
                                { required: true, message: "Please input your address!" },
                            ]}
                        >
                            <Input
                                // style={{ width: '370px' }}
                                className="input-field"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
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

export default Addusers;
