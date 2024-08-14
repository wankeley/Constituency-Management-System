package com.example.bookshop_inventory_mgt;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Alert.AlertType;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.DatePicker;
import javafx.scene.control.TextField;
import javafx.event.ActionEvent;
import javafx.stage.Stage;

import java.util.concurrent.ExecutionException;

public class VoterInput {

    @FXML
    private TextField fullnametxt, nationalitytxt, addresstxt, phonetxt, emailtxt, voteridtxt, regOfficertxt, agetxt, occupationtxt, languagetxt, employmettxt;
    @FXML
    private DatePicker registration_DatePD, dobtxt;
    @FXML
    private ChoiceBox<String> gendertxt; // Specify the type for ChoiceBox

    @FXML
    public void initialize() {
        // Initialize Firebase Firestore
        Firestore db = FirestoreClient.getFirestore();

        // Initialize ChoiceBox with gender options
        gendertxt.getItems().addAll("Male", "Female");
    }

    @FXML
    private void handleRegisterAction(ActionEvent event) {
        // Check for empty fields
        if (areFieldsEmpty()) {
            showAlert(AlertType.WARNING, "Input Error", "Please fill in all fields.");
            return;
        }

        // Create a Voter object
        Voter voter = new Voter(
                fullnametxt.getText(),
                dobtxt.getValue().toString(),
                gendertxt.getValue(),
                nationalitytxt.getText(),
                addresstxt.getText(),
                phonetxt.getText(),
                emailtxt.getText(),
                voteridtxt.getText(),
                regOfficertxt.getText(),
                Integer.parseInt(agetxt.getText()),
                occupationtxt.getText(),
                languagetxt.getText(),
                employmettxt.getText(),
                registration_DatePD.getValue().toString()
        );

        // Insert data into Firestore
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection("voters").document();

        ApiFuture<WriteResult> result = docRef.set(voter);

        result.addListener(() -> {
            try {
                // Show success alert
                Platform.runLater(() -> {
                    try {
                        showAlert(AlertType.INFORMATION, "Registration Successful", "Voter registered successfully at time: " + result.get().getUpdateTime());
                    } catch (InterruptedException | ExecutionException e) {
                        showAlert(AlertType.ERROR, "Registration Failed", "Failed to retrieve registration time.");
                    }
                });

                // Clear text fields
                clearFields();
            } catch (Exception e) {
                Platform.runLater(() -> showAlert(AlertType.ERROR, "Registration Failed", "Voter registration failed."));
            }
        }, Runnable::run);
    }

    private boolean areFieldsEmpty() {
        return fullnametxt.getText().isEmpty() ||
                dobtxt.getValue() == null ||
                gendertxt.getValue() == null ||
                nationalitytxt.getText().isEmpty() ||
                addresstxt.getText().isEmpty() ||
                phonetxt.getText().isEmpty() ||
                emailtxt.getText().isEmpty() ||
                voteridtxt.getText().isEmpty() ||
                regOfficertxt.getText().isEmpty() ||
                agetxt.getText().isEmpty() ||
                occupationtxt.getText().isEmpty() ||
                languagetxt.getText().isEmpty() ||
                employmettxt.getText().isEmpty() ||
                registration_DatePD.getValue() == null;
    }

    private void clearFields() {
        fullnametxt.clear();
        dobtxt.setValue(null);
        gendertxt.setValue(null);
        nationalitytxt.clear();
        addresstxt.clear();
        phonetxt.clear();
        emailtxt.clear();
        voteridtxt.clear();
        regOfficertxt.clear();
        agetxt.clear();
        occupationtxt.clear();
        languagetxt.clear();
        employmettxt.clear();
        registration_DatePD.setValue(null);
    }

    private void showAlert(AlertType alertType, String title, String message) {
        Alert alert = new Alert(alertType);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }

    @FXML
    private void viewVoters() throws Exception {
        Stage stage = new Stage();
        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("voter_view.fxml"));
        Scene scene = new Scene(fxmlLoader.load());
        stage.setScene(scene);
        stage.show();
    }
}
