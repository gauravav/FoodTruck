import React, {useEffect, useState} from 'react';
import './LandingPage.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import axios from "axios";
import {url} from "../Helper/Helper";

function LandingPage() {
    const [distance, setDistance] = useState(10); // default distance set to 10 miles
    const [foodTrucks, setFoodTrucks] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [allFoodTrucks, setAllFoodTrucks] = useState([]);
    // const top100Films = [
    //     { label: 'The Shawshank Redemption', year: 1994 },
    //     { label: 'The Godfather', year: 1972 },
    //     { label: 'The Godfather: Part II', year: 1974 },
    //     { label: 'The Dark Knight', year: 2008 },
    //     { label: '12 Angry Men', year: 1957 },
    //     { label: "Schindler's List", year: 1993 },
    //     { label: 'Pulp Fiction', year: 1994 }
    // ];

    const [value, setValue] = useState(null);

    const handleAutocompleteChange = (event, newValue) => {
        setValue(newValue);
        console.log(newValue);
    };


    const handleDropdown = () => {
        setShowDropdown(!showDropdown);
    };


    useEffect(() => {
        const isLoggedIn = localStorage.getItem('FoodTruckAppID');
        const name = localStorage.getItem('FoodTruckAppFirstName');
        if (isLoggedIn && name) {
            setLoggedIn(true);
            setUserName(name);
        }
    }, []);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            localStorage.setItem('FoodTruckAppCurrentLatitude', position.coords.latitude);
            localStorage.setItem('FoodTruckAppCurrentLongitude', position.coords.longitude);
        });
        fetchAllFoodTrucks();
    }, []);

    const fetchAllFoodTrucks = async () => {
        const response = await axios.get(url + '/getAllFoodTrucks');
        const foodTruckNames = response.data.map(foodTruck => {
            return {label: foodTruck.name, id: foodTruck.id}
        });
        setAllFoodTrucks(foodTruckNames);
        console.log(foodTruckNames);
    };

    const handleLogout = () => {
        localStorage.removeItem('FoodTruckAppID');
        localStorage.removeItem('FoodTruckAppUsername');
        localStorage.removeItem('FoodTruckAppEmail');
        localStorage.removeItem('FoodTruckAppFirstName');
        localStorage.removeItem('FoodTruckAppLastName');
        localStorage.removeItem('FoodTruckAppLoginType');
        localStorage.removeItem('FoodTruckAppStatus');
        localStorage.removeItem('FoodTruckAppCreatedAt');
        localStorage.removeItem('FoodTruckAppFoodTruckID');
        setLoggedIn(false);
        setUserName('');
    };

    // function to fetch food trucks from current location within a certain distance
    const fetchFoodTrucks = () => {
        localStorage.setItem('FoodTruckAppDistance', distance);
        window.location.href = '/user-food-truck';
    };


    function onSearchGoClick() {
        if (value === null) {
            return;
        } else {
            localStorage.setItem("FoodTruckAppSelectedFoodTruck", value.id);
            window.location.href = "/food-truck-details";
        }
    }

    return (
        <div className="landing-page">
            <nav className="navbar">
                <div className="navbar-left">
                    <a href="/" className="navbar-brand">
                        Food Truck Locator
                    </a>

                </div>
                <div style={{marginRight: "3%"}} className="navbar-right">
                    <ul className="navbar-nav">
                        {loggedIn ? (
                            <>

                                <li style={{paddingTop: '6.5%'}} className="nav-item">
                                    <a href="/FoodTruckManager" className="nav-link">Food Truck</a>
                                </li>
                                <li style={{paddingTop: '6.5%'}} className="nav-item">
                                    <a href="/user-food-truck" className="nav-link">Home</a>
                                </li>
                                <li className="nav-item">
                                    <div className="dropdown">
                                        <button type="account" className="dropbtn" onClick={handleDropdown}>
                                            {localStorage.getItem("FoodTruckAppFirstName")}
                                            <i className="fa fa-caret-down"></i>
                                        </button>
                                        {showDropdown && (
                                            <div className="dropdown-content">
                                                <a href="/FavFoodTrucks">Favourites</a>
                                                <a href="/EditAccount">Manage Account</a>
                                                <a onClick={handleLogout}>Logout</a>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <a href="/login" className="nav-link">
                                        Login
                                    </a>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
            <div className="jumbotron">
                <h1 style={{fontSize: '40px'}}>Find Your Next Meal</h1>
                <p style={{fontFamily: 'cursive', fontSize: '30px'}}>Discover food trucks near you with our interactive
                    map.</p>
                <div className="distance-slider">
                    <label htmlFor="distance">Distance (in miles): {distance}</label>
                    <input type="range" id="distance" name="distance" min="1" max="25" step="1" value={distance}
                           onChange={(e) => setDistance(parseInt(e.target.value))}/>
                </div>
                <button className="btn btn-primary btn-lg" onClick={fetchFoodTrucks}>Find Food Trucks by distance
                </button>
                <h2 style={{fontFamily: 'cursive', color: 'black', fontStyle: 'bold', fontSize: '35px'}}>or</h2>
                <div className="autoCompleteLine">
                    <Autocomplete disablePortal id="combo-box-demo" options={allFoodTrucks} sx={{
                        width: 400,
                        "& .MuiAutocomplete-input": {color: "black"},
                        "& .MuiAutocomplete-inputRoot": {backgroundColor: "white"}
                    }} renderInput={(params) => <TextField {...params} style={{color: "white"}}
                                                           label="Search for Food Truck"/>} value={value}
                                  onChange={handleAutocompleteChange}/>
                    <button onClick={onSearchGoClick} style={{marginLeft: '10px'}}>Go</button>
                </div>
            </div>

        </div>
    );
}

export default LandingPage;
