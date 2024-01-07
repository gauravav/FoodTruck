import React, {useState} from 'react';
import './EditAccount.css';
import {url} from '../Helper/Helper';
import {useSnackbar} from '../Snackbar/SnackbarContext';

function EditAccount(props) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: localStorage.getItem('FoodTruckAppID'),
        username: localStorage.getItem('FoodTruckAppUsername'),
        email: localStorage.getItem('FoodTruckAppEmail'),
        firstname: localStorage.getItem('FoodTruckAppFirstName'),
        lastname: localStorage.getItem('FoodTruckAppLastName'),
        password: '',
    });
    const {showSnackbar} = useSnackbar();

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
    };


    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleToast = (message) => {
        showSnackbar(message);
    }

    const handleSaveChanges = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(url + '/updateAccountDetails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log(data.message);
            if (data.message === 'User updated successfully') {
                localStorage.setItem('FoodTruckAppUsername', formData.username);
                localStorage.setItem('FoodTruckAppEmail', formData.email);
                localStorage.setItem('FoodTruckAppFirstName', formData.firstname);
                localStorage.setItem('FoodTruckAppLastName', formData.lastname);

                setIsEditing(false);
                // alert('User updated successfully');
                handleToast("User details updated successfully");
            }
        } catch (error) {
            console.error(error);
            // alert('User update failed');
            handleToast("User details update failed");
        }
    };

    return (

        <div className="edit-account">
            <nav className="navbar">
                <div className="navbar-left">
                    <a href="/" className="navbar-brand">
                        Food Truck Locator
                    </a>

                </div>
                <div style={{marginRight: "3%"}} className="navbar-right">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a href="/" className="nav-link">
                                Home
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className="account-details">
                <h2 style={{textAlign: "center"}}>Account Details</h2>
                <br/>
                <br/>
                <div className="details">
                    <div className="field">
                        <label className="labelEdit" htmlFor="username">Username:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <div className="value">{formData.username}</div>
                        )}
                    </div>
                    <div className="field">
                        <label className="labelEdit" htmlFor="email">Email:</label>
                        {isEditing ? (
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <div className="value">{formData.email}</div>
                        )}
                    </div>
                    <div className="field">
                        <label className="labelEdit" htmlFor="firstname">First Name:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <div className="value">{formData.firstname}</div>
                        )}
                    </div>
                    <div className="field">
                        <label className="labelEdit" htmlFor="lastname">Last Name:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <div className="value">{formData.lastname}</div>
                        )}
                    </div>
                    {isEditing && (
                        <div className="field">
                            <label className="labelEdit" htmlFor="password">New Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                </div>
                <div className="actions">
                    {isEditing ? (
                        <div className="editing-actions">
                            <button onClick={() => setIsEditing(false)}>Cancel</button>
                            <button onClick={handleSaveChanges}>Save Changes</button>
                        </div>
                    ) : (
                        <button onClick={handleEdit}>Edit</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EditAccount;