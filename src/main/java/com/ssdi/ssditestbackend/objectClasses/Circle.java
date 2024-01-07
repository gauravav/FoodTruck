package com.ssdi.ssditestbackend.objectClasses;

public class Circle {
    int distance;

    Double latitude;

    Double longitude;

    @Override
    public String toString() {
        return "Circle{" +
                "distance=" + distance +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                '}';
    }

    public int getDistance() {
        return distance;
    }

    public void setDistance(int distance) {
        this.distance = distance;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
