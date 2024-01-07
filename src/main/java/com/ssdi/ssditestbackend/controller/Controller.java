package com.ssdi.ssditestbackend.controller;

import com.ssdi.ssditestbackend.objectClasses.*;
import com.ssdi.ssditestbackend.util.DBData;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Logger;

@RestController
public class Controller {
    Logger logger = Logger.getLogger(Controller.class.getName());



    @CrossOrigin("http://localhost:3000")
    @PostMapping(value = "/login")
    public ResponseEntity<AccountDetails> login(@RequestBody AccountDetails test) throws SQLException {
        logger.info("username: " + test.getUsername());
        logger.info("password: " + test.getPassword());
        AccountDetails temp = DBData.login(test.getUsername(), test.getPassword());
        return new ResponseEntity<>(temp, HttpStatus.OK);
    }

    @CrossOrigin("http://localhost:3000")
    @PostMapping(value = "/AdminLogin")
    public ResponseEntity<AccountDetails> AdminLogin(@RequestBody AccountDetails test) throws SQLException {
        logger.info("username: " + test.getUsername());
        logger.info("password: " + test.getPassword());
        if (test.getUsername().equals("admin") && test.getPassword().equals("admin123")) {
            test.setMessage("Admin");
        }
        return new ResponseEntity<>(test, HttpStatus.OK);
    }

