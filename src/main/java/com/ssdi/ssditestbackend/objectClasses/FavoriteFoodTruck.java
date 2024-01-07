package com.ssdi.ssditestbackend.objectClasses;

public class FavoriteFoodTruck {

    int user_id;

    int foodtruck_id;

    String message;

    @Override
    public String toString() {
        return "FavoriteFoodTruck{" +
                "user_id=" + user_id +
                ", foodtruck_id=" + foodtruck_id +
                ", message='" + message + '\'' +
                '}';
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public int getFoodtruck_id() {
        return foodtruck_id;
    }

    public void setFoodtruck_id(int foodtruck_id) {
        this.foodtruck_id = foodtruck_id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
