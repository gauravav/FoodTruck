package com.ssdi.ssditestbackend.objectClasses;

public class AccountDetails {

    private int id;

    private String username;

    private String password;

    private String email;

    private String firstname;

    private String lastname;

    private String login_type;

    private String status;

    private String created_at;

    private String Food_Truck_ID;

    private String message;

    @Override
    public String toString() {
        return "AccountDetails{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                ", firstname='" + firstname + '\'' +
                ", lastname='" + lastname + '\'' +
                ", login_type='" + login_type + '\'' +
                ", status='" + status + '\'' +
                ", created_at='" + created_at + '\'' +
                ", Food_Truck_ID='" + Food_Truck_ID + '\'' +
                ", message='" + message + '\'' +
                '}';
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getLogin_type() {
        return login_type;
    }

    public void setLogin_type(String login_type) {
        this.login_type = login_type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreated_at() {
        return created_at;
    }

    public void setCreated_at(String created_at) {
        this.created_at = created_at;
    }

    public String getFood_Truck_ID() {
        return Food_Truck_ID;
    }

    public void setFood_Truck_ID(String food_Truck_ID) {
        Food_Truck_ID = food_Truck_ID;
    }
}
