/*
 * Copyright 2019 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.google.codeu.data;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.SortDirection;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/** Provides access to the data stored in Datastore. */
public class TixDatastore {

  private DatastoreService tixDatastore;

  public TixDatastore() {
    tixDatastore = DatastoreServiceFactory.getDatastoreService();
  }

  /** Stores the Message in Datastore. */
  public void storeTicket(Ticket tix) {
    Entity ticketEntity = new Entity("Ticket", tix.getId().toString());
    ticketEntity.setProperty("user", tix.getUser());
    ticketEntity.setProperty("date", tix.getDate());
    ticketEntity.setProperty("time", tix.getTime());
    ticketEntity.setProperty("timestamp", tix.getTimestamp());

    tixDatastore.put(ticketEntity);
  }

   /*
    * Creates a list of messages posted either by all users if parameter string 'user' is empty or
    * by one specified user if parameter string is not empty. 
    * @return a list of messages, or empty list if no messages were posted by any users.
    */
   public List<Ticket> ticket_list(String user) {
      List<Ticket> tix = new ArrayList<>();
      Query query;
      if(user.isEmpty()) {
        query = new Query("Ticket")
        .addSort("timestamp", SortDirection.DESCENDING);     
      } else {
        query =
        new Query("Ticket")
            .setFilter(new Query.FilterPredicate("user", FilterOperator.EQUAL, user))
            .addSort("timestamp", SortDirection.DESCENDING);
      }
      PreparedQuery results = tixDatastore.prepare(query);
      for(Entity entity : results.asIterable()) {
        try {
          String idString = entity.getKey().getName();
          UUID id = UUID.fromString(idString);
          String date = (String) entity.getProperty("date");
          String time = (String) entity.getProperty("time");
          long timestamp = (long) entity.getProperty("timestamp");
          Ticket ticket;
          if (user.isEmpty()) {
            String userName = (String) entity.getProperty("user");
            ticket = new Ticket(id, userName, date, time, timestamp);
          } else {
            ticket = new Ticket(id, user, date, time, timestamp);
          }
          tix.add(ticket);
        } catch (Exception e) {
          System.err.println("Error reading ticket.");
          System.err.println(entity.toString());
          e.printStackTrace();          
        }
      }
      return tix;
   }
   
  /**
   * Gets messages posted by a specific user.
   *
   * @return a list of messages posted by the user, or empty list if user has never posted a
   *     message. List is sorted by time descending.
   */
  public List<Ticket> getTix(String user) {
    return ticket_list(user);
  }

  /*
   * Gets messages posted by all users.
   * 
   * @return a list of messages posted by all users, or empty list if user has never posted a 
   *      message. List is sorted by time descending. 
   */
  public List<Ticket> getAllTix() {
    return ticket_list("");
  }
  
  /** Returns the total number of messages for all users. */
  public int getTotalTixCount(){
    Query query = new Query("Ticket");
    PreparedQuery results = tixDatastore.prepare(query);
    return results.countEntities(FetchOptions.Builder.withLimit(1000));
  }
}


