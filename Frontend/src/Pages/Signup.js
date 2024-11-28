import "./Login.css";
import React from "react";
import { Input, Button, Form, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
// import backgroundImage from "./BannerImage/.jpg";

const Signup = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await fetch(
        "https://admin-live-project.onrender.com/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.getFieldValue("name"),
            email: form.getFieldValue("email"),
            password: form.getFieldValue("password"),
          }),
        }
      );

      let data = JSON.stringify({
        name: form.getFieldValue("name"),
        email: form.getFieldValue("email"),
        password: form.getFieldValue("password"),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Signup successful:", data);
        message.success("Signup successful");
        localStorage.setItem("userEmail", form.getFieldValue("email"));
        navigate("/", { replace: true });
      } else {
        const errorData = await response.json();
        console.error("Signup failed:", errorData.message);
        message.error(errorData.message);
      }
    } catch (error) {
      console.error("Error in handleLogin:", error);
      message.error("An unexpected error occurred");
    }
  };

  return (
    <div className="container2">
      {/* <div className="background-image-container">
        <img src={backgroundImage} alt="Background" className="background-image" />
      </div> */}

      <h1>Signup</h1>
      <Form form={form} className="form">
        <Form.Item label="Name" name="name">
          <Input style={{ marginLeft: "22px", width: "94%" }} />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input style={{ marginLeft: "22px", width: "94%" }} />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input.Password />
        </Form.Item>

        <Button className="btnform" type="primary" onClick={handleSignup}>
          Signup
        </Button>
        <Button className="btnform" type="primary">
          <Link to="/login">Login</Link>
        </Button>
      </Form>
    </div>
  );
};

export default Signup;
