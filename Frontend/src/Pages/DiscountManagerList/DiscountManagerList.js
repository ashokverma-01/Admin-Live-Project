import React, { useState, useEffect } from "react";
import { Button, Space, Table, Modal, message } from "antd"; // Import Modal and message from antd
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import moment from "moment";
import './DiscountManagerList.scss'
const { confirm } = Modal; // Destructure confirm from Modal

const DiscountList = () => {
    const [data, setData] = useState([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 4,
    });

    useEffect(() => {
        fetchData();
    }, [pagination.current]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:5500/Discount"); // Correct API endpoint
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error("Error fetching data:", error);
            message.error("Failed to fetch discounts"); // Display error message
        }
    };

    const handleModalOk = async () => {
        try {
            await fetch(`http://localhost:5500/deleteDiscount/${deleteId}`, {
                method: "DELETE",
            });
            fetchData();
            message.success("Discount deleted successfully"); // Display success message
        } catch (error) {
            console.error("Error deleting record:", error);
            message.error("Failed to delete discount"); // Display error message
        } finally {
            setDeleteId(null);
            setDeleteModalVisible(false);
        }
    };

    const handleModalCancel = () => {
        setDeleteId(null);
        setDeleteModalVisible(false);
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setDeleteModalVisible(true);
    };

    const columns = [
        {
            title: "Coupon Code",
            dataIndex: "couponCode",
            key: "couponCode",
        },
        {
            title: "No. Of Use",
            dataIndex: "totalCoupon",
            key: "totalCoupon",
        },
        {
            title: "Discount Type",
            dataIndex: "discountType",
            key: "discountType",
        },
        {
            title: "Discount Amount",
            dataIndex: "discountAmount",
            key: "discountAmount",
        },
        {
            title: "User Type",
            dataIndex: "userType",
            key: "userType",
        },
        {
            title: "Max Amount",
            dataIndex: "maxAmount",
            key: "maxAmount",
        },
        {
            title: "Min Amount",
            dataIndex: "minAmount",
            key: "minAmount",
        },
        {
            title: "Maximum Users",
            dataIndex: "maxUsers",
            key: "maxUsers",
        },
        {
            title: "Start Date",
            dataIndex: "startDate",
            key: "startDate",
            render: (text, record) => moment(record.startDate).format("DD-MM-YYYY"),
        },
        {
            title: "End Date",
            dataIndex: "endDate",
            key: "endDate",
            render: (text, record) => moment(record.endDate).format("DD-MM-YYYY"),
        },
        {
            title: "Action",
            render: (text, record) => (
                <Space size="middle">
                    <Link to={"/discountManagerUpdate/" + record._id}>
                        <FaRegEdit style={{ width: "20px", height: "20px" }} />
                    </Link>
                    <MdDelete
                        onClick={() => handleDelete(record._id)}
                        style={{ width: "20px", height: "20px", color: "red", cursor: "pointer" }}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="home">
            <div className="top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="search">Discount</div>
                <div className="filters" style={{ marginLeft: "50px" }}></div>
                <div className="addbtn">
                    <Button type="primary">
                        <Link to="/discountManagerNew">+ Create Discount</Link>
                    </Button>
                </div>
            </div>
            <div className="table" style={{ fontFamily: "none" }}>
                <Table
                    className="table-container"
                    columns={columns}
                    dataSource={data}
                    pagination={pagination}
                    onChange={(pagination, filters, sorter, extra) => {
                        setPagination(pagination);
                    }}
                />
            </div>
            <Modal
                title="Confirm Delete"
                visible={deleteModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="OK"
                cancelText="Cancel"
            >
                <p>Are you sure you want to delete this Discount?</p>
            </Modal>
        </div>
    );
};

export default DiscountList;
