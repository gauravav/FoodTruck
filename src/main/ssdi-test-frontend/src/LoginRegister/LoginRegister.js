import React, {useState} from 'react';
import './LoginRegister.css';
import {url} from "../Helper/Helper";
import {useSnackbar} from "../Snackbar/SnackbarContext";

function LoginRegister() {
    const [activeTab, setActiveTab] = useState('login');
    const [formDataLogin, setFormDataLogin] = useState({
        username: '',
        password: '',
    });
    const {showSnackbar} = useSnackbar();
    const [formDataRegister, setFormDataRegister] = useState({
        username: '',
        password: '',
        email: '',
        firstname: '',
        lastname: '',
        login_type: 'user',
    });


    const handleToast = (message) => {
        showSnackbar(message);
    }
    const handleInputChangeLogin = (event) => {
        const {name, value} = event.target;
        setFormDataLogin({...formDataLogin, [name]: value});
    };

    const handleInputChangeRegister = (event) => {
        const {name, value} = event.target;
        setFormDataRegister({...formDataRegister, [name]: value});
    }
    const handleSubmitLogin = async (event) => {
        event.preventDefault();
        console.log(formDataLogin);

        try {
            const response = await fetch(url + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataLogin)
            });

            const data = await response.json();
            console.log(data.message);
            if (data.message === "Login successful") {
                console.log("Login successful");
                localStorage.setItem('FoodTruckAppID', data.id);
                localStorage.setItem('FoodTruckAppUsername', data.username);
                localStorage.setItem('FoodTruckAppEmail', data.email);
                localStorage.setItem('FoodTruckAppFirstName', data.firstname);
                localStorage.setItem('FoodTruckAppLastName', data.lastname);
                localStorage.setItem('FoodTruckAppLoginType', data.login_type);
                localStorage.setItem('FoodTruckAppStatus', data.status);
                localStorage.setItem('FoodTruckAppCreatedAt', data.created_at);
                if (data.food_Truck_ID !== null) {
                    localStorage.setItem('FoodTruckAppFoodTruckID', data.food_Truck_ID);
                }
                window.location.href = '/';
            } else if (data.message === "Invalid username or password") {
                console.log("Invalid username or password");
                // alert("Invalid username or password");
                handleToast("Invalid username or password, please try again");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmitRegister = async (event) => {
        event.preventDefault();
        console.log(formDataRegister);

        try {
            const response = await fetch(url + '/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataRegister)
            });

            const data = await response.json();
            console.log(data.message);
            if (data.message === "Registration successful. User ID: " + data.id) {
                console.log("Registration successful");
                localStorage.setItem('FoodTruckAppID', data.id);
                localStorage.setItem('FoodTruckAppUsername', data.username);
                localStorage.setItem('FoodTruckAppEmail', data.email);
                localStorage.setItem('FoodTruckAppFirstName', data.firstname);
                localStorage.setItem('FoodTruckAppLastName', data.lastname);
                localStorage.setItem('FoodTruckAppLoginType', data.login_type);
                localStorage.setItem('FoodTruckAppStatus', data.status);
                localStorage.setItem('FoodTruckAppCreatedAt', data.created_at);
                if (data.food_Truck_ID !== null) {
                    localStorage.setItem('FoodTruckAppFoodTruckID', data.food_Truck_ID);
                }
                window.location.href = '/';
            } else if (data.message === "Email already exists. Please use a different email") {
                console.log("User already exists");
                // alert("Email already exists. Please use a different email");
                handleToast("Email already exists. Please use a different email");
            } else if (data.message === "Username already exists. Please choose a different username") {
                console.log("Username already exists. Please choose a different username");
                // alert("Username already exists. Please choose a different username");
                handleToast("Username already exists. Please choose a different username");
            } else if (data.message === 'Registration failed') {
                console.log("Registration failed");
                // alert("Registration failed");
                handleToast("Registration failed");
            }
        } catch (error) {
            console.error(error);
        }
    }


    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

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
            <div className="login-register-tabs">
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => handleTabChange('login')}
                    >
                        Login
                    </button>
                    <button
                        className={`tab ${activeTab === 'register' ? 'active' : ''}`}
                        onClick={() => handleTabChange('register')}
                    >
                        Register
                    </button>
                </div>
                <div className="card">
                    {activeTab === 'login' ? (
                        <form className="form" onSubmit={handleSubmitLogin}>
                            <label htmlFor="username">Username:</label>
                            <input type="username" id="username" name="username" value={formDataLogin.username}
                                   onChange={handleInputChangeLogin} required/>
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" name="password" value={formDataLogin.password}
                                   onChange={handleInputChangeLogin} required/>
                            <button type="submit">Login</button>
                        </form>
                    ) : (
                        <form className="form" onSubmit={handleSubmitRegister}>
                            <label htmlFor="username">Username:</label>
                            <input type="username" id="username" name="username" value={formDataRegister.username}
                                   onChange={handleInputChangeRegister} required/>
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" name="password" value={formDataRegister.password}
                                   onChange={handleInputChangeRegister} required/>
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="email" value={formDataRegister.email}
                                   onChange={handleInputChangeRegister} required/>
                            <label htmlFor="firstname">First Name:</label>
                            <input type="firstname" id="firstname" name="firstname" value={formDataRegister.firstname}
                                   onChange={handleInputChangeRegister} required/>
                            <label htmlFor="lastname">Last Name:</label>
                            <input type="lastname" id="lastname" name="lastname" value={formDataRegister.lastname}
                                   onChange={handleInputChangeRegister} required/>
                            <button type="submit">Register</button>
                        </form>
                    )}
                </div>
            </div>

        </div>
    );
}

export default LoginRegister;
