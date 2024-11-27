import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, Row, Col, Upload } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useParams, useNavigate } from "react-router-dom";

const { Option } = Select;

const UpdateDriver = () => {
  const [driverName, setDriverName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [carOptions, setCarOptions] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [prevImage, setPrevImage] = useState(null); // New state for image
  const [error, setError] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchDataCar();
  }, [params.id]); // Changed to params.id

  const fetchDataCar = async () => {
    try {
      const response = await fetch("http://localhost:5500/Car");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();
      setCarOptions(jsonData); // Changed to setCarOptions
    } catch (error) {
      setError(error.message); // Set error state
    }
  };

  const fetchData = async () => {
    let result = await fetch(`http://localhost:5500/UpdateDriver/${params.id}`);
    result = await result.json();
    setSelectedCar(result.car);
    setDriverName(result.driverName);
    setLicenseNumber(result.licenseNumber);
    setPhoneNumber(result.phoneNumber);
    setAddress(result.address);
    setEmail(result.email);
    setImage(result.image);
    setPrevImage(result.image);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("driverName", driverName);
    formData.append("licenseNumber", licenseNumber);
    formData.append("phoneNumber", phoneNumber);
    formData.append("address", address);
    formData.append("email", email);
    formData.append("car", selectedCar); // Changed to selectedCar
    if (image !== prevImage) {
      formData.append("image", image);
    } else {
      // If image is null or equal to the previous image, append the previous image to avoid setting it to null in the database
      formData.append("prevImage", prevImage);
    }
    let result = await fetch(
      `http://localhost:5500/UpdateDriver/${params.id}`,
      {
        method: "PUT",
        body: formData,
      }
    );
    result = await result.json();
    console.log(result);
    navigate("/drivers");
  };

  const handleImageChange = (info) => {
    if (info.file.status === "done" || info.file.status === "error") {
      // If file is uploaded successfully or there is an error
      const file = info.file.originFileObj;
      setImage(file); // Set the image object
    }
  };

  return (
    <div className="form-container">
      <Form onFinish={handleUpdate} layout="vertical">
        <h1 className="form-title">Update Driver Data</h1>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Driver Name" initialValue={driverName}>
              <Input
                className="input-field"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="License Number" initialValue={licenseNumber}>
              <Input
                type="number"
                className="input-field"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Email" initialValue={email}>
              <Input
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />{" "}
              {/* Changed to email */}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Phone Number" initialValue={phoneNumber}>
              <PhoneInput
                country={"us"}
                inputStyle={{ width: "100%" }}
                value={phoneNumber}
                onChange={setPhoneNumber}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Address" initialValue={address}>
              <Input
                className="input-field"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Car Name" name="car">
              <Select
                className="input-field"
                value={selectedCar}
                onChange={(value) => setSelectedCar(value)}
              >
                {carOptions.map((car) => (
                  <Option key={car._id} value={car._id}>
                    {car.carName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Image">
              <Upload onChange={handleImageChange}>
                <Button>Upload</Button>
              </Upload>
              {(image || prevImage) && (
                <div>
                  <img
                    src={`http://localhost:5500/${image || prevImage}`}
                    alt="Uploaded"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button className="submit-btn" type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateDriver;
