import React, { useState, useEffect } from "react";
import { Button, Space, Table, Switch, Input, Modal, Row, Col } from "antd";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import moment from "moment";
import { FaEye } from "react-icons/fa";
import './DriverList.scss'
const { Search } = Input;

const DriverList = () => {
  const [data, setData] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [driverVehicles, setDriverVehicles] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteDriverId, setDeleteDriverId] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
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
      const response = await fetch("http://localhost:5500/Driver");
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
      await fetch(`http://localhost:5500/Driver/${deleteDriverId}`, {
        method: "DELETE",
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting record:", error);
    } finally {
      setDeleteDriverId(null);
      setDeleteModalVisible(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
  };

  const handleDelete = (id) => {
    setDeleteDriverId(id);
    setDeleteModalVisible(true);
  };

  const handleView = async (driverId) => {
    try {
      const driverResponse = await fetch(`http://localhost:5500/get-driver/${driverId}`);
      if (!driverResponse.ok) {
        throw new Error("Failed to fetch driver details");
      }
      const driverData = await driverResponse.json();
      setSelectedDriver(driverData.driver);
      setViewModalVisible(true);
    } catch (error) {
      console.error("Error fetching driver details:", error);
    }
  };


  const handleViewModalCancel = () => {
    setSelectedDriver(null);
    setDriverVehicles([]);
    setViewModalVisible(false);
  };

  const searchHandle = async (value) => { // Corrected parameter name
    try {
      if (value) {
        let result = await fetch(`http://localhost:5500/searchDriver/${value}`);
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

  const handleActiveChange = async (id, active) => {
    try {
      const response = await fetch(`http://localhost:5500/ActiveDriver/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active }),
      });
      if (!response.ok) {
        throw new Error("Failed to update active state");
      }
      fetchData();
    } catch (error) {
      console.error("Error updating active state:", error);
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
      render: (image, record) => (
        <img
          key={record._id}
          style={{ width: '60px', height: '60px', borderRadius: '50%' }}
          src={image && `http://localhost:5500/${image.replace(/\\/g, "/")}`}
          alt="Driver Image"
          className="circular-image "
        />
      ),
    },
    {
      title: "Driver Name",
      dataIndex: "driverName",
      key: "driverName",
      sorter: (a, b) => a.driverName.localeCompare(b.driverName),
      sortOrder: sortedInfo.columnKey === "driverName" && sortedInfo.order,
    },
    {
      title: "License Number",
      dataIndex: "licenseNumber",
      key: "licenseNumber",
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
          <FaEye style={{ width: "20px", height: "20px", color: 'black' }} onClick={() => handleView(record._id)} />
          <Link to={"/driver/" + record._id}>
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
              placeholder="search by driver name"
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
            <Link to="/newDriver">+ Add Driver</Link>
          </Button>
        </div>
      </div>
      <div className="table" style={{ fontFamily: 'none' }}>
        <Table
          className="table-container"
          columns={columns}
          dataSource={filteredData.length > 0 ? filteredData : data}
          onChange={handleChange}
          pagination={pagination} // Corrected pagination passing
          sortedInfo={sortedInfo}
        />
      </div>
      <Modal
        title="Confirm Delete"
        visible={deleteModalVisible}
        onOk={handleModalOk}
        onCancel={handleCancelDelete}
      >
        <p>Are you sure you want to delete this driver?</p>
      </Modal>

      <Modal
        style={{ width: '100%' }}
        className="driver-details-modal"
        visible={viewModalVisible}
        onCancel={handleViewModalCancel}
        footer={null}
      >
        {selectedDriver && (
          <table className="driver-table">
            <tbody>
              <tr>
                <td>
                  <img
                    style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                    src={selectedDriver.image ? `http://localhost:5500/${selectedDriver.image}` : `http://localhost:5500/Driver`}
                    alt="Driver"
                    className="driver-image"
                  />
                </td>
                <td className="driver-info">
                  <table style={{ marginLeft: '30px' }}>
                    <thead>
                      <tr>
                        <th colSpan="2">Driver Details</th>
                      </tr>
                    </thead>
                    <tbody style={{ marginLeft: '50px' }}>
                      <tr>
                        <td >Name :</td>
                        <td style={{ color: 'blue' }}>{selectedDriver.driverName}</td>
                      </tr>
                      <tr>
                        <td>Phone :</td>
                        <td style={{ color: 'blue' }}>{selectedDriver.phoneNumber}</td>
                      </tr>
                      <tr>
                        <td>Address :</td>
                        <td style={{ color: 'blue' }}>{selectedDriver.address}</td>
                      </tr>
                      <tr>
                        <td>Email :</td>
                        <td style={{ color: 'blue' }}>{selectedDriver.email}</td>
                      </tr>

                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        )}

        <hr />

        {selectedDriver?.car ? (

          <table className="car-table">
            <tbody>
              <tr key={selectedDriver?.car?._id}>
                <td>
                  {selectedDriver?.car?.image ? (
                    <img
                      style={{ width: '130px', height: "115px", marginTop: '8px' }}
                      src={selectedDriver?.car?.image ? `http://localhost:5500/${selectedDriver?.car?.image}` : `http://localhost:5500/Car`}
                      alt="Car Image"
                      className="car-image"
                    />
                  ) : (
                    <p>No Image Available</p>
                  )}
                </td>
                <tr>
                  <td>Brand :</td>
                  <td style={{ color: 'blue' }}>{selectedDriver?.car?.brand.brand}</td>
                </tr>
                <tr>
                  <td>Model :</td>
                  <td style={{ color: 'blue' }}>{selectedDriver?.car?.model.model}</td>
                </tr>
                <tr>
                  <td>Variant :</td>
                  <td style={{ color: 'blue' }}>{selectedDriver?.car?.variant.variant}</td>
                </tr>
                <tr>
                  <td>Car Name :</td>
                  <td style={{ color: 'blue' }}>{selectedDriver?.car?.carName}</td>
                </tr>
                <tr>
                  <td>Price :</td>
                  <td style={{ color: 'blue' }}>{selectedDriver?.car?.price}</td>
                </tr>

              </tr>
            </tbody>
          </table>
        ) : (
          <p>No car details found</p>
        )}

        {!selectedDriver && <p>No driver selected</p>}
      </Modal>

    </div >
  );
};

export default DriverList;
