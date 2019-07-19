package com.google.codeu.servlets;

import java.io.IOException;
import java.util.List;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.codeu.data.TixDatastore;
import com.google.codeu.data.Ticket;
import com.google.gson.Gson;

/**
 * Handles fetching all messages for the public feed.
 */
@WebServlet("/tixfeed")
public class TicketFeedServlet extends HttpServlet{
  
 private TixDatastore datastore;

 /**
  *  Initializes datastore variable.
  */
 @Override
 public void init() {
  datastore = new TixDatastore();
 }
 
 /**
  * Responds with a JSON representation of Message data for all users.
  */
 @Override
 public void doGet(HttpServletRequest request, HttpServletResponse response)
   throws IOException {

  response.setContentType("application/json");
  
  List<Ticket> tix = datastore.getAllTix();
  Gson gson = new Gson();
  String json = gson.toJson(tix);
  
  response.getOutputStream().println(json);
 }
}