package com.ssdi.ssditestbackend.helpers;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class GeoLocation {

    public static String getAddress(Double latitude, Double longitude) {
        try {
            // Replace YOUR_API_KEY with your actual API key
            String apiKey = "";

            String apiUrl = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
                    URLEncoder.encode(String.valueOf(latitude), StandardCharsets.UTF_8) + "," + URLEncoder.encode(String.valueOf(longitude), StandardCharsets.UTF_8) +
                    "&key=" + apiKey;

            URL url = new URL(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            BufferedReader br = new BufferedReader(new InputStreamReader((conn.getInputStream())));

            String output;
            StringBuilder sb = new StringBuilder();
            while ((output = br.readLine()) != null) {
                sb.append(output);
            }

            conn.disconnect();

            String response = sb.toString();
            System.out.println("Response: " + response);

            // Extract the formatted address from the JSON response
            int start = response.indexOf("formatted_address") + 22;
            int end = response.indexOf("\",", start);
            String address = response.substring(start, end);

            System.out.println("Address: " + address);

            return address;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Address not found";
    }

}
