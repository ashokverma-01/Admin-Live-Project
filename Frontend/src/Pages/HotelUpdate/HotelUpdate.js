import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, Upload } from "antd"; // Import Upload component
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useParams, useNavigate } from 'react-router-dom'

const UpdateUser = ({ userId }) => {
    const [name, setName] = useState("");
    const [personName, setPersonName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [image, setImage] = useState(null); // Declare image state
    const [prevImage, setPrevImage] = useState(null); // Declare prevImage state
    const params = useParams();
    const Navigate = useNavigate();

    useEffect(() => {
        // Fetch user data based on userId when component mounts
        fetchData();
    }, []);

    const fetchData = async () => {
        console.log(params)
        let result = await fetch(`http://localhost:5500/UpdateHotelFetch/${params.id}`)
        result = await result.json();
        setName(result.name);
        setPersonName(result.personName);
        setEmail(result.email);
        setPhoneNumber(result.phoneNumber);
        setPrevImage(result.image); // Set prevImage state
    };

    const handleUpdate = async () => {
        const formData = new FormData(); // Declare formData
        if (image && image !== prevImage) {
            formData.append("image", image);
        } else {
            formData.append("prevImage", prevImage);
        }
        formData.append("name", name);
        formData.append("personName", personName);
        formData.append("email", email);
        formData.append("phoneNumber", phoneNumber);

        try {
            let result = await fetch(`http://localhost:5500/UpdateHotel/${params.id}`, {
                method: 'PUT',
                body: formData,
            });
            result = await result.json()
            console.log(result)
            Navigate('/hotelList')
        } catch (error) {
            console.error("Error:", error);
            // Handle error
        }
    };

    const handleImageChange = (info) => {
        if (info.file.status === 'done' || info.file.status === 'error') {
            const file = info.file.originFileObj;
            setImage(file);
        }
    };

    return (
        <div className="form-container">
            <Form onFinish={handleUpdate} layout="vertical">
                <h1 className="form-title">Update Hotel Data</h1>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Hotel Name" initialValue={name}>
                            <Input
                                value={name}
                                className="input-field"
                                onChange={e => setName(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Person Name" initialValue={personName}>
                            <Input
                                value={personName}
                                className="input-field"
                                onChange={e => setPersonName(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Email" initialValue={email}>
                            <Input
                                value={email}
                                className="input-field"
                                onChange={e => setEmail(e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Phone Number" initialValue={phoneNumber}>
                            <PhoneInput
                                value={phoneNumber}
                                country={"india"}
                                inputStyle={{ width: '100%' }}
                                onChange={setPhoneNumber}
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

export default UpdateUser;
