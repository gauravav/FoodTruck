import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import LandingPage from "./LandingPage/LandingPage";
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import LoginRegister from "./LoginRegister/LoginRegister";
import UserFoodTruckPage from "./UserFoodTruckPage/UserFoodTruckPage";
import FoodTruckDetails from "./FoodTruckDetails/FoodTruckDetails";
import FoodTruckManager from "./FoodTruckManager/FoodTruckManager";
import FavFoodTrucks from "./FavFoodTrucks/FavFoodTrucks";
import EditAccount from "./EditAccount/EditAccount";
import AdminRegisterPage from "./AdminRegisterPage/AdminRegisterPage";
import {SnackbarProvider} from "./Snackbar/SnackbarContext";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <SnackbarProvider>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/login" element={<LoginRegister/>}/>
                <Route path="/user-food-truck" element={<UserFoodTruckPage/>}/>
                <Route path="/food-truck-details" element={<FoodTruckDetails/>}/>
                <Route path="/FoodTruckManager" element={<FoodTruckManager/>}/>
                <Route path="/FavFoodTrucks" element={<FavFoodTrucks/>}/>
                <Route path="/EditAccount" element={<EditAccount/>}/>
                <Route path="/AdminRegisterPage" element={<AdminRegisterPage/>}/>
            </Routes>
        </SnackbarProvider>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
