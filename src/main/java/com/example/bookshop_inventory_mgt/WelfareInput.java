
package com.example.bookshop_inventory_mgt;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.stage.Stage;

import java.util.List;
import java.util.concurrent.ExecutionException;

public class WelfareInput {

    @FXML
    private TextField programnametxt, programidtxt;

    @FXML
    private TextArea prodescriptiontxt;

    @FXML
    private TextField voteridtxt, benidtxt, contacttxt;

    @FXML
    private ChoiceBox<String> familyCB, welfareCB, gendertxt;

    @FXML
    private DatePicker startdateDP, enddateDP, dobtxt;

    @FXML
    public void initialize() {
        // Initialize Firebase Firestore
        Firestore db = FirestoreClient.getFirestore();

        // Populate ChoiceBoxes
        populateFamilyChoiceBox();
        populateGenderChoiceBox();
        populateWelfareChoiceBox();
    }

    private void populateFamilyChoiceBox() {
        familyCB.getItems().addAll("Married", "Single");
    }

    private void populateGenderChoiceBox() {
        gendertxt.getItems().addAll("Female", "Male");
    }

    private void populateWelfareChoiceBox() {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = db.collection("welfarePrograms").get();

        future.addListener(() -> {
            try {
                List<QueryDocumentSnapshot> documents = future.get().getDocuments();
                Platform.runLater(() -> {
                    welfareCB.getItems().clear(); // Clear existing items
                    for (QueryDocumentSnapshot document : documents) {
                        String programName = document.getString("programname"); // Adjust field name if necessary
                        welfareCB.getItems().add(programName);
                    }
                });
            } catch (InterruptedException | ExecutionException e) {
                Platform.runLater(() -> showAlert(Alert.AlertType.ERROR, "Error", "Failed to load program names."));
            }
        }, Runnable::run);
    }

    @FXML
    private void handleInsertWelfareAction() {
        // Check for empty fields
        if (areWelfareFieldsEmpty()) {
            showAlert(Alert.AlertType.WARNING, "Input Error", "Please fill in all welfare program fields.");
            return;
        }

        // Create a Welfare object
        Welfare welfare = new Welfare(
                programnametxt.getText(),
                programidtxt.getText(),
                prodescriptiontxt.getText(),
                startdateDP.getValue().toString(),
                enddateDP.getValue().toString()
        );

        // Insert data into Firestore
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection("welfarePrograms").document();

        ApiFuture<WriteResult> result = docRef.set(welfare);

        result.addListener(() -> {
            try {
                Platform.runLater(() -> {
                    try {
                        showAlert(Alert.AlertType.INFORMATION, "Insertion Successful", "Program inserted successfully at time: " + result.get().getUpdateTime());
                        populateWelfareChoiceBox(); // Repopulate welfare ChoiceBox
                        clearWelfareFields();
                    } catch (InterruptedException | ExecutionException e) {
                        showAlert(Alert.AlertType.ERROR, "Insertion Failed", "Failed to retrieve update time.");
                    }
                });
            } catch (Exception e) {
                Platform.runLater(() -> showAlert(Alert.AlertType.ERROR, "Insertion Failed", "Program insertion failed."));
            }
        }, Runnable::run);
    }

    @FXML
    private void handleInsertBeneficiaryAction() {
        // Check for empty fields
        if (areBeneficiaryFieldsEmpty()) {
            showAlert(Alert.AlertType.WARNING, "Input Error", "Please fill in all beneficiary fields.");
            return;
        }

        // Create a Beneficiary object
        Beneficiary beneficiary = new Beneficiary(
                voteridtxt.getText(),
                benidtxt.getText(),
                dobtxt.getValue().toString(), // Correctly handle DatePicker value
                gendertxt.getValue(),
                contacttxt.getText(),
                welfareCB.getValue(),
                familyCB.getValue()
        );

        // Insert data into Firestore
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection("beneficiaries").document();

        ApiFuture<WriteResult> result = docRef.set(beneficiary);

        result.addListener(() -> {
            try {
                Platform.runLater(() -> {
                    try {
                        showAlert(Alert.AlertType.INFORMATION, "Insertion Successful", "Beneficiary registered successfully at time: " + result.get().getUpdateTime());
                        clearBeneficiaryFields();
                    } catch (InterruptedException | ExecutionException e) {
                        showAlert(Alert.AlertType.ERROR, "Insertion Failed", "Failed to retrieve update time.");
                    }
                });
            } catch (Exception e) {
                Platform.runLater(() -> showAlert(Alert.AlertType.ERROR, "Insertion Failed", "Beneficiary registration failed."));
            }
        }, Runnable::run);
    }

    @FXML
    private void viewWelfare() throws Exception {
        Stage stage = new Stage();
        FXMLLoader fxmlLoader = new FXMLLoader(getClass().getResource("welfare_views.fxml"));
        Scene scene = new Scene(fxmlLoader.load());
        stage.setScene(scene);
        stage.show();
    }

    private boolean areWelfareFieldsEmpty() {
        return programnametxt.getText().isEmpty() ||
                programidtxt.getText().isEmpty() ||
                prodescriptiontxt.getText().isEmpty() ||
                startdateDP.getValue() == null ||
                enddateDP.getValue() == null;
    }

    private boolean areBeneficiaryFieldsEmpty() {
        return voteridtxt.getText().isEmpty() ||
                benidtxt.getText().isEmpty() ||
                dobtxt.getValue() == null || // Correctly handle DatePicker value
                gendertxt.getValue() == null ||
                contacttxt.getText().isEmpty() ||
                familyCB.getValue() == null ||
                welfareCB.getValue() == null;
    }

    private void clearWelfareFields() {
        programnametxt.clear();
        programidtxt.clear();
        prodescriptiontxt.clear();
        startdateDP.setValue(null);
        enddateDP.setValue(null);
    }

    private void clearBeneficiaryFields() {
        voteridtxt.clear();
        benidtxt.clear();
        dobtxt.setValue(null); // Correctly handle DatePicker value
        gendertxt.setValue(null);
        contacttxt.clear();
        familyCB.setValue(null);
        welfareCB.setValue(null);
    }

    private void showAlert(Alert.AlertType alertType, String title, String message) {
        Alert alert = new Alert(alertType);
        alert.setTitle(title);
        alert.setHeaderText(null);
        alert.setContentText(message);
        alert.showAndWait();
    }
}
