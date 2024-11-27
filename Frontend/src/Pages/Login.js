import "./Login.css"
import React from "react";
import { Input, Button, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
// import backgroundImage from "./BannerImage/.jpg";


const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5500/User", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.getFieldValue("email"),
          password: form.getFieldValue("password"),
        }),
      });

      let data = JSON.stringify({
        email: form.getFieldValue("email"),
        password: form.getFieldValue("password"),
      });


      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        message.success("Login successful");
        localStorage.setItem("userEmail", form.getFieldValue("email"));
        navigate("/", { replace: true });
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData.message);
        message.error(errorData.message);
      }
    } catch (error) {
      console.error("Error in handleLogin:", error);
      message.error("An unexpected error occurred");
    }
  };



  return (
    <div className="container2" >
      {/* <div className="background-image-container">
        <img src={backgroundImage} alt="Background" className="background-image" />
      </div> */}

      <h1>Login</h1>
      <Form
        form={form}
        className="form"
      >

        <Form.Item label="Email" name="email">
          <Input style={{ marginLeft: '22px', width: '94%' }} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
        >
          <Input.Password />
        </Form.Item>
        <Button className="btnform"
          type="primary"
          onClick={handleLogin}
        >
          Login
        </Button>
      </Form>

    </div>
  );
};

export default Login;