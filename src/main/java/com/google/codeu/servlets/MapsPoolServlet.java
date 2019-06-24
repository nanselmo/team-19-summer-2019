package com.google.codeu.servlets;

import com.google.gson.Gson;
import com.google.gson.JsonArray;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Scanner;

@WebServlet("/pool-data")
public class MapsPoolServlet extends HttpServlet {
    private JsonArray poolDataArray;

    /**
     * Read CSV dataset and convert to JSON data
     */
    @Override
    public void init() {
        poolDataArray = new JsonArray();
        Gson gson = new Gson();
        Scanner scanner = new Scanner(getServletContext().getResourceAsStream("/WEB-INF/pool-data.csv"));
        while(scanner.hasNextLine()) {
            String line = scanner.nextLine();
            String[] cells = line.split(",");
            double lat = Double.parseDouble(cells[0]);
            double lng = Double.parseDouble(cells[1]);

            poolDataArray.add(gson.toJsonTree(new Pool(lat, lng)));
        }
        scanner.close();
    }

    /**
     * Output JSON array
     */
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");

        response.getOutputStream().println(poolDataArray.toString());
    }

    /**
     * Pool object that contains latitude and longitude information
     */
    private static class Pool {
        double lat;
        double lng;

        /**
         * Pool constructor
         * @param lat
         * @param lng
         */
        private Pool(double lat, double lng) {
            this.lat = lat;
            this.lng = lng;
        }
    }
}
