import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './NewVarient.scss';
const { Option } = Select;

const AddVariantForm = () => {
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Use navigate as a function

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const brandsResponse = await axios.get('http://localhost:5500/brands');
            if (brandsResponse && brandsResponse.data) {
                setBrands(brandsResponse.data);
                setLoading(false);
            } else {
                console.error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
            message.error('Failed to fetch brands');
        }
    };

    const fetchModels = async (brandId) => {
        try {
            const modelsResponse = await axios.get(`http://localhost:5500/models?brandId=${brandId}`);
            if (modelsResponse && modelsResponse.data) {
                setModels(modelsResponse.data); // Update models state here
            } else {
                console.error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching models:', error);
            message.error('Failed to fetch models');
        }
    };

    const handleBrandChange = async (e) => {
        try {
            console.log(e);
            if (e) {
                fetchModels(e);
            } else {
                setModels([]);
            }
        } catch (error) {
            console.error('Error handling brand change:', error);
        }
    };


    const onFinish = async (values) => {
        try {
            const response = await axios.post('http://localhost:5500/variants', {
                variant: values.variant,
                brandId: values.brandId,
                modelId: values.modelId
            });
            console.log(response.data);
            message.success('Variant added successfully');
            navigate('/varients'); // Navigate to the variants page after successful addition
        } catch (error) {
            console.error('Error adding variant:', error);
            message.error('Failed to add variant');
        }
    };

    return (
        <div className='new-car-form-container'>
            {!loading && (
                <Form onFinish={onFinish} layout="vertical">
                    <Form.Item
                        label="Variant"
                        name="variant"
                        rules={[{ required: true, message: 'Please enter the variant' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Brand"
                        name="brandId"
                        rules={[{ required: true, message: 'Please select a brand' }]}
                    >
                        <Select onChange={handleBrandChange}>
                            {brands.map((brand) => (
                                <Option key={brand._id} value={brand._id}>
                                    {brand.brand}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>


                    <Form.Item
                        label="Model"
                        name="modelId"
                        rules={[{ required: true, message: 'Please select a model' }]}
                    >
                        <Select>
                            {models.map((model) => (
                                <Option key={model._id} value={model._id}>
                                    {model.model}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" style={{ width: '100%' }} htmlType="submit">
                            Add Variant
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </div>
    );
};

export default AddVariantForm;
