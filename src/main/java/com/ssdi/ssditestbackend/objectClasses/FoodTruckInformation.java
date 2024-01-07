package com.ssdi.ssditestbackend.objectClasses;

//ID, Name, Description, Address, PhoneNumber, Email, Website, Hours, foodTruckUniqueID
public class FoodTruckInformation {

    private int id;
    private String name;
    private String description;
    private String address;
    private String phoneNumber;
    private String email;
    private String website;
    private String hours;

    private Float latitude;

    private Float longitude;

    private String updates_time;

    private String notes;

    private String what3words;

    private String Message;

    public String getMessage() {
        return Message;
    }

    public void setMessage(String message) {
        Message = message;
    }

    public String getWhat3words() {
        return what3words;
    }

    public void setWhat3words(String what3words) {
        this.what3words = what3words;
    }

    @Override
    public String toString() {
        return "FoodTruckInformation{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", address='" + address + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", email='" + email + '\'' +
                ", website='" + website + '\'' +
                ", hours='" + hours + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", updates_time='" + updates_time + '\'' +
                ", Notes='" + notes + '\'' +
                '}';
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getHours() {
        return hours;
    }

    public void setHours(String hours) {
        this.hours = hours;
    }

    public Float getLatitude() {
        return latitude;
    }

    public void setLatitude(Float latitude) {
        this.latitude = latitude;
    }

    public Float getLongitude() {
        return longitude;
    }

    public void setLongitude(Float longitude) {
        this.longitude = longitude;
    }

    public String getUpdates_time() {
        return updates_time;
    }

    public void setUpdates_time(String updates_time) {
        this.updates_time = updates_time;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