    @CrossOrigin("http://localhost:3000")
    @GetMapping(value = "/getAllFoodTrucks")
    public ResponseEntity<ArrayList<FoodTruckInformation>> getAllFoodTrucks() throws SQLException {
        ArrayList<FoodTruckInformation> list = DBData.getAllFoodTrucks();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @CrossOrigin("http://localhost:3000")
    @PostMapping(value = "/register")
    public ResponseEntity<AccountDetails> register(@RequestBody AccountDetails user) throws SQLException {
        AccountDetails temp = DBData.registerUser(user);
        logger.info(temp.toString());
        return new ResponseEntity<>(temp, HttpStatus.OK);
    }

    @CrossOrigin("http://localhost:3000")
    @PostMapping(value = "/createFoodTruck")
    public ResponseEntity<FoodTruckInformation> createFoodTruck(@RequestBody FoodTruckInformation foodTruckInformation) throws SQLException {
        logger.info(foodTruckInformation.toString());
        FoodTruckInformation temp = DBData.createFoodTruck(foodTruckInformation);
        logger.info(temp.toString());

        return new ResponseEntity<>(temp, HttpStatus.OK);
    }

    @CrossOrigin("http://localhost:3000")
    @PostMapping(value = "/updateAccountDetails")
    public ResponseEntity<AccountDetails> update(@RequestBody AccountDetails user) throws SQLException {
        logger.info("Input at Update User:" + user.toString());
        AccountDetails temp = DBData.updateAccountDetails(user);
        logger.info("Output at Update User:" + temp.toString());
        return new ResponseEntity<>(temp, HttpStatus.OK);
    }

    @CrossOrigin("http://localhost:3000")
    @PostMapping(value = "/getUserInfoById")
    public ResponseEntity<AccountDetails> getUserInfoById(@RequestBody AccountDetails user) throws SQLException {
        AccountDetails temp = DBData.getUserInfoById(user.getId());
        logger.info(temp.toString());
        return new ResponseEntity<>(temp, HttpStatus.OK);
    }

    @CrossOrigin("http://localhost:3000")
    @PostMapping(value = "/getFoodTrucksByDistance")
    public ResponseEntity<ArrayList<FoodTruckInformation>> getRestaurants(@RequestBody Circle input) throws SQLException {
        ArrayList<FoodTruckInformation> list = DBData.getFoodTrucksByDistance(input);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @CrossOrigin("http://localhost:3000")
    @PostMapping(value = "/getFoodTruckInformationById")
    public ResponseEntity<FoodTruckInformation> getFoodTruckInformationById(@RequestBody FoodTruckInformation foodTruckInformation) throws SQLException {
        FoodTruckInformation temp = DBData.getFoodTruckInformationById(foodTruckInformation.getId());
        return new ResponseEntity<>(temp, HttpStatus.OK);
    }

    @CrossOrigin("http://localhost:3000")
    @PostMapping(value = "/updateFoodTruckInformation")
    public ResponseEntity<FoodTruckInformation> updateFoodTruckInformation(@RequestBody FoodTruckInformation foodTruckInformation) throws SQLException {
        FoodTruckInformation temp = DBData.updateFoodTruckInformation(foodTruckInformation);
        return new ResponseEntity<>(temp, HttpStatus.OK);
    }

    @CrossOrigin("http://localhost:3000")
    @GetMapping(value = "/getReviewsByFoodTruckId")
    public ResponseEntity<ArrayList<Review>> getReviewsByFoodTruckId(@Param("id") int id) throws SQLException {
        ArrayList<Review> temp = DBData.getReviewsByFoodTruckId(id);
        return new ResponseEntity<>(temp, HttpStatus.OK);
    }

    @CrossOrigin("http://localhost:3000")
    @PostMapping(value = "/addReview")
    public ResponseEntity<Review> addReview(@RequestBody Review review) throws SQLException {
        Review temp = DBData.addReview(review);
        return new ResponseEntity<>(temp, HttpStatus.OK);
    }

    @CrossOrigin("http://localhost:3000")
    @GetMapping(value = "/getFavFoodTrucksByUserId")
    public ResponseEntity<ArrayList<FoodTruckInformation>> getFavFoodTrucksByUserId(@Param("id") int id) throws SQLException {
        ArrayList<FoodTruckInformation> temp = DBData.getFavFoodTrucksByUserId(id);
        return new ResponseEntity<>(temp, HttpStatus.OK);
    }

    @CrossOrigin("http://localhost:3000")
    @GetMapping(value = "/getFavFoodTrucksArrayByUserId")
    public ResponseEntity<ArrayList<Integer>> getFavFoodTrucksArrayByUserId(@Param("id") int id) throws SQLException {
        ArrayList<Integer> temp = DBData.getFavFoodTrucksArrayByUserId(id);
        return new ResponseEntity<>(temp, HttpStatus.OK);
    }

    @CrossOrigin("http://localhost:3000")
    @PostMapping(value = "/addOrRemoveFavFoodTruck")
    public ResponseEntity<FavoriteFoodTruck> addOrRemoveFavFoodTruck(@RequestBody FavoriteFoodTruck favoriteFoodTruck) throws SQLException {
        FavoriteFoodTruck temp = DBData.addOrRemoveFavFoodTruck(favoriteFoodTruck);
        return new ResponseEntity<>(temp, HttpStatus.OK);
    }


//
//    @CrossOrigin("http://localhost:3000")
//    @PostMapping(value = "/setRestaurantCurrentLocation")
//    public ResponseEntity<Location> setRestaurantCurrentLocation(@RequestBody Location location) throws SQLException{
//        DBData.setRestaurantCurrentLocation(location);
//        return new ResponseEntity<>(location, HttpStatus.OK);
//    }
//
//    @CrossOrigin("http://localhost:3000")
//    @PostMapping(value = "/setFoodTruckLocation")
//    public ResponseEntity<Location> setFoodTruckLocation(@RequestBody Location location) throws SQLException{
//        DBData.setFoodTruckLocation(location);
//        return new ResponseEntity<>(location, HttpStatus.OK);
//    }
//
//    @CrossOrigin("http://localhost:3000")
//    @PostMapping(value = "/getFoodTruckInformation")
//    public ResponseEntity<FoodTruckInformation> getFoodTruckInformation(@RequestBody FoodTruckInformation foodTruckInformation) throws SQLException{
//        FoodTruckInformation temp = DBData.getFoodTruckInformation(foodTruckInformation);
//        return new ResponseEntity<>(temp, HttpStatus.OK);
//    }
//
//    @CrossOrigin("http://localhost:3000")
//    @PostMapping(value = "/updateFoodTruckInformation")
//    public ResponseEntity<FoodTruckInformation> updateFoodTruckInformation(@RequestBody FoodTruckInformation foodTruckInformation) throws SQLException{
//        DBData.updateFoodTruckInformation(foodTruckInformation);
//        return new ResponseEntity<>(foodTruckInformation, HttpStatus.OK);
//    }
}