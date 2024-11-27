import React, { useState, useEffect } from "react";
import { Button, Space, Table, Modal, Input } from "antd";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import moment from "moment";

const { Search } = Input;

const NotificationList = () => {
    const [data, setData] = useState([]);
    const [viewModalVisible, setViewModalVisible] = useState(false); // State for view modal
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [searchValue, setSearchValue] = useState(''); 

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:5500/notifications"); // Corrected URL
            if (!response.ok) {
                throw new Error("Failed to fetch notifications");
            }
            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const searchHandle = async (key) => {
        try {
          if (key) {
            let result = await fetch(`http://localhost:5500/searchNotification/${key}`);
            if (!result.ok) {
              throw new Error("Failed to search data");
            }
            result = await result.json();
            setData(result);
          } else {
            fetchData();
          }
          setSearchValue("");
        } catch (error) {
          console.error("Error searching data:", error);
        }
      };


    const handleView = (notification) => {
        setSelectedNotification(notification);
        setViewModalVisible(true);
    };

    const handleViewModalCancel = () => {
        setSelectedNotification(null);
        setViewModalVisible(false);
    };

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Type",
            dataIndex: "recipientType",
            key: "recipientType",
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => <span>{moment(date).format("DD-MM-YYYY")}</span>,
        },
        {
            title: "Action",
            render: (text, record) => (
                <Space size="middle">

                    <FaEye style={{ width: '20px', height: '20px' }} onClick={() => handleView(record)} />

                </Space>
            ),
        },
    ];

    return (
        <div className="notification-list">
            <div className="top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="search">
                    <Space direction="vertical">
                        <Search
                            placeholder="Search notifications"
                            onSearch={searchHandle}
                            style={{ width: 300 }}
                        />
                    </Space>
                </div>
                <div className="add-btn">
                    <Button type="primary">
                        <Link to="/notificationNew">+ Add Notification</Link>
                    </Button>
                </div>
            </div>
            <div className="table">
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                />
            </div>

            <Modal
                className="notification-details-modal"
                title="Notification Details"
                visible={viewModalVisible}
                onCancel={handleViewModalCancel}
                footer={null}
            >
                <h3 style={{color:'blue'}}>Title</h3>
                <h3>{selectedNotification?.title}</h3><hr></hr>
                <p style={{color:'blue'}}>Message</p>
                <p>{selectedNotification?.messageText}</p><hr></hr>
                <p style={{color:'blue'}}>Type</p>
                <p>{selectedNotification?.recipientType}</p>
            </Modal>

        </div>
    );
};

export default NotificationList;
