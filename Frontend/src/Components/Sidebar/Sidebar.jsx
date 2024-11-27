import React from 'react';
import './sidebar.scss';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { FaPeopleRoof, FaCarSide } from "react-icons/fa6";
import { ImUsers } from "react-icons/im";
import { IoMan } from "react-icons/io5";
import { BsBuildings } from "react-icons/bs";
import { TbDiscount } from "react-icons/tb";
import { MdNotificationsActive } from "react-icons/md";
import { MdOutlineCommentBank } from "react-icons/md";

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className='sidebar'>
            <Menu
                style={{ color: 'white' }}
                mode="inline"
                selectedKeys={[location.pathname]}
                theme="rgb(62, 66, 69)"
                defaultOpenKeys={['cab']}
            >
                <Menu.Item key="/">
                    <Link to="/" className='link'>
                        <FaHome className='sidebarIcons' />
                        <span style={{ marginLeft: '10px' }} className="nav-text">Home</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/users">
                    <Link to='/users' className='link'>
                        <ImUsers className='sidebarIcons' />
                        <span className="nav-text" style={{ marginLeft: '10px' }}>Users</span>
                    </Link>
                </Menu.Item>
                <Menu.SubMenu
                    key="cars"
                    title={
                        <span>
                            <FaCarSide className='sidebarIcons' />
                            <span className="nav-text" style={{ marginLeft: '10px' }}>Cars</span>
                        </span>
                    }
                >
                    <Menu.Item key="/brands">
                        <Link to='/brands' className='link'>
                            <span className="nav-text" style={{ marginLeft: '10px' }}>Brands</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/model">
                        <Link to='/model' className='link'>
                            <span className="nav-text" style={{ marginLeft: '10px' }}>Models</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/varients">
                        <Link to='/varients' className='link'>
                            <span className="nav-text" style={{ marginLeft: '10px' }}>Varients</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/cars">
                        <Link to='/cars' className='link'>
                            <span className="nav-text" style={{ marginLeft: '10px' }}>Cars</span>
                        </Link>
                    </Menu.Item>
                </Menu.SubMenu>
                <Menu.Item key="/drivers">
                    <Link to='/drivers' className='link'>
                        <FaPeopleRoof className='sidebarIcons' />
                        <span className="nav-text" style={{ marginLeft: '10px' }}>Drivers</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/passengerList">
                    <Link to='/passengerList' className='link'>
                        <IoMan className='sidebarIcons' />
                        <span className="nav-text" style={{ marginLeft: '10px' }}>Passengers</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/hotelList">
                    <Link to='/hotelList' className='link'>
                        <BsBuildings className='sidebarIcons' />
                        <span className="nav-text" style={{ marginLeft: '10px' }}>Hotels</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/discountManagerList">
                    <Link to='/discountManagerList' className='link'>
                        <TbDiscount className='sidebarIcons' />
                        <span className="nav-text" style={{ marginLeft: '10px' }}>Discount Manager</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/notificationList">
                    <Link to='/notificationList' className='link'>
                        <MdNotificationsActive className='sidebarIcons' />
                        <span className="nav-text" style={{ marginLeft: '10px' }}>Notification Manager</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/bannerList">
                    <Link to='/bannerList' className='link'>
                        <MdOutlineCommentBank className='sidebarIcons' />
                        <span className="nav-text" style={{ marginLeft: '10px' }}>Banner Manager</span>
                    </Link>
                </Menu.Item>
            </Menu>
        </div>
    );
};

export default Sidebar;
