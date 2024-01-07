package com.ssdi.ssditestbackend.objectClasses;

public class Review {
    int id;

    int user_id;

    String name;

    int foodtruck_id;

    String review;

    int rating;

    String created_at;

    String message;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "Review{" +
                "id=" + id +
                ", user_id=" + user_id +
                ", foodtruck_id=" + foodtruck_id +
                ", review='" + review + '\'' +
                ", rating=" + rating +
                ", created_at='" + created_at + '\'' +
                '}';
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getCreated_at() {
        return created_at;
    }

    public void setCreated_at(String created_at) {
        this.created_at = created_at;
    }
}
