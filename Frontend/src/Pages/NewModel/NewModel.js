import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NewModel.css'
const { Option } = Select;

const AddModelForm = () => {
    const [model, setModel] = useState('');
    const [brandId, setBrandId] = useState('');
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5500/brands');
            if (response && response.data) {
                setBrands(response.data);
            } else {
                console.error('Invalid response format:', response);
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:5500/AddModel', {
                model,
                brandId, // Send brand ID instead of brand name
            });

            console.log(response.data);
            // Handle success, e.g., show a success message or redirect to another page
            navigate('/model');
        } catch (error) {
            console.error('Error adding model:', error);
            // Handle error, e.g., show an error message to the user
        }
    };

    return (
        <div className="new-car-form-container">
            <Form onFinish={handleSubmit} layout="vertical">
                <Form.Item
                    label="Model"
                    name="model"
                    rules={[{ required: true, message: 'Please enter the model!' }]}
                >
                    <Input value={model} onChange={(e) => setModel(e.target.value)} />
                </Form.Item>

                <Form.Item
                    label="Brand"
                    name="brandId"
                    rules={[{ required: true, message: 'Please select a brand!' }]}
                >
                    <Select
                        value={brandId}
                        onChange={(value) => setBrandId(value)}
                        loading={loading}
                    >
                        {brands.map((brand) => (
                            <Option key={brand._id} value={brand._id}>
                                {brand.brand}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" className='submit-btn' htmlType="submit">
                        Add Model
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddModelForm;
