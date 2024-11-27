import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Row, Col, Upload } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useParams, useNavigate } from 'react-router-dom';

const { Option } = Select;

const UpdatePassenger = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [image, setImage] = useState(null);
    const [prevImage, setPrevImage] = useState(null); // New state for image
    const [error, setError] = useState(null);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [params.id]); // Changed to params.id

    const fetchData = async () => {
        let result = await fetch(`http://localhost:5500/UpdatePassengerData/${params.id}`);
        result = await result.json();
        setName(result.name);
        setEmail(result.email);
        setPhoneNumber(result.phoneNumber);
        setAddress(result.address);
        setImage(result.image);
        setPrevImage(result.image);
    };

    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phoneNumber', phoneNumber);
        formData.append('address', address);
        if (image !== prevImage) {
            formData.append("image", image);
        } else {
            // If image is null or equal to the previous image, append the previous image to avoid setting it to null in the database
            formData.append("prevImage", prevImage);
        }
        let result = await fetch(`http://localhost:5500/UpdatePassenger/${params.id}`, {
            method: 'PUT',
            body: formData,
        });
        result = await result.json();
        console.log(result);
        navigate('/passengerList');
    };

    const handleImageChange = (info) => {
        if (info.file.status === 'done' || info.file.status === 'error') {
            // If file is uploaded successfully or there is an error
            const file = info.file.originFileObj;
            setImage(file); // Set the image object
        }
    };


    return (
        <div className="form-container">
            <Form onFinish={handleUpdate} layout="vertical">
                <h1 className="form-title">Update Passenger Data</h1>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label=" Name" initialValue={name}>
                            <Input className="input-field" value={name} onChange={e => setName(e.target.value)} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Email" initialValue={email}>
                            <Input className="input-field" value={email} onChange={e => setEmail(e.target.value)} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Phone Number" initialValue={phoneNumber}>
                            <PhoneInput
                                country={'us'}
                                value={phoneNumber}
                                inputStyle={{ width: '100%' }}
                                onChange={setPhoneNumber}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Address" initialValue={address}>
                            <Input className="input-field" value={address} onChange={e => setAddress(e.target.value)} />
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
                    <Button className="submit-btn" type="primary" htmlType="submit">Update</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdatePassenger;
