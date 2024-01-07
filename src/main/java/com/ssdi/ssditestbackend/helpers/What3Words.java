package com.ssdi.ssditestbackend.helpers;

import java.net.*;
import java.io.*;


public class What3Words {

    //Write your what3words API key here
    private static final String API_KEY = "";

    public static String getWhat3Words(double latitude, double longitude) {
        String urlString = "https://api.what3words.com/v3/convert-to-3wa?coordinates=" + latitude + "," + longitude + "&key=" + API_KEY;

        try {
            URL url = new URL(urlString);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String inputLine;
            StringBuilder response = new StringBuilder();

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            String json = response.toString();
            int start = json.indexOf("\"words\":\"") + 9;
            int end = json.indexOf("\"", start);
            String output = json.substring(start, end);

            return output;
        } catch (IOException e) {
            e.printStackTrace();
            return "What3Words not found";
        }
    }
}
