import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Row, Col } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useParams, useNavigate } from 'react-router-dom'

const { Option } = Select;

const UpdateUser = ({ userId }) => {
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [technology, setTechnology] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState(null);
    const parmas = useParams();
    const Navigate = useNavigate();

    useEffect(() => {
        // Fetch user data based on userId when component mounts
        fetchData();
    }, []);

    const fetchData = async () => {
        console.log(parmas)
        let result = await fetch(`http://localhost:5500/UpdateUser/${parmas.id}`)
        result = await result.json();
        setFirstName(result.firstname);
        setLastName(result.lastname);
        setEmail(result.email);
        setTechnology(result.technology);
        setAge(result.age);
        setGender(result.gender);
        setPhoneNumber(result.phoneNumber);
        setAddress(result.address);
    };

    const handleUpdate = async () => {
        // console.log(firstname, lastname, email, technology, age, gender, phoneNumber, address)
        let result = await fetch(`http://localhost:5500/UpdateUser/${parmas.id}`, {
            method: 'put',
            body: JSON.stringify({ firstname, lastname, email, technology, age, gender, phoneNumber, address }),
            headers: {
                'Content-Type': 'Application/json'
            }
        })
        result = await result.json()
        console.log(result)
        Navigate('/users')

    }


    return (
        <div className="form-container">
            <Form onFinish={handleUpdate} layout="vertical">
                <h1 className="form-title">Update User Data</h1>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Name"
                            initialValue={firstname}

                        >
                            <Input
                                value={firstname}
                                className="input-field"
                                onChange={e => setFirstName(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Last Name"
                            initialValue={lastname}

                        >
                            <Input
                                value={lastname}
                                className="input-field"
                                onChange={e => setLastName(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Email"
                            initialValue={email}
                        // rules={[{ required: true, message: "Please input your email!" }]}
                        >
                            <Input
                                value={email}
                                className="input-field"
                                onChange={e => setEmail(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Technology"
                            initialValue={technology}
                        // rules={[{ required: true, message: "Please input your technology" }]}
                        >
                            <Input
                                value={technology}
                                className="input-field"
                                onChange={e => setTechnology(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Age"
                            initialValue={age}
                        // rules={[{ required: true, message: "Please input your age!" }]}
                        >
                            <Input
                                value={age}
                                className="input-field"
                                type="number"
                                onChange={e => setAge(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Gender" initialValue={gender}>
                            <Select
                                value={gender}
                                className="form-select"
                                onChange={(value) => setGender(value)}
                            >
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                                <Option value="other">Other</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Phone Number" initialValue={phoneNumber}>
                            <PhoneInput
                                value={phoneNumber}
                                country={"india"}
                                inputStyle={{ width: '100%' }}
                                onChange={setPhoneNumber} // Corrected onChange handler
                            />
                        </Form.Item>

                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Address"
                            initialValue={address}

                        >
                            <Input
                                className="input-field"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                            />
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

export default UpdateUser;
