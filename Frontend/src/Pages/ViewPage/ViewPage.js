import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Modal } from "antd";
import moment from "moment";

const ViewDriver = () => {
    const { driverId } = useParams(); // Assuming you have set up the route parameter for driverId

    const [carData, setCarData] = useState([]);
    const [loading, setLoading] = useState(true); // Optional: Use loading state to show loading indicator

    useEffect(() => {
        const fetchCarData = async () => {
            try {
                const response = await fetch(`http://localhost:5500/get-car/${driverId}`); // Replace with your endpoint to fetch car data
                if (!response.ok) {
                    throw new Error("Failed to fetch car data");
                }
                const data = await response.json();
                setCarData(data);
                setLoading(false); // Set loading to false after data is fetched
            } catch (error) {
                console.error("Error fetching car data:", error);
                setLoading(false); // Set loading to false in case of error
            }
        };

        fetchCarData(); // Call fetchCarData() when the component mounts
    }, [driverId]); // Add driverId to dependency array to refetch data when it changes

    return (
        <div className="view-driver-page" >
            {loading ? (
                <p>Loading...</p> // Optionally show a loading indicator while fetching data
            ) : (
                <>
                    {/* Render car data here */}
                    {carData.map(car => (
                        <div key={car.id}>
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <h3>Car Name</h3>
                                    <p>{car.model}</p>
                                </Col>
                                <Col span={12}>
                                    <h3>License Plate</h3>
                                    <p>{car.licensePlate}</p>
                                </Col>
                            </Row>
                            {/* Render other car details as needed */}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default ViewDriver;
