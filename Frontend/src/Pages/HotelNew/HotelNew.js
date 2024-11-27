import React from "react";
import { Form, Input, Button, Row, Col, message, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from 'react-router-dom';

const AddHotel = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();

            // Append file to FormData separately from other values
            if (values.image && values.image.length > 0) {
                formData.append('image', values.image[0].originFileObj);
            }

            // Append other form values to FormData
            Object.keys(values).forEach(key => {
                if (key !== 'image') {
                    formData.append(key, values[key]);
                }
            });

            const response = await fetch("http://localhost:5500/AddHotel", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to add hotel");
            }

            message.success("Hotel added successfully");
            form.resetFields();
            navigate("/hotelList");
        } catch (error) {
            console.error("Error:", error);
            message.error("Failed to add hotel");
        }
    };


    return (
        <div className="form-container">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <h1 className="form-title">Add Hotel Data</h1>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Hotel Name"
                            name="name"
                            rules={[{ required: true, message: "Please input hotel name!" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Person Name"
                            name="personName"
                            rules={[{ required: true, message: "Please input person name" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: "Please input email!" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Phone Number"
                            name="phoneNumber"
                            rules={[{ required: true, message: "Please input phone number!" }]}
                        >
                            <PhoneInput
                                country={'India'}
                                enableSearch={true}
                                inputStyle={{ width: '100%' }}
                                onChange={(value) => form.setFieldsValue({ phoneNumber: value })}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label="Image"
                            name="image"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => e.fileList}
                            rules={[{ required: true, message: "Please select an image" }]}
                        >
                            <Upload
                                beforeUpload={() => false}
                                listType="picture"
                                maxCount={1} // Assuming you want to allow only one image to be uploaded
                            >
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

export default AddHotel;
