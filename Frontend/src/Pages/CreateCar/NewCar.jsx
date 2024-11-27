import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, message, Row, Col, Select, Upload } from "antd";
import "./newCar.scss";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const NewCar = () => {
  const [form] = Form.useForm(); // Initialize form instance
  const navigate = useNavigate();
  const [formData, setFormData] = useState({}); // Initialize form data state

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);


  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('modelId', values.model);
      formData.append('brandId', values.brand);
      formData.append('variantId', values.variant);
      formData.append('year', values.year);
      formData.append('carName', values.carName);
      formData.append('price', values.price);
      formData.append('color', values.color);
      formData.append('registrationDate', values.registrationDate.format('YYYY-MM-DD'));
      formData.append('image', values.image[0].originFileObj);

      const response = await fetch('http://localhost:5500/Addcar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add new car');
      }

      message.success('New car added successfully');
      // Optionally, you can redirect to another page after successful submission
      navigate('/cars'); // Redirect to the cars page
    } catch (error) {
      console.error('Submission failed:', error);
      message.error('Failed to add new car');
    }
  };

  // Fetch brands from the server
  const fetchBrands = async () => {
    try {
      const response = await fetch("http://localhost:5500/brands");
      if (!response.ok) {
        throw new Error("Failed to fetch brands");
      }
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
      message.error("Failed to fetch brands");
    }
  };

  // Fetch models based on selected brand
  const fetchModels = async (brandId) => {
    try {
      const response = await fetch(`http://localhost:5500/models?brandId=${brandId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch models");
      }
      const data = await response.json();
      setModels(data);
    } catch (error) {
      console.error("Error fetching models:", error);
      message.error("Failed to fetch models");
    }
  };

  // Fetch variants based on selected model
  const fetchVariants = async (modelId) => {
    try {
      const response = await fetch(`http://localhost:5500/variants?modelId=${modelId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch variants");
      }
      const data = await response.json();
      setVariants(data);
    } catch (error) {
      console.error("Error fetching variants:", error);
      message.error("Failed to fetch variants");
    }
  };



  useEffect(() => {
    fetchBrands();
  }, []);

  // Handle change in brand selection
  const handleBrandChange = async (brandId) => {
    try {
      if (brandId) {
        fetchModels(brandId);
      } else {
        setModels([]);
      }
    } catch (error) {
      console.error('Error handling brand change:', error);
    }
  };

  // Handle change in model selection
  const handleModelChange = async (modelId) => {
    try {
      if (modelId) {
        fetchVariants(modelId);
      } else {
        setVariants([]);
      }
    } catch (error) {
      console.error('Error handling model change:', error);
    }
  };

  // Handle form value change
  const handleFormChange = (changedValues, allValues) => {
    setFormData(allValues);
  };

  // Handle date change
  const handleDateChange = (date) => {
    setFormData({ ...formData, registrationDate: date });
  };

  return (
    <div className="form-container">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={formData}
        onValuesChange={handleFormChange}
      >
        <h1>Add New Car</h1>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Brands"
              name="brand"
              rules={[{ required: true, message: "Please select brand" }]}
            >
              <Select onChange={handleBrandChange}>
                {brands.map((brand) => (
                  <Option key={brand._id} value={brand._id}>
                    {brand.brand}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Models"
              name="model"
              rules={[{ required: true, message: "Please select model" }]}
            >
              <Select onChange={handleModelChange}>
                {models.map((model) => (
                  <Option key={model._id} value={model._id}>
                    {model.model}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Variant"
              name="variant"
              rules={[{ required: true, message: "Please select variant" }]}
            >
              <Select>
                {variants.map((variant) => (
                  <Option key={variant._id} value={variant._id}>
                    {variant.variant}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Year"
              name="year"
              rules={[{ required: true, message: "Please enter year" }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please enter price" }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Color"
              name="color"
              rules={[{ required: true, message: "Please enter color" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Car Name"
              name="carName"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Registration Date"
              name="registrationDate"
              rules={[{ required: true, message: "Please select registration date" }]}
            >
              <DatePicker onChange={handleDateChange} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Image"
              name="image"
              rules={[{ required: true, message: "Please select an image" }]}
              valuePropName="fileList"
              getValueFromEvent={(e) => e.fileList}
            >
              <Upload beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item>
              <Button className="submit-btn" type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default NewCar;
