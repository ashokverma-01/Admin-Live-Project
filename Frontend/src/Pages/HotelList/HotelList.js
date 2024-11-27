import React, { useState, useEffect } from "react";
import { Button, Space, Table, Select, Switch, Input, Form, DatePicker, Modal } from "antd"; // Import Modal
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import moment from "moment";


const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const HotelList = () => {
  const [data, setData] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
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
      const response = await fetch("http://localhost:5500/Hotel");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleModalOk = async () => {
    try {
      await fetch(`http://localhost:5500/deleteHotel/${deleteId}`, {
        method: "DELETE",
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting record:", error);
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

  const searchHandle = async (key) => {
    try {
      if (key) {
        let result = await fetch(`http://localhost:5500/searchHotel/${key}`);
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
    console.log('Various parameters', pagination, filters, sorter, extra);
    setSortedInfo(sorter);
    setPagination(pagination);
    const { gender } = filters;
    if (gender && gender.length > 0 && gender[0] !== "all") {
      const filteredData = data.filter((item) => item.gender === gender[0]);
      setFilteredData(filteredData);
    } else {
      fetchData();
    }
  };





  const columns = [
    {
      title: "Profile",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          style={{ width: '80px', height: '80px' }}
          src={image && `http://localhost:5500/${image.replace(/\\/g, "/")}`} // Prefix with server address
          alt="Hotel Image"
          className="circular-image "
        />
      ),
    },
    {
      title: "Hotel Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Person Name",
      dataIndex: "personName",
      key: "personName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
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
          <Link to={"/hotelUpdate/" + record._id}>
            <FaRegEdit style={{ width: "20px", height: "20px" }}></FaRegEdit>
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
        <div className="search">
          <Space direction="vertical">
            <Search
              placeholder="search by hotel name "
              onSearch={searchHandle}
              style={{
                width: 300,
              }}
            />
          </Space>
        </div>
        <div className="filters" style={{ marginLeft: '50px' }}>
        </div>
        <div className="addbtn">
          <Button type="primary">
            <Link to="/hotelNew">+ Add Hotel</Link>
          </Button>
        </div>
      </div>
      <div className="table" style={{ fontFamily: 'none' }}>
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
        <p>Are you sure you want to delete this hotel?</p>
      </Modal>
    </div>
  );
};

export default HotelList;
