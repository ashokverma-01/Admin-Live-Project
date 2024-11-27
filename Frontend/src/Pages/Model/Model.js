import React, { useState, useEffect } from "react";
import { Button, Space, Table, Input, Modal } from "antd";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import moment from "moment";
import './ModelList.css'
const { Search } = Input;

const Model = () => {
    const [data, setData] = useState([]);
    const [sortedInfo, setSortedInfo] = useState({});
    const [filteredData, setFilteredData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteCarId, setDeleteCarId] = useState(null);
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
            const response = await fetch("http://localhost:5500/models");
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchDataAll();
    }, []);

    const fetchDataAll = async () => {
        try {
            const response = await fetch("http://localhost:5500/Allmodels");
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const searchHandle = async (key) => {
        try {
            if (key) {
                let result = await fetch(`http://localhost:5500/searchModel/${key}`);
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


    const handleChange = (pagination, filters, sorter, extra) => {
        console.log("Various parameters", pagination, filters, sorter, extra);
        setSortedInfo(sorter);
        setPagination(pagination);

    };

    const handleModalOk = async () => {
        try {
            await fetch(`http://localhost:5500/Model/${deleteCarId}`, {
                method: "DELETE",
            });
            fetchData();
        } catch (error) {
            console.error("Error deleting record:", error);
        } finally {
            setDeleteCarId(null);
            setDeleteModalVisible(false);
        }
    };

    const handleModalCancel = () => {
        setDeleteCarId(null);
        setDeleteModalVisible(false);
    };

    const handleDelete = (id) => {
        setDeleteCarId(id);
        setDeleteModalVisible(true);
    };

    const columns = [
        {
            title: "Model Name",
            dataIndex: "model",
            key: "model",
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
            render: (brand) => brand.brand, // Assuming 'name' is the property of the brand object you want to display
        },
        {
            title: "Date",
            dataIndex: "timeTemps",
            key: "timeTemps",
            render: (date) => <span>{moment(date).format("DD-MM-YYYY")}</span>,
            filters: [
                {
                    text: "Today",
                    value: moment().startOf("day").toISOString(),
                },
                {
                    text: "This Week",
                    value: moment().startOf("week").toISOString(),
                },
                {
                    text: "This Month",
                    value: moment().startOf("month").toISOString(),
                },
            ],
            onFilter: (value, record) => {
                return moment(record.timeTemps).isSameOrAfter(value, "day");
            },
        },
        {
            title: "Action",
            render: (text, record) => (
                <Space size="middle">
                    <Link to={"/UpdateModel/" + record._id}>
                        <FaRegEdit style={{ width: "20px", height: "20px" }}></FaRegEdit>
                    </Link>
                    <MdDelete
                        style={{ width: "20px", height: "20px", color: 'red' }}
                        onClick={() => handleDelete(record._id)}
                    />
                </Space>
            ),
        },
    ]

    return (
        <div className="home">
            <div className="top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="search">
                    <Search
                        placeholder="search by model name"
                        onSearch={searchHandle}
                        style={{ width: 300 }}
                    />
                </div>
                <div className="addbtn">
                    <Button type="primary">
                        <Link to="/newModel">+ Add New Model</Link>
                    </Button>
                </div>
            </div>
            <div className="table" style={{ fontFamily: "none" }}>
                <Table
                    className="table-container"
                    columns={columns}
                    dataSource={filteredData.length > 0 ? filteredData : data}
                    onChange={handleChange}
                    pagination={pagination}
                    sortedInfo={sortedInfo}
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
                <p>Are you sure you want to delete this model?</p>
            </Modal>
        </div>
    );
};

export default Model;
