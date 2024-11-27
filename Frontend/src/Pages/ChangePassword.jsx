// ChangePassword.js
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const ChangePassword = ({ onClose }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    let userEmail = localStorage.getItem('userEmail')
    try {
      const response = await axios.post('http://localhost:5500/changePassword',

        { ...values, userEmail });

      if (response.data.status === 'success') {
        message.success(response.data.message);
        onClose(); // Close the popover after successful password change
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      message.error('Failed to update password. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="changePasswordForm"
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        label="Old Password"
        name="oldPassword"
        rules={[{ required: true, message: 'Please enter your old password' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="New Password"
        name="newPassword"
        rules={[
          { required: true, message: 'Please enter your new password' },
          { min: 6, message: 'Password must be at least 6 characters long' },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Confirm New Password"
        name="confirmNewPassword"
        dependencies={['newPassword']}
        rules={[
          { required: true, message: 'Please confirm your new password' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords do not match'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} style={{ width: '200px' }}>
          Update Password
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ChangePassword;
