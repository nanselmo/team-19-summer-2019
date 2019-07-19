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

import java.util.UUID;

/** A single message posted by a user. */
public class Ticket {

  private UUID id;
  private String user;
  private String date;
  private String time;
  private long timestamp;

  /**
   * Constructs a new {@link Ticket} posted by {@code user} with {@code date} and {@code time} content. Generates a
   * random ID and uses the current system time for the creation time.
   */
  public Ticket(String user, String date, String time) {
    this(UUID.randomUUID(), user, date, time, System.currentTimeMillis());
  }

  public Ticket(UUID id, String user, String date, String time, long timestamp) {
    this.id = id;
    this.user = user;
    this.date = date;
    this.time = time;
    this.timestamp = timestamp;
  }

  public UUID getId() {
    return id;
  }

  public String getUser() {
    return user;
  }

  public String getDate() {
    return date;
  }

  public String getTime() {
    return time;
  }

  public long getTimestamp() {
    return timestamp;
  }
}
