import React, {useCallback, useEffect, useRef, useState} from 'react';
import {GoogleMap, InfoWindow, MarkerF, useLoadScript} from '@react-google-maps/api';
import './UserFoodTruckPage.css';
import axios from "axios";
import foodTruckIcon from '../Images/foodTruckIcon.png';
import Loading from '../Images/loading.gif';
import {faHeart as fasHeart} from '@fortawesome/free-solid-svg-icons';
import {faHeart as farHeart} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {url} from "../Helper/Helper";
import {useSnackbar} from "../Snackbar/SnackbarContext";


function UserFoodTruckPage() {
    const [foodTrucks, setFoodTrucks] = useState([]);
    const [selectedFoodTruck, setSelectedFoodTruck] = useState(null);
    const [distance, setDistance] = useState(localStorage.getItem('FoodTruckAppDistance'));
    const mapRef = useRef(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [loading, setLoading] = useState(true); // Add a state for loading
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [showInfoWindow, setShowInfoWindow] = useState(false);
    const {showSnackbar} = useSnackbar();


    const handleMarkerHover = (marker) => {
        setSelectedMarker(marker);
        setShowInfoWindow(false);
        setTimeout(() => {
            setShowInfoWindow(true);
        }, 200);
    };

    const handleToast = (message) => {
        showSnackbar(message);
    }
    const handleMarkerClose = () => {
        setSelectedMarker(null);
        setShowInfoWindow(false);
    };

    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_API_KEY, // Use environment variable for API key
    });
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('FoodTruckAppID') !== null);
    useEffect(() => {
        if (!isLoggedIn) {
            window.location.href = "/login";
        }
    });
    const [showDropdown, setShowDropdown] = useState(false);


    function handleLikeDislikeClick(id) {

    }

    const centerMapOnCurrentLocation = useCallback(() => {
        if (mapRef.current && currentLocation) {
            mapRef.current.panTo({
                lat: currentLocation.latitude,
                lng: currentLocation.longitude
            });
        }
    }, [currentLocation]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setCurrentLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        });
    }, []);

    useEffect(() => {
        if (currentLocation && distance) {
            console.log(url + '/getFoodTrucksByDistance');
            // Fetch food trucks from endpoint
            axios.post(url + '/getFoodTrucksByDistance', {
                "latitude": currentLocation.latitude.toString(),
                "longitude": currentLocation.longitude.toString(),
                "distance": distance
            })
                .then((response) => {
                    // Get an array of favorite food truck IDs
                    axios.get(url + '/getFavFoodTrucksArrayByUserId?id=' + Number(localStorage.getItem('FoodTruckAppID')))
                        .then((favResponse) => {
                            const favFoodTruckIds = favResponse.data;
                            // Map over the response data and add the isFav property
                            const foodTrucksWithFav = response.data.map(foodTruck => {
                                return {
                                    ...foodTruck,
                                    isFav: favFoodTruckIds.includes(foodTruck.id)
                                }
                            });
                            setFoodTrucks(foodTrucksWithFav);
                            setLoading(false); // Set loading to false after data is fetched
                            // console.log(foodTrucks);
                        }).then(() => {
                        console.log(foodTrucks);
                    })
                        .catch((error) => console.log(error));
                })
                .catch((error) => console.log(error));
        }
    }, [currentLocation, distance]);

    useEffect(() => {
        centerMapOnCurrentLocation();
    }, [centerMapOnCurrentLocation]);

    const handleFoodTruckClick = (id) => {
        setSelectedFoodTruck(id);
        localStorage.setItem('FoodTruckAppSelectedFoodTruck', id);
        console.log(id);
        window.location.href = '/food-truck-details';
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

    const toggleFav = (id, event) => {
        event.stopPropagation(); // prevent click event from bubbling up
        // toggle the favorite status of the food truck with the given id
        axios.post(url + '/addOrRemoveFavFoodTruck', {
            "user_id": Number(localStorage.getItem('FoodTruckAppID')),
            "foodtruck_id": id
        })
            .then((response) => {
                if (response.data.message === "Food Truck added to favorites successfully") {
                    handleToast("Food Truck added to favorites successfully")
                    console.log(response.data.message);
                    setFoodTrucks(foodTrucks.map((foodTruck) => {
                        if (foodTruck.id === id) {
                            return {...foodTruck, isFav: true};
                        } else {
                            return foodTruck;
                        }
                    }));
                } else if (response.data.message === "Food Truck removed from favorites successfully") {
                    handleToast("Food Truck removed from favorites successfully")
                    console.log(response.data.message);
                    setFoodTrucks(foodTrucks.map((foodTruck) => {
                        if (foodTruck.id === id) {
                            return {...foodTruck, isFav: false};
                        } else {
                            return foodTruck;
                        }
                    }));
                }
            });
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


    const handleDropdown = () => {
        setShowDropdown(!showDropdown);
    };


    const showOnMap = (id, event) => {
        event.stopPropagation(); // prevent click event from bubbling up
        foodTrucks.map((foodTruck) => {
            if (foodTruck.id === id) {
                handleToast("Showing " + foodTruck.name + " on map");
                setCurrentLocation({
                    latitude: foodTruck.latitude,
                    longitude: foodTruck.longitude
                });
                // mapRef.current.panTo({
                //     lat: foodTruck.latitude,
                //     lng: foodTruck.longitude
                // });
                mapRef.current.setZoom(17);
                return foodTruck;
            }
        });
    }

    function handleMarkerClick(id) {

        localStorage.setItem("FoodTruckAppSelectedFoodTruck", foodTrucks[id].id);
        window.location.href = '/food-truck-details';
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
                        <div className="food-truck-cards">
                            {foodTrucks.map((foodTruck) => (
                                <div
                                    key={foodTruck.id}
                                    className={`food-truck-card ${
                                        selectedFoodTruck?.id === foodTruck.id ? "selected" : ""
                                    }`}
                                    onClick={() => handleFoodTruckClick(foodTruck.id)}
                                >
                                    <div className='card-headline'>
                                        <h2>{foodTruck.name}</h2>
                                        <div className="like-dislike-icons">
                                            <FontAwesomeIcon icon={foodTruck.isFav ? fasHeart : farHeart}
                                                             onClick={(event) => toggleFav(foodTruck.id, event)}/>
                                        </div>
                                    </div>
                                    <div className='cardSecondLine'>
                                        <p style={{width: '70%'}}>{foodTruck.description}</p>
                                        <p>{foodTruck.hours}</p>
                                    </div>
                                    <div className='cardThirdLine'>
                                        <p>Address: {foodTruck.address}</p>
                                        <button type="showOnMap"
                                                onClick={(event) => showOnMap(foodTruck.id, event)}>Show on Map
                                        </button>
                                    </div>
                                    {foodTruck.what3words !== '' &&
                                        <span>What3Words:
                                            <span> </span>
                                            <a href={"https://what3words.com/" + foodTruck.what3words}
                                               onClick={(e) => e.stopPropagation()}
                                               target="_blank">{foodTruck.what3words}</a>
                                    </span>
                                    }
                                </div>
                            ))}
                        </div>
                        <div className="map-container">
                            <GoogleMap
                                mapContainerStyle={{height: "100%", width: "100%"}}
                                center={{lat: currentLocation.latitude, lng: currentLocation.longitude}}
                                zoom={11}
                                onLoad={(map) => {
                                    mapRef.current = map;
                                    centerMapOnCurrentLocation();
                                }}
                            >
                                {foodTrucks.map(({latitude, longitude, name}, id) => (
                                    <MarkerF
                                        key={id}
                                        position={{
                                            lat: latitude,
                                            lng: longitude,
                                        }}
                                        icon={{
                                            url: foodTruckIcon,
                                            scaledSize: new window.google.maps.Size(25, 25),
                                            origin: new window.google.maps.Point(0, 0),
                                            anchor: new window.google.maps.Point(15, 15),
                                        }}
                                        onMouseOver={() => handleMarkerHover(id)}
                                        onClick={() => handleMarkerClick(id)}
                                    />
                                ))}
                                {selectedMarker && (
                                    <InfoWindow
                                        position={{
                                            lat: foodTrucks[selectedMarker].latitude,
                                            lng: foodTrucks[selectedMarker].longitude,
                                        }}
                                        onCloseClick={handleMarkerClose}
                                    >
                                        <div>{foodTrucks[selectedMarker].name}</div>
                                    </InfoWindow>
                                )}
                                <MarkerF
                                    position={{
                                        lat: Number(localStorage.getItem("FoodTruckAppCurrentLatitude")),
                                        lng: Number(localStorage.getItem("FoodTruckAppCurrentLongitude")),
                                    }}
                                />
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

export default UserFoodTruckPage;


