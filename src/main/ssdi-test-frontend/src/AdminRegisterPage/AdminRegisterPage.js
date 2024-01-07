import React, {useState} from 'react';
import './AdminRegisterPage.css';
import {url} from "../Helper/Helper";
import {useSnackbar} from "../Snackbar/SnackbarContext";

function AdminRegisterPage() {
    const [formDataRegister, setFormDataRegister] = useState({
        Name: '',
        Description: '',
        PhoneNumber: '',
        Mail: '',
        Website: '',
        Hours: '',
        Latitude: '',
        Longitude: '',
        UserID: '',
    });

    const [formDataLogin, setFormDataLogin] = useState({
        username: '',
        password: '',
    });
    const {showSnackbar} = useSnackbar();
    const handleInputChangeLogin = (event) => {
        const {name, value} = event.target;
        setFormDataLogin({...formDataLogin, [name]: value});
    };
    const [isAdmin, setIsAdmin] = useState(false);

    const handleSubmitLogin = async (event) => {
        event.preventDefault();
        console.log(formDataLogin);

        try {
            const response = await fetch(url + '/AdminLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataLogin)
            });

            const data = await response.json();
            console.log(data.message);
            if (data.message === "Admin") {
                console.log("Admin");
                setIsAdmin(true);
                handleToast("Admin Login Successful");
            }
        } catch (error) {
            console.error(error);
            handleToast("Admin Login Failed");
        }
    };

    function handleToast(message) {
        showSnackbar(message);
    }


    const handleInputChangeRegister = (event) => {
        const {name, value} = event.target;
        setFormDataRegister({...formDataRegister, [name]: value});
    }


    const handleSubmitRegister = async (event) => {
        event.preventDefault();
        console.log(formDataRegister);

        try {
            const response = await fetch(url + '/createFoodTruck', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formDataRegister.Name,
                    description: formDataRegister.Description,
                    phoneNumber: formDataRegister.PhoneNumber,
                    email: formDataRegister.Mail,
                    website: formDataRegister.Website,
                    hours: formDataRegister.Hours,
                    latitude: formDataRegister.Latitude,
                    longitude: formDataRegister.Longitude,
                    notes: formDataRegister.UserID,
                })
            });

            const data = await response.json();
            console.log(data.message);
            //if first words of message are "Food Truck" then it was successful
            if (data.message.substring(0, 10) === "Food Truck") {
                handleToast(data.message);
                formDataRegister.Name = "";
                formDataRegister.Description = "";
                formDataRegister.PhoneNumber = "";
                formDataRegister.Mail = "";
                formDataRegister.Website = "";
                formDataRegister.Hours = "";
                formDataRegister.Latitude = "";
                formDataRegister.Longitude = "";
                formDataRegister.UserID = "";
            }
            // alert(data.message);
            if (data.message === "User does not exist. Please make him register.") {
                alert("User does not exist. Please make him register first");
            }


        } catch (error) {
            console.error(error);
        }
    }


    return (
        <div className="main-div">
            <nav className="navbar">
                <div className="navbar-left">
                    <a href="/" className="navbar-brand">Food Truck Locator</a>
                </div>
                <div style={{marginRight: '3%'}} className="navbar-right">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a href="/FoodTruckManager" className="nav-link">Food Truck</a>
                        </li>
                        <li className="nav-item">
                            <a href="/login" className="nav-link">Login</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className="card">
                {!isAdmin ? (
                    <div>
                        <h2>Admin Login</h2>
                        <br/>
                        <form className="form" onSubmit={handleSubmitLogin}>
                            <label htmlFor="username">Username:</label>
                            <input type="username" id="username" name="username" value={formDataLogin.username}
                                   onChange={handleInputChangeLogin} required/>
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" name="password" value={formDataLogin.password}
                                   onChange={handleInputChangeLogin} required/>
                            <button type="submit" className="btn btn-primary">Login</button>
                        </form>
                    </div>
                ) : (

                    <div>
                        <h2>Register Food Truck</h2>
                        <br/>
                        <form className="form" onSubmit={handleSubmitRegister}>
                            <label htmlFor="Name">Food Truck Name:</label>
                            <input type="Name" id="Name" name="Name" value={formDataRegister.Name}
                                   onChange={handleInputChangeRegister} required/>
                            <label htmlFor="Description">Food Truck Description:</label>
                            <input type="Description" id="Description" name="Description"
                                   value={formDataRegister.Description} onChange={handleInputChangeRegister} required/>
                            <label htmlFor="Mail">Contact Email:</label>
                            <input type="Mail" id="Mail" name="Mail" value={formDataRegister.Mail}
                                   onChange={handleInputChangeRegister} required/>
                            <label htmlFor="Website">Food Truck Website:</label>
                            <input type="Website" id="Website" name="Website" value={formDataRegister.Website}
                                   onChange={handleInputChangeRegister} required/>
                            <label htmlFor="Hours">Open Hours:</label>
                            <input type="Hours" id="Hours" name="Hours" value={formDataRegister.Hours}
                                   onChange={handleInputChangeRegister} required/>
                            <label htmlFor="Latitude">Location Latitude:</label>
                            <input type="Latitude" id="Latitude" name="Latitude" value={formDataRegister.Latitude}
                                   onChange={handleInputChangeRegister} required/>
                            <label htmlFor="Longitude">Location Longitude:</label>
                            <input type="Longitude" id="Longitude" name="Longitude" value={formDataRegister.Longitude}
                                   onChange={handleInputChangeRegister} required/>
                            <label htmlFor="UserID">Food Truck Manager Username:</label>
                            <input type="UserID" id="UserID" name="UserID" value={formDataRegister.UserID}
                                   onChange={handleInputChangeRegister} required/>
                            <button type="submit">Register</button>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
}

export default AdminRegisterPage;
