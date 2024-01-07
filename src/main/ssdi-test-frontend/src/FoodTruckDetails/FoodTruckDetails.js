import React, {useCallback, useEffect, useState} from 'react';
import {GoogleMap, MarkerF, useLoadScript} from '@react-google-maps/api';
import './FoodTruckDetails.css';
import axios from "axios";
import foodTruckIcon from '../Images/foodTruckIcon.png';
import Loading from '../Images/loading.gif';
import UserReviews from "../UserReviews/UserReviews";
import {url} from '../Helper/Helper';


function FoodTruckDetails() {
    const [foodTrucks, setFoodTrucks] = useState([]);
    const [selectedFoodTruck, setSelectedFoodTruck] = useState(localStorage.getItem('FoodTruckAppSelectedFoodTruck'));
    const [loading, setLoading] = useState(true); // Add a state for loading
    const [activeTab, setActiveTab] = useState(1);
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_API_KEY, // Use environment variable for API key
    });

    const [mapRef, setMapRef] = useState();
    const [center, setCenter] = useState({
        lat: 35.224951489705965,
        lng: -80.84670328452471,
    });
    const [showDropdown, setShowDropdown] = useState(false);

    const handleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const onMapLoad = React.useCallback((map) => {
        setMapRef(map);
    }, []);

    const handleTabClick = (tabIndex) => {
        setActiveTab(tabIndex);
    };
    const panTo = useCallback(({lat, lng}) => {
        if (mapRef) {
            setCenter({
                lat: lat,
                lng: lng,
            });
            mapRef.panTo({lat, lng});
            mapRef.setZoom(14);
        }
    }, [mapRef]);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('FoodTruckAppID') !== null);
    useEffect(() => {
        if (!isLoggedIn) {
            window.location.href = "/login";
        }
    });

    useEffect(() => {
        if (selectedFoodTruck === null || selectedFoodTruck === undefined) {
            alert("No registered food truck found.!");
            window.location.href = '/';
        }
    });

    useEffect(() => {
        const fetchFoodTruck = async () => {
            try {
                const response = await axios.post(url + '/getFoodTruckInformationById', {
                    id: selectedFoodTruck,
                });
                setFoodTrucks(response.data);
                setCenter({
                    lat: response.data.latitude,
                    lng: response.data.longitude,
                });
                panTo({lat: response.data.latitude, lng: response.data.longitude});
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchFoodTruck();
    }, [selectedFoodTruck, panTo]);

    const handleFoodTruckClick = (id) => {
        setSelectedFoodTruck(id);
        console.log(id);
    };

    function handleLogout() {
        localStorage.removeItem('FoodTruckAppID');
        localStorage.removeItem('FoodTruckAppUsername');
        localStorage.removeItem('FoodTruckAppEmail');
        localStorage.removeItem('FoodTruckAppFirstName');
        localStorage.removeItem('FoodTruckAppLastName');
        localStorage.removeItem('FoodTruckAppLoginType');
        localStorage.removeItem('FoodTruckAppStatus');
        localStorage.removeItem('FoodTruckAppCreatedAt');
        localStorage.removeItem('FoodTruckAppFoodTruckID');
        localStorage.removeItem('FoodTruckAppSelectedFoodTruck');
        setIsLoggedIn(false);
    }

    if (loadError) return "Error loading maps";
    if (!isLoaded || loading) {
        return <div className="backgroundInLoading">
            <div className="loading-container">
                <img src={Loading} alt="Loading..."/>
                <br/>
                <p>Please wait while we find the food trucks near you..</p>
            </div>
        </div>;
    }

    return (
        <div className="backgroundForUserHome">
            <nav className="navbar">
                <div className="navbar-left">
                    <a href="/" className="navbar-brand">
                        Food Truck Locator
                    </a>

                </div>
                <div style={{marginRight: "3%"}} className="navbar-right">
                    <ul className="navbar-nav">
                        {isLoggedIn ? (
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
                                                <a href="/">Manage Account</a>
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
            <div className="food-truck-map">
                {isLoaded ? (
                    <>
                        <div className="foodTruckDetailfood-truck-cards">
                            <div className="leftCard">
                                <div className="tabs-container">
                                    <ul className="tabs-nav">
                                        <li
                                            className={`tabs-nav-item ${activeTab === 1 ? "active" : ""}`}
                                            onClick={() => handleTabClick(1)}
                                        >
                                            Location Details
                                        </li>
                                        <li
                                            className={`tabs-nav-item ${activeTab === 2 ? "active" : ""}`}
                                            onClick={() => handleTabClick(2)}
                                        >
                                            Reviews
                                        </li>
                                        <li
                                            className={`tabs-nav-item ${activeTab === 3 ? "active" : ""}`}
                                            onClick={() => handleTabClick(3)}
                                        >
                                            Updates
                                        </li>
                                    </ul>
                                    <div className="tabs-content">
                                        {activeTab === 1 && <div>
                                            <h1>{foodTrucks.name}</h1>
                                            <table>
                                                <tr>
                                                    <th>Type:</th>
                                                    <td>{foodTrucks.description}</td>
                                                </tr>
                                                <tr>
                                                    <th>Address:</th>
                                                    <td>{foodTrucks.address}</td>
                                                </tr>
                                                <tr>
                                                    <th>Phone Number:</th>
                                                    <td>{foodTrucks.phoneNumber}</td>
                                                </tr>
                                                <tr>
                                                    <th>Email:</th>
                                                    <td>{foodTrucks.email}</td>
                                                </tr>
                                                <tr>
                                                    <th>Website:</th>
                                                    <td><a href={foodTrucks.website} target="_blank"
                                                           className="website">{foodTrucks.website}</a></td>
                                                </tr>
                                                <tr>
                                                    <th>Today Open Hours:</th>
                                                    <td>{foodTrucks.hours}</td>
                                                </tr>
                                            </table>
                                        </div>
                                        }
                                        {activeTab === 2 && <div style={{width: '500px', height: '300px'}}>
                                            <UserReviews/>
                                        </div>}
                                        {activeTab === 3 && <div>
                                            <div className="cardcard-container">
                                                <div className="cardcard">
                                                    <h3 className="cardcard-title">Updates</h3>
                                                    <p className="cardcard-text">
                                                        {foodTrucks.notes}
                                                    </p>
                                                    <div className="cardcard-update-time">
                                                        <p>Updated at: {foodTrucks.updates_time}</p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>}
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="map-container">
                            <GoogleMap
                                mapContainerStyle={{height: "100%", width: "100%"}}
                                center={center}
                                zoom={18}
                                onLoad={onMapLoad}
                                // onGoogleApiLoaded={({ map }) => {
                                //     setMapRef(map);
                                // }}
                                options={{
                                    draggable: true
                                }}
                            >
                                <MarkerF
                                    key={foodTrucks.id}
                                    position={{
                                        lat: foodTrucks.latitude,
                                        lng: foodTrucks.longitude,
                                    }}
                                    icon={{
                                        url: foodTruckIcon,
                                        scaledSize: new window.google.maps.Size(35, 35),
                                        origin: new window.google.maps.Point(0, 0),
                                        anchor: new window.google.maps.Point(15, 15),
                                    }
                                    }
                                    onClick={() => handleFoodTruckClick(foodTrucks.id)}
                                />

                            </GoogleMap>


                        </div>
                    </>
                ) : (
                    <div className="loading-container">
                        {/*<img src={Loading alt="Loading..." />*/}
                        {/*<img src={Loading} alt="Loading..." />*/}
                        {/*<h3>Loading...!</h3>*/}
                        {/*<img src={require('../Images/giphy.gif.gif')} alt="loading..." />*/}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FoodTruckDetails;

