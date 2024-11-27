import React, { useState, useEffect } from "react";
import './charts.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaCarSide } from "react-icons/fa";
import {
    LineChart,
    Line,
    XAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import {
    faBox,
    faUser,
    faUsers,
    faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalDrivers, setTotalDrivers] = useState(0);
    const [totalPassenger, setTotalPassenger] = useState(0);
    const [totalCar, setTotalCars] = useState(0); // State for total male users

    useEffect(() => {
        fetchTotalUsers();
        fetchTotalDrivers();
        fetchTotalCar(); 
        fetchTotalPassenger(); 
    }, []);

    const fetchTotalUsers = async () => {
        try {
            const response = await fetch('http://localhost:5500/api/total-users');
            const data = await response.json();
            setTotalUsers(data.totalUsers);
        } catch (error) {
            console.error('Error fetching total users:', error);
        }
    };

    const fetchTotalDrivers = async () => {
        try {
            const response = await fetch('http://localhost:5500/api/total-drivers');
            const data = await response.json();
            setTotalDrivers(data.totalDrivers);
        } catch (error) {
            console.error('Error fetching total users:', error);
        }
    };
    const fetchTotalPassenger = async () => {
        try {
            const response = await fetch('http://localhost:5500/api/total-passenger');
            const data = await response.json();
            setTotalPassenger(data.totalDrivers);
        } catch (error) {
            console.error('Error fetching total passenger:', error);
        }
    };
    const fetchTotalCar = async () => {
        try {
            const response = await fetch('http://localhost:5500/api/total-cars');
            const data = await response.json();
            setTotalCars(data.totalDrivers);
        } catch (error) {
            console.error('Error fetching total car:', error);
        }
    };

    const data = [
        { name: "Jan", "Active User": 4000 },
        { name: "Feb", "Active User": 3000 },
        { name: "March", "Active User": 2000 },
        { name: "April", "Active User": 2780 },
        { name: "May", "Active User": 1890 },
        { name: "June", "Active User": 2390 },
        { name: "July", "Active User": 3490 },
        { name: "August", "Active User": 3490 },
        { name: "September", "Active User": 3490 },
        { name: "October", "Active User": 3490 },
        { name: "November", "Active User": 3490 },
        { name: "December", "Active User": 3490 },
    ];

    return (
        <div className="dashboard">
            <div className="grid-container">
                <div className="grid-item" style={{ backgroundColor: "rgb(245, 53, 171)" }}>
                    <FontAwesomeIcon icon={faUsers} />
                    <p>Total User</p>
                    <h2>{totalUsers}</h2>
                </div>
                <div className="grid-item" style={{ backgroundColor: "blue" }}>
                    <FontAwesomeIcon icon={faUser} />
                    <p>Passengers</p>
                    <h2>{totalPassenger}</h2> 
                </div>
                <div className="grid-item" style={{ backgroundColor: "green" }}>
                <FaCarSide  icon={faUsers}  style={{width:'55px',height:'55px'}}/>
                    <p>Cars</p>
                    <h2>{ totalCar}</h2>
                </div>
                <div className="grid-item" style={{ backgroundColor: "aqua" }}>
                    <FontAwesomeIcon icon={faShoppingCart} />
                    <p> Drivers</p>
                    <h2>{totalDrivers}</h2>
                </div>
            </div>

            <div className="charts">
                <h3 className="chartTitle">Users Analysis</h3>
                <ResponsiveContainer width="100%" aspect={4 / 1}>
                    <LineChart data={data}>
                        <XAxis dataKey="name" stroke="#5550bd" />
                        <Line type="monotone" dataKey="Active User" stroke="#5550bd" />
                        <Tooltip />
                        <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;
