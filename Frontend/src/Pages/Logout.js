import React, { useState, useEffect } from "react";
import { Popover, Button, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ChangePassword from "./ChangePassword";
import EditProfile from "./EditProfile";
import axios from 'axios';
import "./Logout.scss";

const Logout = () => {
    const navigate = useNavigate();
    const [userImage, setUserImage] = useState(null);
    const [userEmail, setUserEmail] = useState("");
    const [changePasswordVisible, setChangePasswordVisible] = useState(false);
    const [editProfileVisible, setEditProfileVisible] = useState(false);

    useEffect(() => {
        const userEmailFromStorage = localStorage.getItem("userEmail");
        if (userEmailFromStorage) {
            setUserEmail(userEmailFromStorage);
        }
    }, []);

    useEffect(() => {
        const fetchUserImage = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/user/image?email=${userEmail}`);
                setUserImage(response.data.imageUrl);
            } catch (error) {
                console.error("Error fetching user image:", error);
            }
        };
        
        if (userEmail) {
            fetchUserImage();
        }
    }, [userEmail]);

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userImage");
        navigate("/Login");
    };

    const handleOpenChangePassword = () => {
        setChangePasswordVisible(true);
    };

    const handleCloseChangePassword = () => {
        setChangePasswordVisible(false);
    };

    const handleOpenEditProfile = () => {
        setEditProfileVisible(true);
    };

    const handleCloseEditProfile = () => {
        setEditProfileVisible(false);
    };

    return (
        <>
            <Popover
                content={
                    <div>
                        <div>
                            {userImage ? (
                                <Avatar
                                    size={64}
                                    src={userImage}
                                    alt="User Image"
                                    style={{ marginBottom: "10px" }}
                                />
                            ) : (
                                <Avatar
                                    size={64}
                                    icon={<UserOutlined />}
                                    style={{ marginBottom: "10px" }}
                                />
                            )}
                        </div>
                        <p>Email: {userEmail}</p>
                        <div className="edit">
                            <Button
                                type="primary"
                                onClick={handleOpenChangePassword}
                                style={{ width: "175px", marginBottom: "10px" }}
                            >
                                Change Password
                            </Button>
                            <Button
                                type="primary"
                                onClick={handleOpenEditProfile}
                                style={{ width: "175px", display: 'block' }}
                            >
                                Edit Profile
                            </Button>
                        </div>
                        <div className="logout">
                            <Button
                                type="primary"
                                danger
                                onClick={handleLogout}
                                style={{ width: "175px" }}
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                }
                title="User Profile"
                trigger="click"
            >
                <Button type="primary" shape="circle" icon={<UserOutlined />} />
            </Popover>
            {changePasswordVisible && (
                <Popover
                    content={<ChangePassword onClose={handleCloseChangePassword} />}
                    title="Change Password"
                    trigger="click"
                    visible={changePasswordVisible}
                    onVisibleChange={setChangePasswordVisible}
                >
                    <Button type="primary">Change Password</Button>
                </Popover>
            )}
            {editProfileVisible && (
                <Popover
                    content={<EditProfile onClose={handleCloseEditProfile} />}
                    title="Edit Profile"
                    trigger="click"
                    visible={editProfileVisible}
                    onVisibleChange={setEditProfileVisible}
                >
                    <Button type="primary" >Edit Profile</Button>
                </Popover>
            )}
        </>
    );
};

export default Logout;
