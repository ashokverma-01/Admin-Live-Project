import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, message, Select, Upload } from "antd";
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
const { Option } = Select;

const CarUpdate = () => {
  const [brandOptions, setBrandOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const [varientOptions, setVarientOptions] = useState([]);
  const [driverOptions, setDriverOptions] = useState([]);
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [carName, setCar] = useState("");
  const [price, setPrice] = useState("");
  const [registrationDate, setRegistrationDate] = useState("");
  const [image, setImage] = useState(null);
  const [prevImage, setPrevImage] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedVarient, setSelectedVarient] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [error, setError] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm(); // Get the form instance

  useEffect(() => {
    fetchData();
    fetchBrands();
    fetchDrivers();
  }, []);

  const fetchData = async () => {
    try {
      let result = await fetch(`http://localhost:5500/UpdateCars/${params.id}`);
      if (!result.ok) {
        throw new Error("Failed to fetch car data");
      }
      result = await result.json();
      setSelectedBrand(result.brand);
      setSelectedModel(result.model);
      setSelectedVarient(result.variant);
      setSelectedDriver(result.driver);
      setYear(result.year);
      setCar(result.carName);
      setColor(result.color);
      setPrice(result.price);
      setRegistrationDate(result.registrationDate);
      setImage(result.image);
      setPrevImage(result.image);

      fetchModels(result.brand);
      fetchVariants(result.model);

      // Set form fields after data is fetched
      form.setFieldsValue({
        brand: result.brand,
        model: result.model,
        variant: result.variant,
        driver: result.driver,
        year: result.year,
        carName: result.carName,
        color: result.color,
        price: result.price,
        registrationDate: moment(result.registrationDate, 'YYYY-MM-DD'),
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch("http://localhost:5500/brands");
      if (!response.ok) {
        throw new Error("Failed to fetch brands");
      }
      const data = await response.json();
      setBrandOptions(data);
    } catch (error) {
      console.error("Error fetching brands:", error);
      message.error("Failed to fetch brands");
    }
  };

  const fetchModels = async (selectedBrand) => {
    try {
      const response = await fetch(`http://localhost:5500/models?brandId=${selectedBrand}`);
      if (!response.ok) {
        throw new Error("Failed to fetch models");
      }
      const data = await response.json();
      setModelOptions(data);
    } catch (error) {
      console.error("Error fetching models:", error);
      message.error("Failed to fetch models");
    }
  };

  const fetchVariants = async (selectedModel) => {
    try {
      const response = await fetch(`http://localhost:5500/variants?modelId=${selectedModel}`);
      if (!response.ok) {
        throw new Error("Failed to fetch variants");
      }
      const data = await response.json();
      setVarientOptions(data);
    } catch (error) {
      console.error("Error fetching variants:", error);
      message.error("Failed to fetch variants");
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await fetch(`http://localhost:5500/Driver`);
      if (!response.ok) {
        throw new Error("Failed to fetch drivers");
      }
      const data = await response.json();
      setDriverOptions(data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      message.error("Failed to fetch drivers");
    }
  };
  const handleBrandChange = (value) => {
    setSelectedBrand(value);
    fetchModels(value);
  };

  const handleModelChange = (value) => {
    setSelectedModel(value);
    fetchVariants(value);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("brand", selectedBrand);
      formData.append("model", selectedModel);
      formData.append("variant", selectedVarient);
      formData.append("year", year);
      formData.append("carName", carName);
      formData.append("color", color);
      formData.append("price", price);
      formData.append("registrationDate", registrationDate);
      if (image !== prevImage) {
        formData.append("image", image);
      } else {
        // If image is null or equal to the previous image, append the previous image to avoid setting it to null in the database
        formData.append("prevImage", prevImage);
      }

      let result = await fetch(`http://localhost:5500/UpdateCar/${params.id}`, {
        method: 'PUT',
        body: formData,
      });
      if (!result.ok) {
        throw new Error("Failed to update car data");
      }
      result = await result.json();
      console.log(result);
      message.success("Car data updated successfully");
      navigate('/cars');
    } catch (error) {
      setError(error.message);
    }
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
      <Form form={form} onFinish={handleUpdate} layout="vertical">
        <h1 className="form-title">Update Car Data</h1>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Brand" name="brand">
              <Select
                className="input-field"
                value={selectedBrand}
                onChange={handleBrandChange}
              >
                {brandOptions.map(brand => (
                  <Option key={brand._id} value={brand._id}>
                    {brand.brand}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Model" name="model">
              <Select
                className="input-field"
                value={selectedModel}
                onChange={handleModelChange}
              >
                {modelOptions.map(model => (
                  <Option key={model._id} value={model._id}>
                    {model.model}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Variant" name="variant">
              <Select
                className="input-field"
                value={selectedVarient}
                onChange={(value) => setSelectedVarient(value)}
              >
                {varientOptions.map(variant => (
                  <Option key={variant._id} value={variant._id}>
                    {variant.variant}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Year" name="year">
              <Input type="number" className="input-field" value={year} onChange={e => setYear(e.target.value)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Price" name="price">
              <Input type="number" className="input-field" value={price} onChange={e => setPrice(e.target.value)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Color" name="color">
              <Input className="input-field" value={color} onChange={e => setColor(e.target.value)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Car Name" name="carName">
              <Input className="input-field" value={color} onChange={e => setCar(e.target.value)} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Registration Date">
              <Input
                type="date"
                className="input-field"
                value={moment(registrationDate).format("YYYY-MM-DD")} // Format the date using moment
                onChange={e => setRegistrationDate(e.target.value)}
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
          <Button className="submit-btn" type="primary" htmlType="submit">Update</Button>
        </Form.Item>
      </Form>
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default CarUpdate;
