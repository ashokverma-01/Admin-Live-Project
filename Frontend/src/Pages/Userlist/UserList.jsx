import React, { useState, useEffect } from "react";
import { Button, Space, Table, Select, Switch, Input, Form, DatePicker, Modal } from "antd"; // Import Modal
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
// import "./userList.scss";
import moment from "moment";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const UserList = () => {
  const [data, setData] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6, // Number of records per page
  });

  useEffect(() => {
    fetchData();
  }, [pagination.current]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5500/User");
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
      await fetch(`http://localhost:5500/User/${deleteUserId}`, {
        method: "DELETE",
      });
      // If the deletion is successful, update the data by refetching
      fetchData();
    } catch (error) {
      console.error("Error deleting record:", error);
    } finally {
      setDeleteUserId(null);
      setDeleteModalVisible(false);
    }
  };

  const handleModalCancel = () => {
    setDeleteUserId(null);
    setDeleteModalVisible(false);
  };

  const handleDelete = (id) => {
    setDeleteUserId(id);
    setDeleteModalVisible(true);
  };


  const searchHandle = async (key) => {
    try {
      if (key) {
        let result = await fetch(`http://localhost:5500/search/${key}`);
        if (!result.ok) {
          throw new Error("Failed to search data");
        }
        result = await result.json();
        setData(result);
      } else {
        fetchData();
      }

      // Clear the search input value
      setSearchValue(""); // Assuming setSearchValue is the function to update the search input value
    } catch (error) {
      console.error("Error searching data:", error);
    }
  };


  const handleChange = (pagination, filters, sorter, extra) => {
    console.log('Various parameters', pagination, filters, sorter, extra);
    setSortedInfo(sorter);
    setPagination(pagination);

    // Apply gender filter
    const { gender } = filters;
    if (gender && gender.length > 0 && gender[0] !== "all") {
      const filteredData = data.filter((item) => item.gender === gender[0]);
      setFilteredData(filteredData);
    } else {
      fetchData(); // If no filter is applied, fetch the data again
    }
  };

  const handleGenderChange = (value) => {
    let filteredData;
    if (value === "all") {
      filteredData = data;
    } else {
      filteredData = data.filter((item) => item.gender === value);
    }
    setFilteredData(filteredData);
  };

  const handleDateChange = (dates) => {
    const [fromDate, toDate] = dates;
    let filteredData = data.filter((item) =>
      moment(item.timeTemps).isBetween(fromDate.startOf('day'), toDate.endOf('day'))
    );
    setFilteredData(filteredData);
  };


  const handleActiveChange = async (id, active) => {
    try {
      const response = await fetch(`http://localhost:5500/Active/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active }), // Send the current switch state as true or false
      });
      if (!response.ok) {
        throw new Error("Failed to update active state");
      }
      // If the update is successful, update the data by refetching
      fetchData();
    } catch (error) {
      console.error("Error updating active state:", error);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "firstname",
      key: "firstname",
      sorter: (a, b) => a.firstname.localeCompare(b.firstname),
      sortOrder: sortedInfo.columnKey === "firstname" && sortedInfo.order,
    },
    // {
    //   title: "Last Name",
    //   dataIndex: "lastname",
    //   key: "lastname",
    // },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Technology",
      dataIndex: "technology",
      key: "technology",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      sortOrder: sortedInfo.columnKey === "gender" && sortedInfo.order,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
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
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      render: (active, record) => (
        <Switch
          checked={active}
          onChange={(checked) => handleActiveChange(record._id, checked)}
        />
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value, record) => record.active === value,
    },
    {
      title: "Action",
      render: (text, record) => (
        <Space size="middle">
          <Link to={"/user/" + record._id}>
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
              placeholder="search by user name"
              onSearch={searchHandle}
              style={{
                width: 300,
              }}
            />
          </Space>
        </div>
        <div className="filters" style={{ marginLeft: '50px' }}>
          <Form layout="inline">
            <Form.Item label="Filter by Gender">
              <Select defaultValue="all" onChange={handleGenderChange} style={{ width: 120 }}>
                <Option value="all">All</Option>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className="date-filter">
          <Form layout="inline">
            <Form.Item label="Filter by Date">
              <RangePicker
                onChange={handleDateChange}
                style={{ width: 210 }}
              />
            </Form.Item>
          </Form>
        </div>
        <div className="addbtn">
          <Button type="primary">
            <Link to="/newUser">+ Add User</Link>
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
          // Pass sortedInfo to indicate the current sorting state
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
        <p>Are you sure you want to delete this user?</p>
      </Modal>
    </div>
  );
};

export default UserList;
