package com.ssdi.ssditestbackend.util;

import com.ssdi.ssditestbackend.helpers.GeoLocation;
import com.ssdi.ssditestbackend.helpers.Helpers;
import com.ssdi.ssditestbackend.helpers.What3Words;
import com.ssdi.ssditestbackend.objectClasses.*;

import org.springframework.data.relational.core.sql.SQL;

import javax.xml.transform.Result;
import java.sql.*;
import java.util.ArrayList;
import java.util.logging.Logger;

public class DBData {

    //Write your DB Credentials here
    private final static String DBurl = "jdbc:mysql://localhost:3306/";
    private final static String DBusername = "";
    private final static String DBpassword = "";
    static Connection DBconn;

    static Logger logger = Logger.getLogger(DBData.class.getName());

    static {
        try {
            DBconn = DriverManager.getConnection(DBurl, DBusername, DBpassword);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }


    public static AccountDetails login(String username, String password) throws SQLException {
        Logger logger = Logger.getLogger(DBData.class.getName());
        logger.info("username: " + username + " password: " + password);
        logger.info("Inside checkLogin");
//    DBconn = DriverManager.getConnection(DBurl, DBusername, DBpassword);
        PreparedStatement ps = DBconn.prepareStatement("select * from AccountDetails where username = ? and password = ?");
        ps.setString(1, username);
        ps.setString(2, password);
        ResultSet rs = ps.executeQuery();
        if (!rs.next()) {
            String message = "Invalid username or password";
            AccountDetails user = new AccountDetails();
            user.setMessage(message);
            return user;
        } else {
            String message = "Login successful";
            AccountDetails user = new AccountDetails();
            user.setEmail(rs.getString("email"));
            user.setLogin_type(rs.getString("login_type"));
            user.setStatus(rs.getString("status"));
            user.setFirstname(rs.getString("firstname"));
            user.setLastname(rs.getString("lastname"));
            user.setId(rs.getInt("id"));
            user.setUsername(rs.getString("username"));
            user.setPassword(rs.getString("password"));
            user.setCreated_at(rs.getString("created_at"));
            user.setFood_Truck_ID(rs.getString("Food_Truck_ID"));
            user.setMessage(message);
            return user;
        }
    }


    public static AccountDetails registerUser(AccountDetails user) throws SQLException {
        PreparedStatement ps1 = DBconn.prepareStatement("select * from AccountDetails where email = ?");
        ps1.setString(1, user.getEmail());
        ResultSet rs1 = ps1.executeQuery();
        if (rs1.next()) {
            String message = "Email already exists. Please use a different email";
            user.setMessage(message);
            return user;
        } else {
            PreparedStatement ps2 = DBconn.prepareStatement("select * from AccountDetails where username = ?");
            ps2.setString(1, user.getUsername());
            ResultSet rs2 = ps2.executeQuery();
            if (rs2.next()) {
                String message = "Username already exists. Please choose a different username";
                user.setMessage(message);
                return user;
            } else {
                PreparedStatement ps = DBconn.prepareStatement("insert into AccountDetails (username, password, email, login_type, status, firstname, lastname) values (?, ?, ?, ?, ?, ?, ?)", Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, user.getUsername());
                ps.setString(2, user.getPassword());
                ps.setString(3, user.getEmail());
                ps.setString(4, user.getLogin_type());
                ps.setString(5, "active");
                ps.setString(6, user.getFirstname());
                ps.setString(7, user.getLastname());
                int rs = ps.executeUpdate();
                if (rs == 0) {
                    String message = "Registration failed";
                    user.setMessage(message);
                    return user;
                } else {
                    ResultSet generatedKeys = ps.getGeneratedKeys();
                    if (generatedKeys.next()) {
                        int id = generatedKeys.getInt(1);
                        user.setId(id);
                        String message = "Registration successful. User ID: " + id;
                        user.setMessage(message);
                        return user;
                    } else {
                        String message = "Registration failed. Unable to retrieve user ID.";
                        user.setMessage(message);
                        return user;
                    }
                }
            }
        }
    }

    public static ArrayList<FoodTruckInformation> getAllFoodTrucks() throws SQLException {
        PreparedStatement ps = DBconn.prepareStatement("select * from FoodTruckInformation");
        ResultSet rs = ps.executeQuery();
        ArrayList<FoodTruckInformation> foodTrucks = new ArrayList<>();
        while (rs.next()) {
            FoodTruckInformation foodTruck1 = new FoodTruckInformation();
            foodTruck1.setId(rs.getInt("id"));
            foodTruck1.setName(rs.getString("Name"));
            foodTruck1.setDescription(rs.getString("Description"));
            foodTruck1.setPhoneNumber(rs.getString("PhoneNumber"));
            foodTruck1.setEmail(rs.getString("Email"));
            foodTruck1.setWebsite(rs.getString("Website"));
            foodTruck1.setHours(rs.getString("Hours"));
            foodTruck1.setLatitude(rs.getFloat("Latitude"));
            foodTruck1.setLongitude(rs.getFloat("Longitude"));
            foodTrucks.add(foodTruck1);
        }
        return foodTrucks;
    }


    public static FoodTruckInformation createFoodTruck(FoodTruckInformation foodTruck) throws SQLException {
        //Check if user exists and register him in the database
        logger.info("Inside createFoodTruck");
        logger.info("Notes:" + foodTruck.getNotes());
        PreparedStatement ps1 = DBconn.prepareStatement("select * from AccountDetails where username = ?");
        ps1.setString(1, foodTruck.getNotes());
        logger.info("Statement: " + ps1.toString());
        ResultSet rs1 = ps1.executeQuery();
        int uid;
        if (!rs1.next()) {
            String message = "User does not exist. Please make him register first";
            foodTruck.setMessage(message);
            return foodTruck;
        } else {
            uid = rs1.getInt("id");
        }
        PreparedStatement ps = DBconn.prepareStatement("insert into FoodTruckInformation (Name, Description, PhoneNumber, Email, Website, Hours, Latitude, Longitude, Address, What3Words) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", Statement.RETURN_GENERATED_KEYS);
        ps.setString(1, foodTruck.getName());
        ps.setString(2, foodTruck.getDescription());
        ps.setString(3, foodTruck.getPhoneNumber());
        ps.setString(4, foodTruck.getEmail());
        ps.setString(5, foodTruck.getWebsite());
        ps.setString(6, foodTruck.getHours());
        ps.setFloat(7, foodTruck.getLatitude());
        ps.setFloat(8, foodTruck.getLongitude());
        ps.setString(9, "No address information available yet");
        ps.setString(10, "No What3Words information available yet");
        int rs = ps.executeUpdate();
        if (rs == 0) {
            String message = "Food Truck creation failed";
            foodTruck.setMessage(message);
            return foodTruck;
        } else {
            ResultSet generatedKeys = ps.getGeneratedKeys();
            if (generatedKeys.next()) {
                int id = generatedKeys.getInt(1);
                foodTruck.setId(id);
                logger.info("Food Truck ID: " + id);
                PreparedStatement ps2 = DBconn.prepareStatement("update AccountDetails set Food_Truck_ID = ? where username = ?");
                ps2.setInt(1, id);
                ps2.setString(2, foodTruck.getNotes());
                ps2.executeUpdate();
                String message = "Food Truck creation successful and registered the user to the new truck. Food Truck ID: " + id;
                foodTruck.setMessage(message);
                return foodTruck;
            } else {
                String message = "Food Truck creation failed. Unable to retrieve Food Truck ID.";
                foodTruck.setMessage(message);
                return foodTruck;
            }
        }
    }


    public static AccountDetails getUserInfoById(int id) throws SQLException {
        PreparedStatement ps = DBconn.prepareStatement("select * from AccountDetails where id = ?");
        ps.setInt(1, id);
        ResultSet rs = ps.executeQuery();
        if (rs.next()) {
            AccountDetails user = new AccountDetails();
            user.setId(rs.getInt("id"));
            user.setUsername(rs.getString("username"));
            user.setEmail(rs.getString("email"));
            user.setLogin_type(rs.getString("login_type"));
            user.setPassword("Password Hidden");
            user.setStatus(rs.getString("status"));
            user.setFirstname(rs.getString("firstname"));
            user.setLastname(rs.getString("lastname"));
            user.setMessage("User retrieved successfully");
            return user;
        } else {
            AccountDetails user = new AccountDetails();
            user.setMessage("User with ID " + id + " not found");
            return user;
        }
    }

    public static FoodTruckInformation getFoodTruckInformationById(int id) throws SQLException {
        PreparedStatement ps = DBconn.prepareStatement("select * from FoodTruckInformation where id = ?");
        ps.setInt(1, id);
        ResultSet rs = ps.executeQuery();
        if (rs.next()) {
            FoodTruckInformation foodTruck = new FoodTruckInformation();
            foodTruck.setId(rs.getInt("ID"));
            foodTruck.setName(rs.getString("Name"));
            foodTruck.setDescription(rs.getString("Description"));
            foodTruck.setAddress(rs.getString("Address"));
            foodTruck.setPhoneNumber(rs.getString("PhoneNumber"));
            foodTruck.setEmail(rs.getString("Email"));
            foodTruck.setWebsite(rs.getString("Website"));
            foodTruck.setHours(rs.getString("Hours"));
            foodTruck.setLatitude(Float.valueOf(rs.getString("Latitude")));
            foodTruck.setLongitude(Float.valueOf(rs.getString("Longitude")));
            foodTruck.setUpdates_time(rs.getString("updated_time"));
            foodTruck.setNotes(rs.getString("Notes"));
            foodTruck.setWhat3words(rs.getString("What3Words"));
            foodTruck.setMessage("Food Truck Information retrieved successfully");
            return foodTruck;
        } else {
            FoodTruckInformation foodTruck = new FoodTruckInformation();
            foodTruck.setMessage("Food Truck with ID " + id + " not found");
            return foodTruck;
        }
    }


    public static AccountDetails updateAccountDetails(AccountDetails user) throws SQLException {
        PreparedStatement ps = DBconn.prepareStatement("select * from AccountDetails where id = ?");
        ps.setInt(1, user.getId());
        ResultSet rs = ps.executeQuery();
        if (!rs.next()) {
            AccountDetails temp = new AccountDetails();
            temp.setMessage("User not found");
            return temp;
        } else {
            String oldUsername = rs.getString("username");
            String oldPassword = rs.getString("password");
            String oldEmail = rs.getString("email");
            String oldLoginType = rs.getString("login_type");
            String oldFirstName = rs.getString("firstname");
            String oldLastName = rs.getString("lastname");
            String oldFoodTruckID = rs.getString("Food_Truck_ID");

            // Only update non-null fields
            if (user.getUsername() != null) {
                oldUsername = user.getUsername();
            }
            if (user.getPassword() != null) {
                if (!user.getPassword().equals("")) {
                    oldPassword = user.getPassword();
                }
            }
            if (user.getEmail() != null) {
                oldEmail = user.getEmail();
            }
            if (user.getLogin_type() != null) {
                oldLoginType = user.getLogin_type();
            }
            if (user.getFirstname() != null) {
                oldFirstName = user.getFirstname();
            }
            if (user.getLastname() != null) {
                oldLastName = user.getLastname();
            }
            if (user.getFood_Truck_ID() != null) {
                oldFoodTruckID = user.getFood_Truck_ID();
            }

            PreparedStatement psUpdate = DBconn.prepareStatement("update AccountDetails set username=?, password=?, email=?, login_type=?, firstname=?, lastname=?, Food_Truck_ID=? where id=?");
            psUpdate.setString(1, oldUsername);
            psUpdate.setString(2, oldPassword);
            psUpdate.setString(3, oldEmail);
            psUpdate.setString(4, oldLoginType);
            psUpdate.setString(5, oldFirstName);
            psUpdate.setString(6, oldLastName);
            psUpdate.setString(7, oldFoodTruckID);
            psUpdate.setInt(8, user.getId());
            int rsUpdate = psUpdate.executeUpdate();
            if (rsUpdate > 0) {
                AccountDetails temp = new AccountDetails();
                temp.setMessage("User updated successfully");
                return temp;
            } else {
                AccountDetails temp = new AccountDetails();
                temp.setMessage("User update failed");
                return temp;
            }
        }
    }


    public static ArrayList<FoodTruckInformation> getFoodTrucksByDistance(Circle input) throws SQLException {
        logger.info("Inside getFoodTrucksByDistance");
        logger.info(input.toString());
        ArrayList<FoodTruckInformation> foodTrucks = new ArrayList<FoodTruckInformation>();
        PreparedStatement ps = DBconn.prepareStatement("select * from FoodTruckInformation");
        ResultSet rs = ps.executeQuery();
        while (rs.next()) {
            if (Helpers.distance(input.getLatitude(), input.getLongitude(), Double.parseDouble(rs.getString("Latitude")), Double.parseDouble(rs.getString("Longitude"))) <= input.getDistance()) {
                logger.info("Food Truck " + rs.getString("Name") + " is within the distance: " + Helpers.distance(input.getLatitude(), input.getLongitude(), Double.parseDouble(rs.getString("Latitude")), Double.parseDouble(rs.getString("Longitude"))) + " is less than " + input.getDistance());
                FoodTruckInformation foodTruck = new FoodTruckInformation();
                foodTruck.setId(Integer.parseInt(rs.getString("ID")));
                foodTruck.setName(rs.getString("Name"));
                foodTruck.setAddress(rs.getString("Address"));
                foodTruck.setDescription(rs.getString("Description"));
                foodTruck.setPhoneNumber(rs.getString("PhoneNumber"));
                foodTruck.setEmail(rs.getString("Email"));
                foodTruck.setWebsite(rs.getString("Website"));
                foodTruck.setHours(rs.getString("Hours"));
                foodTruck.setLatitude(Float.parseFloat(rs.getString("Latitude")));
                foodTruck.setLongitude(Float.parseFloat(rs.getString("Longitude")));
                foodTruck.setUpdates_time(rs.getString("updated_time"));
                foodTruck.setWhat3words(rs.getString("What3Words"));
                foodTruck.setNotes(rs.getString("Notes"));
                foodTrucks.add(foodTruck);
            }
        }
        return foodTrucks;
    }

    public static FoodTruckInformation updateFoodTruckInformation(FoodTruckInformation foodTruckInformation) {
        logger.info("Inside updateFoodTruckInformation");
        logger.info(foodTruckInformation.toString());
        try {
            PreparedStatement ps = DBconn.prepareStatement("select * from FoodTruckInformation where ID = ?");
            ps.setInt(1, foodTruckInformation.getId());
            ResultSet rs = ps.executeQuery();
            if (!rs.next()) {
                FoodTruckInformation temp = new FoodTruckInformation();
                temp.setMessage("Food Truck not found");
                logger.info("Food Truck not found");
                return temp;
            } else {
                String oldName = rs.getString("Name");
                String oldDescription = rs.getString("Description");
                String oldPhoneNumber = rs.getString("PhoneNumber");
                String oldEmail = rs.getString("Email");
                String oldWebsite = rs.getString("Website");
                String oldHours = rs.getString("Hours");
                String oldLatitude = rs.getString("Latitude");
                String oldLongitude = rs.getString("Longitude");
                String oldNotes = rs.getString("Notes");

                // Only update non-null fields
                if (foodTruckInformation.getName() != null) {
                    oldName = foodTruckInformation.getName();
                    logger.info("updating name");
                }
                if (foodTruckInformation.getDescription() != null) {
                    oldDescription = foodTruckInformation.getDescription();
                    logger.info("updating description");
                }
                if (foodTruckInformation.getPhoneNumber() != null) {
                    oldPhoneNumber = foodTruckInformation.getPhoneNumber();
                    logger.info("updating phone number");
                }
                if (foodTruckInformation.getEmail() != null) {
                    oldEmail = foodTruckInformation.getEmail();
                    logger.info("updating email");
                }
                if (foodTruckInformation.getWebsite() != null) {
                    oldWebsite = foodTruckInformation.getWebsite();
                    logger.info("updating website");
                }
                if (foodTruckInformation.getHours() != null) {
                    oldHours = foodTruckInformation.getHours();
                    logger.info("updating hours");
                }
                if (foodTruckInformation.getLatitude() != null) {
                    oldLatitude = foodTruckInformation.getLatitude().toString();
                    logger.info("updating latitude");
                }
                if (foodTruckInformation.getLongitude() != null) {
                    oldLongitude = foodTruckInformation.getLongitude().toString();
                    logger.info("updating longitude");
                }
                if (foodTruckInformation.getNotes() != null) {
                    oldNotes = foodTruckInformation.getNotes();
                    logger.info("updating notes");
                }

                PreparedStatement psUpdate = DBconn.prepareStatement("update FoodTruckInformation set Name=?, Description=?, Address=?, PhoneNumber=?, Email=?, Website=?, Hours=?, Latitude=?, Longitude=?, Notes=?, What3Words = ? where ID=?");
                psUpdate.setString(1, oldName);
                psUpdate.setString(2, oldDescription);
                psUpdate.setString(3, GeoLocation.getAddress(Double.parseDouble(oldLatitude), Double.parseDouble(oldLongitude)));
                psUpdate.setString(4, oldPhoneNumber);
                psUpdate.setString(5, oldEmail);
                psUpdate.setString(6, oldWebsite);
                psUpdate.setString(7, oldHours);
                psUpdate.setString(8, oldLatitude);
                psUpdate.setString(9, oldLongitude);
                psUpdate.setString(10, oldNotes);
                psUpdate.setString(11, What3Words.getWhat3Words(Double.parseDouble(oldLatitude), Double.parseDouble(oldLongitude)));

                psUpdate.setInt(12, foodTruckInformation.getId());
                int rsUpdate = psUpdate.executeUpdate();
                if (rsUpdate > 0) {
                    FoodTruckInformation temp = new FoodTruckInformation();
                    temp.setMessage("Food Truck updated successfully");
                    logger.info("Food Truck updated successfully");
                    return temp;
                } else {
                    FoodTruckInformation temp = new FoodTruckInformation();
                    temp.setMessage("Food Truck update failed");
                    logger.info("Food Truck update failed");
                    return temp;
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }


    public static ArrayList<Review> getReviewsByFoodTruckId(int id) throws SQLException {
        ArrayList<Review> reviews = new ArrayList<Review>();
        PreparedStatement ps = DBconn.prepareStatement("select * from reviews where foodtruck_id = ?");
        ps.setInt(1, id);
        ResultSet rs = ps.executeQuery();
        while (rs.next()) {
            Review review = new Review();
            review.setId(Integer.parseInt(rs.getString("id")));
            review.setUser_id(Integer.parseInt(rs.getString("user_id")));
            //Get names of user_id
            PreparedStatement ps2 = DBconn.prepareStatement("select * from AccountDetails where id = ?");
            ps2.setInt(1, review.getUser_id());
            ResultSet rs2 = ps2.executeQuery();
            if (rs2.next()) {
                review.setName(rs2.getString("firstname") + " " + rs2.getString("lastname"));
            }
            review.setFoodtruck_id(Integer.parseInt(rs.getString("foodtruck_id")));
            review.setRating(Integer.parseInt(rs.getString("rating")));
            review.setReview(rs.getString("comment"));
            review.setCreated_at(rs.getString("created_at"));
            review.setMessage("Review found and retreived successfully for food truck id: " + id);
            logger.info("Review found" + review.toString());
            reviews.add(review);
        }
        return reviews;
    }


    public static Review addReview(Review review) throws SQLException {
        logger.info("Inside addReview");
        logger.info(review.toString());
        PreparedStatement ps = DBconn.prepareStatement("insert into reviews (user_id, foodtruck_id, rating, comment) values (?, ?, ?, ?)");
        ps.setInt(1, review.getUser_id());
        ps.setInt(2, review.getFoodtruck_id());
        ps.setInt(3, review.getRating());
        ps.setString(4, review.getReview());
        int rs = ps.executeUpdate();
        if (rs > 0) {
            review.setMessage("Review added successfully");
            logger.info("Review added successfully");
            return review;
        } else {
            review.setMessage("Review adding failed");
            logger.info("Review adding failed");
            return review;
        }
    }

    public static ArrayList<FoodTruckInformation> getFavFoodTrucksByUserId(int id) throws SQLException {
        logger.info("Inside getFavFoodTrucksByUserId");
        ArrayList<FoodTruckInformation> foodTruckInformations = new ArrayList<FoodTruckInformation>();
        PreparedStatement ps = DBconn.prepareStatement("select * from FoodTruckInformation where ID in (select foodtruck_id from favfoodtrucks where user_id = ?)");
        ps.setInt(1, id);
        ResultSet rs = ps.executeQuery();
        while (rs.next()) {
            FoodTruckInformation foodTruckInformation = new FoodTruckInformation();
            foodTruckInformation.setId(Integer.parseInt(rs.getString("id")));
            foodTruckInformation.setName(rs.getString("name"));
            foodTruckInformation.setDescription(rs.getString("description"));
            foodTruckInformation.setAddress(rs.getString("address"));
            foodTruckInformation.setPhoneNumber(rs.getString("phoneNumber"));
            foodTruckInformation.setEmail(rs.getString("email"));
            foodTruckInformation.setWebsite(rs.getString("website"));
            foodTruckInformation.setHours(rs.getString("hours"));
            foodTruckInformation.setLatitude(Float.valueOf(rs.getString("latitude")));
            foodTruckInformation.setLongitude(Float.valueOf(rs.getString("longitude")));
            foodTruckInformation.setNotes(rs.getString("notes"));
            foodTruckInformation.setWhat3words(rs.getString("What3Words"));
            foodTruckInformation.setMessage("Food Truck found and retreived successfully for user id: " + id);
            logger.info("Food Truck found" + foodTruckInformation.toString());
            foodTruckInformations.add(foodTruckInformation);
        }
        return foodTruckInformations;
    }

    public static ArrayList<Integer> getFavFoodTrucksArrayByUserId(int id) throws SQLException {
        logger.info("Inside getFavFoodTrucksArrayByUserId");
        ArrayList<Integer> foodTruckIds = new ArrayList<Integer>();
        PreparedStatement ps = DBconn.prepareStatement("select foodtruck_id from favfoodtrucks where user_id = ?");
        ps.setInt(1, id);
        ResultSet rs = ps.executeQuery();
        while (rs.next()) {
            foodTruckIds.add(Integer.parseInt(rs.getString("foodtruck_id")));
        }
        return foodTruckIds;
    }

    public static FavoriteFoodTruck addOrRemoveFavFoodTruck(FavoriteFoodTruck favoriteFoodTruck) throws SQLException {
        logger.info("Inside addOrRemoveFavFoodTruck");
        logger.info(favoriteFoodTruck.toString());
        PreparedStatement ps = DBconn.prepareStatement("select * from favfoodtrucks where user_id = ? and foodtruck_id = ?");
        ps.setInt(1, favoriteFoodTruck.getUser_id());
        ps.setInt(2, favoriteFoodTruck.getFoodtruck_id());
        ResultSet rs = ps.executeQuery();
        if (rs.next()) {
            PreparedStatement psDelete = DBconn.prepareStatement("delete from favfoodtrucks where user_id = ? and foodtruck_id = ?");
            psDelete.setInt(1, favoriteFoodTruck.getUser_id());
            psDelete.setInt(2, favoriteFoodTruck.getFoodtruck_id());
            int rsDelete = psDelete.executeUpdate();
            if (rsDelete > 0) {
                favoriteFoodTruck.setMessage("Food Truck removed from favorites successfully");
                logger.info("Food Truck removed from favorites successfully");
                return favoriteFoodTruck;
            } else {
                favoriteFoodTruck.setMessage("Food Truck removing from favorites failed");
                logger.info("Food Truck removing from favorites failed");
                return favoriteFoodTruck;
            }
        } else {
            PreparedStatement psInsert = DBconn.prepareStatement("insert into favfoodtrucks (user_id, foodtruck_id) values (?, ?)");
            psInsert.setInt(1, favoriteFoodTruck.getUser_id());
            psInsert.setInt(2, favoriteFoodTruck.getFoodtruck_id());
            int rsInsert = psInsert.executeUpdate();
            if (rsInsert > 0) {
                favoriteFoodTruck.setMessage("Food Truck added to favorites successfully");
                logger.info("Food Truck added to favorites successfully");
                return favoriteFoodTruck;
            } else {
                favoriteFoodTruck.setMessage("Food Truck adding to favorites failed");
                logger.info("Food Truck adding to favorites failed");
                return favoriteFoodTruck;
            }
        }
    }


//    public static Location setRestaurantCurrentLocation(Location location) throws SQLException {
//        Logger logger = Logger.getLogger(DBData.class.getName());
//        logger.info("Inside setRestaurantCurrentLocation");
//        new DBData();
//        PreparedStatement ps = conn.prepareStatement("insert into FoodTruckLocationDetails (restaurant_unique_id, latitude, longitude) values (?, ?, ?)");
//        ps.setInt(1, location.getRestaurant_unique_id());
//        ps.setFloat(2, location.getLatitude());
//        ps.setFloat(3, location.getLongitude());
//        int rs = ps.executeUpdate();
//        return location;
//    }
//
//    public static Location setFoodTruckLocation(Location location) throws SQLException {
//        Logger logger = Logger.getLogger(DBData.class.getName());
//        logger.info("Inside setFoodTruckLocation");
//        logger.info("Restaurant ID: " + location.getRestaurant_unique_id());
//        logger.info("Latitude: " + location.getLatitude());
//        logger.info("Longitude: " + location.getLongitude());
//        new DBData();
//        PreparedStatement ps = conn.prepareStatement("select * from FoodTruckLocationDetails where restaurant_unique_id = ?");
//        ps.setInt(1, location.getRestaurant_unique_id());
//        ResultSet rs    = ps.executeQuery();
//        if(rs.next()) {
//            logger.info("Restaurant already exists - so updating");
//            PreparedStatement ps1 = conn.prepareStatement("update FoodTruckLocationDetails set latitude = ?, longitude = ? where restaurant_unique_id = ?");
//            ps1.setFloat(1, location.getLatitude());
//            ps1.setFloat(2, location.getLongitude());
//            ps1.setInt(3, location.getRestaurant_unique_id());
//            int rs1 = ps1.executeUpdate();
//            return location;
//        }
//        else{
//            logger.info("Restaurant does not exist - so inserting");
//            PreparedStatement ps2 = conn.prepareStatement("insert into FoodTruckLocationDetails (restaurant_unique_id, latitude, longitude) values (?, ?, ?)");
//            ps2.setInt(1, location.getRestaurant_unique_id());
//            ps2.setFloat(2, location.getLatitude());
//            ps2.setFloat(3, location.getLongitude());
//            int rs2 = ps2.executeUpdate();
//            return location;
//        }
//    }
//
//    //ID, Name, Description, Address, PhoneNumber, Email, Website, Hours, foodTruckUniqueID
//    public static FoodTruckInformation getFoodTruckInformation(FoodTruckInformation foodTruckInformation) throws SQLException {
//        Logger logger = Logger.getLogger(DBData.class.getName());
//        logger.info("Inside getFoodTruckInformation");
//        new DBData();
//        PreparedStatement ps = conn.prepareStatement("select * from FoodTruckInformation where foodTruckUniqueID = ?");
//        ps.setString(1, foodTruckInformation.getFoodTruckUniqueID());
//        ResultSet rs    = ps.executeQuery();
//        FoodTruckInformation foodTruckInformation1 = new FoodTruckInformation();
//        while(rs.next())
//        {
//            foodTruckInformation1.setId(rs.getInt("ID"));
//            foodTruckInformation1.setName(rs.getString("Name"));
//            foodTruckInformation1.setDescription(rs.getString("Description"));
//            foodTruckInformation1.setAddress(rs.getString("Address"));
//            foodTruckInformation1.setPhoneNumber(rs.getString("PhoneNumber"));
//            foodTruckInformation1.setEmail(rs.getString("Email"));
//            foodTruckInformation1.setWebsite(rs.getString("Website"));
//            foodTruckInformation1.setHours(rs.getString("Hours"));
//            foodTruckInformation1.setFoodTruckUniqueID(rs.getString("foodTruckUniqueID"));
//        }
//        return foodTruckInformation1;
//    }
//
//    public static FoodTruckInformation updateFoodTruckInformation(FoodTruckInformation foodTruckInformation) throws SQLException {
//        Logger logger = Logger.getLogger(DBData.class.getName());
//        logger.info("Inside updateFoodTruckInformation");
//        new DBData();
//        PreparedStatement ps = conn.prepareStatement("update FoodTruckInformation set Name = ?, Description = ?, Address = ?, PhoneNumber = ?, Email = ?, Website = ?, Hours = ? where foodTruckUniqueID = ?");
//        ps.setString(1, foodTruckInformation.getName());
//        ps.setString(2, foodTruckInformation.getDescription());
//        ps.setString(3, foodTruckInformation.getAddress());
//        ps.setString(4, foodTruckInformation.getPhoneNumber());
//        ps.setString(5, foodTruckInformation.getEmail());
//        ps.setString(6, foodTruckInformation.getWebsite());
//        ps.setString(7, foodTruckInformation.getHours());
//        ps.setString(8, foodTruckInformation.getFoodTruckUniqueID());
//        int rs = ps.executeUpdate();
//        return foodTruckInformation;
//    }
//

}
