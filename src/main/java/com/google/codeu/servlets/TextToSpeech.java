package com.google.codeu.servlets;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

// Imports the Google Cloud client library
import com.google.cloud.texttospeech.v1.AudioConfig;
import com.google.cloud.texttospeech.v1.AudioEncoding;
import com.google.cloud.texttospeech.v1.SsmlVoiceGender;
import com.google.cloud.texttospeech.v1.SynthesisInput;
import com.google.cloud.texttospeech.v1.SynthesizeSpeechResponse;
import com.google.cloud.texttospeech.v1.TextToSpeechClient;
import com.google.cloud.texttospeech.v1.VoiceSelectionParams;
import com.google.protobuf.ByteString;

/** Takes requests that contain text and responds with an MP3 file speaking that text. */
@WebServlet("/a11y/tts")
public class TextToSpeech extends HttpServlet {

 private TextToSpeechClient ttsClient;

 @Override
 public void init() {
    try {
        ttsClient = TextToSpeechClient.create();
    } catch (IOException e) {
        System.out.println("Error using Text To Speech API: ");
        e.printStackTrace();
    }
 }
 
@Override
public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
  doPost(req, resp);
}

 /** Responds with an MP3 bytestream from the Google Cloud Text-to-Speech API */
 @Override
 public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {


   String text = Jsoup.clean(request.getParameter("text"), Whitelist.none());

   // Text to Speech API
   SynthesisInput input = SynthesisInput.newBuilder()
           .setText(text)
           .build();
    System.out.println("Text: " + text);

   // Build the voice request, select the language code ("en-US") and the ssml voice gender
   VoiceSelectionParams voice = VoiceSelectionParams.newBuilder().setLanguageCode("en-US").setSsmlGender(SsmlVoiceGender.NEUTRAL).build();

   // Select the type of audio file to return
   AudioConfig audioConfig = AudioConfig.newBuilder().setAudioEncoding(AudioEncoding.MP3).build();

   SynthesizeSpeechResponse res = ttsClient.synthesizeSpeech(input, voice, audioConfig);

   ByteString audioContents = res.getAudioContent();
   response.setContentType("audio/mpeg"); 

   ServletOutputStream stream = null;
   BufferedInputStream buf = null;
   String filename = "output.mp3";

   try {
     stream = response.getOutputStream();
     File mp3 = new File(filename);

     // set response headers
     response.setContentType("audio/mpeg"); 

     response.addHeader("Content-Disposition", "attachment; filename=" + filename);

     response.setContentLength((int) mp3.length());

     FileInputStream input2 = new FileInputStream(mp3);

     buf = new BufferedInputStream(input2);
     int readBytes = 0;

     while ((readBytes = buf.read()) != -1) {
       stream.write(readBytes);
     } 
     System.out.println("File ready to download!");
   } catch (IOException e) {
     throw new ServletException(e.getMessage());
   } finally {
     if (stream != null) stream.close();
     if (buf != null) buf.close();
   }
}
}