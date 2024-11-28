import "./App.scss";
import Home from "./Pages/Home/Home";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserList from "./Pages/Userlist/UserList";
import DriverList from "./Pages/Driverlist/DriverList";
import Driver from "./Pages/DriverPage/Driver";
import User from "./Pages/UserPage/User";
import NewUser from "./Pages/CreateUser/NewUser";
import NewDriver from "./Pages/CreateDriver/NewDriver";
import CarList from "./Pages/Carlist/CarList";
import Car from "./Pages/CarPage/Car";
import NewCar from "./Pages/CreateCar/NewCar";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ChangePassword from "./Pages/ChangePassword";
import Protected from "./Pages/Protected";
import Layout from "./Pages/Layout";
import Brand from "./Pages/Brand/Brand";
import NewBrand from "./Pages/NewBrand/NewBrand";
import Brandupdate from "./Pages/BrandUpdate/Brandupdate";
import Varient from "./Pages/Varient/Varient";
import NewVarient from "./Pages/NewVarient/NewVarient";
import VarientUpdate from "./Pages/VarientUpdate/VarientUpdate";
import Model from "./Pages/Model/Model";
import NewModel from "./Pages/NewModel/NewModel";
import UpdateModel from "./Pages/UpdateModel/UpdateModel";
import PassengerList from "./Pages/PassengerList/PassengerList";
import PassengerNew from "./Pages/PassengerNew/PassengerNew";
import PassengerUpdate from "./Pages/PassengerUpdate/PassengerUpdate";
import HotelList from "./Pages/HotelList/HotelList";
import HotelNew from "./Pages/HotelNew/HotelNew";
import HotelUpdate from "./Pages/HotelUpdate/HotelUpdate";
import DiscountManagerList from "./Pages/DiscountManagerList/DiscountManagerList";
import DiscountManagerNew from "./Pages/DiscountManagerNew/DiscountManagerNew";
import DiscountManagerUpdate from "./Pages/DiscountManagerUpdate/DiscountManagerUpdate";
import NotificationList from "./Pages/NotificationList/NotificationList";
import NotificationNew from "./Pages/NotificationNew/NotificationNew";
import BannerList from "./Pages/BannerList/BannerList";
import BannerNew from "./Pages/BannerNew/BannerNew";
import BannerUpdate from "./Pages/BannerUpdate/BannerUpdate";
// import ViewPage from "./Pages/ViewPage/ViewPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route exact path="/ChangePassword" element={<ChangePassword />} />
        <Route
          path="/"
          element={
            <Protected>
              <Layout />
            </Protected>
          }
        >
          <Route exact path="/" element={<Home />} />
          <Route exact path="/users" element={<UserList />} />
          <Route exact path="/user/:id" element={<User />} />
          <Route exact path="/newUser" element={<NewUser />} />
          <Route exact path="/cars" element={<CarList />} />
          <Route exact path="/car/:id" element={<Car />} />
          <Route exact path="/newCar" element={<NewCar />} />
          <Route exact path="/drivers" element={<DriverList />} />
          <Route exact path="/driver/:id" element={<Driver />} />
          <Route exact path="/newDriver" element={<NewDriver />} />
          <Route exact path="/brands" element={<Brand />} />
          <Route exact path="/newbrand" element={<NewBrand />} />
          <Route exact path="/brandupdate/:id" element={<Brandupdate />} />
          <Route exact path="/varients" element={<Varient />} />
          <Route exact path="/newVarient" element={<NewVarient />} />
          <Route exact path="/varientUpdate/:id" element={<VarientUpdate />} />
          <Route exact path="/model" element={<Model />} />
          <Route exact path="/newModel" element={<NewModel />} />
          <Route exact path="/UpdateModel/:id" element={<UpdateModel />} />
          <Route exact path="/passengerList" element={<PassengerList />} />
          <Route exact path="/passengerNew" element={<PassengerNew />} />
          <Route
            exact
            path="/passengerUpdate/:id"
            element={<PassengerUpdate />}
          />
          <Route exact path="/hotelList" element={<HotelList />} />
          <Route exact path="/hotelNew" element={<HotelNew />} />
          <Route exact path="/hotelUpdate/:id" element={<HotelUpdate />} />
          <Route
            exact
            path="/discountManagerList"
            element={<DiscountManagerList />}
          />
          <Route
            exact
            path="/discountManagerNew"
            element={<DiscountManagerNew />}
          />
          <Route
            exact
            path="/discountManagerUpdate/:id"
            element={<DiscountManagerUpdate />}
          />
          <Route
            exact
            path="/notificationList"
            element={<NotificationList />}
          />
          <Route exact path="/notificationNew" element={<NotificationNew />} />
          <Route exact path="/bannerList" element={<BannerList />} />
          <Route exact path="/bannerNew" element={<BannerNew />} />
          <Route exact path="/bannerUpdate/:id" element={<BannerUpdate />} />
          {/* <Route exact path="/viewPage" element={<ViewPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
