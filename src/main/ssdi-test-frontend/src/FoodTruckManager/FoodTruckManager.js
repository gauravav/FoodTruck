import React, {useCallback, useEffect, useState} from 'react';
import {GoogleMap, MarkerF, useLoadScript} from '@react-google-maps/api';
import './FoodTruckManager.css';
import axios from "axios";
import foodTruckIcon from '../Images/foodTruckIcon.png';
import Loading from '../Images/loading.gif';
import {url} from "../Helper/Helper";
import FoodTruckReviews from "../FoodTruckReviews/FoodTruckReviews";
import 'react-datepicker/dist/react-datepicker.css';
import {useSnackbar} from '../Snackbar/SnackbarContext';


function FoodTruckManager() {
    const [foodTrucks, setFoodTrucks] = useState([]);
    const [selectedFoodTruck, setSelectedFoodTruck] = useState(null);
    const [loading, setLoading] = useState(true); // Add a state for loading
    const [activeTab, setActiveTab] = useState(1);
    const [futureLocation, setFutureLocation] = useState(null);
    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_API_KEY, // Use environment variable for API key
    });
    const {showSnackbar} = useSnackbar();
    const [center, setCenter] = useState({
        lat: 35.224951489705965,
        lng: -80.84670328452471,
    });
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [locations, setLocations] = useState([]);
    const [mapRef, setMapRef] = useState();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [Hours, setHours] = useState('');
    const [Notes, setNotes] = useState('');
    const [EditMode, setEditMode] = useState(false);
    const [showNewMarker, setShowNewMarker] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const hasFoodTruckManagerAccess = localStorage.getItem('FoodTruckAppFoodTruckID') !== null;
    const [loggedIn, setLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');


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

    useEffect(() => {

        if (hasFoodTruckManagerAccess === false) {
            alert("No registered food truck found.!");
            // eslint-disable-next-line react-hooks/rules-of-hooks

            window.location.href = '/';
        } else {
            setSelectedFoodTruck(localStorage.getItem('FoodTruckAppFoodTruckID'));
        }
    }, []);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('FoodTruckAppID');
        const name = localStorage.getItem('FoodTruckAppFirstName');
        if (isLoggedIn && name) {
            setLoggedIn(true);
            setUserName(name);
        }
    }, []);

    const onMapLoad = React.useCallback((map) => {
        setMapRef(map);
    }, []);

    const handleTabClick = (tabIndex) => {
        setActiveTab(tabIndex);
    };
    const panTo = useCallback(({lat, lng}) => {
        mapRef.panTo({lat, lng});
        mapRef.setZoom(14);
    }, [mapRef]);


    useEffect(() => {
        setCurrentLocation({
            lat: Number(localStorage.getItem("FoodTruckAppCurrentLatitude")),
            lng: Number(localStorage.getItem("FoodTruckAppCurrentLongitude")),
        })
        const futureLocations = [
            {name: 'Location A', date: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)},
            {name: 'Location B', date: new Date(selectedDate.getTime() + 2 * 24 * 60 * 60 * 1000)},
            {name: 'Location C', date: new Date(selectedDate.getTime() + 3 * 24 * 60 * 60 * 1000)},
        ];

        // Update the locations array
        setLocations(futureLocations);
    }, [selectedDate]);


    useEffect(() => {
        const fetchFoodTruck = async () => {
            try {
                const response = await axios.post(url + '/getFoodTruckInformationById', {
                    id: localStorage.getItem('FoodTruckAppFoodTruckID')
                });
                setFoodTrucks(response.data);
                setName(response.data.name);
                setDescription(response.data.description);
                setAddress(response.data.address);
                setPhoneNumber(response.data.phoneNumber);
                setEmail(response.data.email);
                setWebsite(response.data.website);
                setHours(response.data.hours);
                setNotes(response.data.notes);
                panTo({lat: response.data.latitude, lng: response.data.longitude});
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchFoodTruck();
    }, [selectedFoodTruck, panTo]);


    const handleSave = async (event) => {
        event.preventDefault();
        try {
            await axios.post(url + '/updateFoodTruckInformation', {
                id: selectedFoodTruck,
                address,
                phoneNumber,
                email,
                hours: Hours,
                notes: Notes,
                latitude: currentLocation.lat,
                longitude: currentLocation.lng,
            });
            // setFoodTrucks(response.data);
            window.location.reload();
            alert('Food truck updated successfully!');
            setEditMode(false);
        } catch (error) {
            console.log(error);
            alert('Failed to update food truck!');
        }
    };
    const handleFoodTruckClick = (id) => {
        setSelectedFoodTruck(id);
        console.log(id);
    };

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

    function handleInputChangePhoneNumber() {
        setPhoneNumber(document.getElementById("phoneNumber").value);
    }

    function handleInputChangeEmail() {
        setEmail(document.getElementById("email").value);
    }

    function handleInputChangeHours() {
        setHours(document.getElementById("hours").value);
    }


    function handleInputChangeNotes() {
        setNotes(document.getElementById("notes").value);
    }

    function toggleEditMode() {
        setEditMode(!EditMode);
        console.log(center);
    }

    function handleMarker() {
        setShowNewMarker(true);
        setCenter(currentLocation);
        panTo({lat: currentLocation.lat, lng: currentLocation.lng});
    }

    function handleMarkerLocation(e) {
        // panTo({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        setCurrentLocation({
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        });
    }


    const handleDateChange = (event) => {
        setSelectedDate(new Date(event.target.value));
    };


    // function handleMarkerFutureLocation(e) {
    //     setFutureLocation({
    //         lat: e.latLng.lat(),
    //         lng: e.latLng.lng()
    //     });
    //     setCurrentLocation({
    //         lat: e.latLng.lat(),
    //         lng: e.latLng.lng()
    //     })
    // }

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

                                        {/*<li*/}
                                        {/*    className={`tabs-nav-item ${activeTab === 4 ? "active" : ""}`}*/}
                                        {/*    onClick={() => handleTabClick(4)}*/}
                                        {/*>*/}
                                        {/*    Future Locations*/}
                                        {/*</li>*/}
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
                                        {activeTab === 4 && <div>
                                            <h2 style={{textAlign: 'center'}}>Set Future Locations</h2>
                                            <label htmlFor="future-date">Start date:</label>
                                            <input
                                                type="date"
                                                id="future-date"
                                                name="future-date"
                                                value={selectedDate.toISOString().substr(0, 10)}
                                                min={new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().substr(0, 10)}
                                                max={`${new Date().getFullYear()}-12-31`}
                                                onChange={handleDateChange}
                                            />
                                            <ul>
                                                {locations.map((location, index) => (
                                                    <li key={index}>
                                                        {location.name} - {location.date.toDateString()}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        }

                                        {activeTab === 1 && <div>
                                            <h1>{foodTrucks.name}</h1>
                                            <table>
                                                <tbody>
                                                <tr>
                                                    <th>Type:</th>
                                                    <td>{foodTrucks.description}</td>
                                                </tr>
                                                </tbody>
                                                <tbody>
                                                <tr>
                                                    <th>Address:</th>
                                                    <td>
                                                        <p>{foodTrucks.address}</p>
                                                    </td>
                                                </tr>
                                                </tbody>
                                                <tbody>
                                                <tr>
                                                    <th>Phone Number:</th>
                                                    <td>
                                                        {EditMode ? (
                                                            <input type="text" id="phoneNumber" name="phoneNumber"
                                                                   value={phoneNumber}
                                                                   onChange={handleInputChangePhoneNumber}
                                                                   required/>) : (
                                                            <p>{foodTrucks.phoneNumber}</p>)}
                                                    </td>
                                                </tr>
                                                </tbody>
                                                <tbody>
                                                <tr>
                                                    <th>Email:</th>
                                                    <td>
                                                        {EditMode ? (
                                                            <input type="email" id="email" name="email" value={email}
                                                                   onChange={handleInputChangeEmail} required/>) : (
                                                            <p>{foodTrucks.email}</p>)}
                                                    </td>
                                                </tr>
                                                </tbody>
                                                <tbody>
                                                <tr>
                                                    <th>Website:</th>
                                                    <td><a href={foodTrucks.website} target="_blank"
                                                           className="website">{foodTrucks.website}</a></td>
                                                </tr>
                                                </tbody>
                                                <tbody>
                                                <tr>
                                                    <th>Today Open Hours:</th>
                                                    <td>
                                                        {EditMode ? (
                                                            <input type="text" id="hours" name="hours" value={Hours}
                                                                   onChange={handleInputChangeHours} required/>) : (
                                                            <p>{foodTrucks.hours}</p>)}
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            {EditMode === false &&
                                                <button type="edit" onClick={toggleEditMode}>Edit</button>}
                                            {EditMode === true &&
                                                <div>
                                                    <button type="save" onClick={handleSave}>Save</button>
                                                    <button type="marker" onClick={handleMarker}>Show Marker</button>
                                                </div>
                                            }
                                        </div>
                                        }
                                        {activeTab === 2 &&
                                            <div style={{width: '500px', height: '500px'}}>
                                                <FoodTruckReviews/>
                                            </div>}
                                        {activeTab === 3 && <div>
                                            <div className="cardcard-container">
                                                <div className="cardcard">
                                                    <h3 className="cardcard-title">Updates</h3>
                                                    <br/>
                                                    {EditMode ? (
                                                        <textarea type="text" id="notes" name="notes" value={Notes}
                                                                  rows="4" cols="50" onChange={handleInputChangeNotes}
                                                                  required/>) : (
                                                        <p className="cardcard-text">
                                                            {Notes}
                                                        </p>)}
                                                    <br/>
                                                    {EditMode === false &&
                                                        <button type="edit" onClick={toggleEditMode}>Edit</button>}
                                                    {EditMode === true &&
                                                        <div>
                                                            <button type="save" onClick={handleSave}>Save</button>
                                                        </div>
                                                    }
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
                                options={{
                                    draggable: true
                                }}
                            >
                                {activeTab !== 4 && (
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
                                    />)}


                                {activeTab !== 4 && showNewMarker && <MarkerF
                                    position={{
                                        lat: currentLocation.lat,
                                        lng: currentLocation.lng,
                                    }}
                                    draggable={true}
                                    onDragEnd={(e) => {
                                        handleMarkerLocation(e);
                                    }}/>
                                }
                                {/*{activeTab ===4 && (*/}
                                {/*    <MarkerF*/}
                                {/*        position={{*/}
                                {/*            lat: currentLocation.lat,*/}
                                {/*            lng: currentLocation.lng,*/}
                                {/*        }}*/}
                                {/*        icon={{*/}
                                {/*            url: foodTruckIcon,*/}
                                {/*            scaledSize: new window.google.maps.Size(35, 35),*/}
                                {/*            origin: new window.google.maps.Point(0, 0),*/}
                                {/*            anchor: new window.google.maps.Point(15, 15),*/}
                                {/*        }*/}
                                {/*        }*/}
                                {/*        draggable={true}*/}
                                {/*        onDragEnd={(e) => {*/}
                                {/*            handleMarkerFutureLocation(e);*/}
                                {/*        }}                                    />*/}
                                {/*)}*/}


                            </GoogleMap>


                        </div>
                    </>
                ) : (
                    <div className="loading-container">
                    </div>
                )}
            </div>
        </div>
    );
}

export default FoodTruckManager;

