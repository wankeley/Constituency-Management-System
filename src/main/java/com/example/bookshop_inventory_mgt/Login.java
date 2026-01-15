package com.example.bookshop_inventory_mgt;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Alert.AlertType;
import javafx.scene.control.Button;
import javafx.scene.control.CheckBox;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.scene.layout.AnchorPane;
import javafx.stage.Stage;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class Login {

        @FXML
        private TextField emailtxt;

        @FXML
        private PasswordField passwordtxt;

        @FXML
        private PasswordField confirmtxt;

        @FXML
        private Button loginbtn;

        @FXML
        private CheckBox showtxt;

        @FXML
        private AnchorPane rootPane;

        @FXML
        private void initialize() {
                // Initialize UI components
                showtxt.selectedProperty().addListener((obs, wasSelected, isSelected) -> togglePasswordVisibility(isSelected));
        }

        @FXML
        private void handleLogin() {
                // Get input values
                String email = emailtxt.getText();
                String password = passwordtxt.getText();
                String confirmPassword = confirmtxt.getText();

                // Validate input
                if (email.isEmpty() || password.isEmpty() || confirmPassword.isEmpty()) {
                        showAlert(AlertType.ERROR, "Form Error!", "Please fill all fields.");
                        return;
                }

                if (!password.equals(confirmPassword)) {
                        showAlert(AlertType.ERROR, "Form Error!", "Passwords do not match.");
                        return;
                }

                // Authenticate user
                authenticateUser(email, password);
        }

        private void authenticateUser(String email, String password) {
                CompletableFuture.runAsync(() -> {
                        try {
                                Firestore db = FirestoreClient.getFirestore();
                                ApiFuture<QuerySnapshot> future = db.collection("Users")
                                        .whereEqualTo("Email", email)
                                        .whereEqualTo("Password", password)
                                        .get();

                                List<QueryDocumentSnapshot> documents = future.get().getDocuments();

                                if (documents.isEmpty()) {
                                        Platform.runLater(() -> showAlert(AlertType.ERROR, "Login Error!", "Invalid email or password."));
                                } else {
                                        Platform.runLater(() -> {
                                                showAlert(AlertType.INFORMATION, "Login Successful!", "Welcome back!");
                                                // Load dashboard scene
                                                loadDashboard();
                                        });
                                }
                        } catch (InterruptedException | ExecutionException e) {
                                Platform.runLater(() -> showAlert(AlertType.ERROR, "Login Error!", "Authentication failed: " + e.getMessage()));
                        }
                });
        }

        private void loadDashboard() {
                // Code to load the dashboard scene
                try {FXMLLoader fxmlLoader = new FXMLLoader(HelloApplication.class.getResource("dashboard.fxml"));
                        Stage stage=new Stage();
                        Scene scene = new Scene(fxmlLoader.load());
                        stage.setScene(scene);
                        stage.show();
                } catch (IOException e) {
                        showAlert(AlertType.ERROR, "Loading Error!", "Failed to load dashboard.");
                }
        }

        private void togglePasswordVisibility(boolean show) {
                if (show) {
                        passwordtxt.setPromptText(passwordtxt.getText());
                        confirmtxt.setPromptText(confirmtxt.getText());
                        passwordtxt.setText("");
                        confirmtxt.setText("");
                } else {
                        passwordtxt.setText(passwordtxt.getPromptText());
                        confirmtxt.setText(confirmtxt.getPromptText());
                        passwordtxt.setPromptText("");
                        confirmtxt.setPromptText("");
                }
        }

        private void showAlert(AlertType type, String title, String message) {
                Alert alert = new Alert(type);
                alert.setTitle(title);
                alert.setHeaderText(null);
                alert.setContentText(message);
                alert.showAndWait();
        }
}
