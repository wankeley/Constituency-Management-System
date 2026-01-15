package com.example.bookshop_inventory_mgt;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.input.KeyEvent;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

public class VoterView {

    @FXML
    private TextField searchtxt; // Change to TextField for user input

    @FXML
    private TableView<Voter_tableview> votersTableview;
    @FXML
    private TableColumn<Voter_tableview, String> fullnameCB;
    @FXML
    private TableColumn<Voter_tableview, String> dobCB;
    @FXML
    private TableColumn<Voter_tableview, String> nationalityCB;
    @FXML
    private TableColumn<Voter_tableview, String> addressCB;
    @FXML
    private TableColumn<Voter_tableview, String> phoneCB;
    @FXML
    private TableColumn<Voter_tableview, String> emailCB;
    @FXML
    private TableColumn<Voter_tableview, String> voteridCB;
    @FXML
    private TableColumn<Voter_tableview, String> registration_dateCB;
    @FXML
    private TableColumn<Voter_tableview, String> registration_officerCB;
    @FXML
    private TableColumn<Voter_tableview, String> ageCB;
    @FXML
    private TableColumn<Voter_tableview, String> occupationCB;
    @FXML
    private TableColumn<Voter_tableview, String> employCB;
    @FXML
    private TableColumn<Voter_tableview, String> languageCB;
    @FXML
    private TableColumn<Voter_tableview, String> genderCB;

    @FXML
    public void initialize() {
        setupTableView();
        searchtxt.setOnKeyReleased(this::filterTable); // Set up search functionality
    }

    private void setupTableView() {
        fullnameCB.setCellValueFactory(new PropertyValueFactory<>("fullName"));
        dobCB.setCellValueFactory(new PropertyValueFactory<>("dob"));
        nationalityCB.setCellValueFactory(new PropertyValueFactory<>("nationality"));
        addressCB.setCellValueFactory(new PropertyValueFactory<>("address"));
        phoneCB.setCellValueFactory(new PropertyValueFactory<>("phone"));
        emailCB.setCellValueFactory(new PropertyValueFactory<>("email"));
        voteridCB.setCellValueFactory(new PropertyValueFactory<>("voterId"));
        registration_dateCB.setCellValueFactory(new PropertyValueFactory<>("registrationDate"));
        registration_officerCB.setCellValueFactory(new PropertyValueFactory<>("regOfficer"));
        ageCB.setCellValueFactory(new PropertyValueFactory<>("age"));
        occupationCB.setCellValueFactory(new PropertyValueFactory<>("occupation"));
        employCB.setCellValueFactory(new PropertyValueFactory<>("employment"));
        languageCB.setCellValueFactory(new PropertyValueFactory<>("language"));
        genderCB.setCellValueFactory(new PropertyValueFactory<>("gender"));

        fetchAndPopulateTable();
    }

    private void fetchAndPopulateTable() {
        Firestore db = FirestoreClient.getFirestore();

        ApiFuture<QuerySnapshot> future = db.collection("voters").get();
        future.addListener(() -> {
            try {
                List<QueryDocumentSnapshot> documents = future.get().getDocuments();
                List<Voter_tableview> votersList = new ArrayList<>();

                for (DocumentSnapshot document : documents) {
                    String fullname = document.getString("fullName");
                    String dob = document.getString("dob");
                    String nationality = document.getString("nationality");
                    String address = document.getString("address");
                    String phone = document.getString("phone");
                    String email = document.getString("email");
                    String voterId = document.getString("voterId");
                    String registrationDate = document.getString("registrationDate");
                    String regOfficer = document.getString("regOfficer");
                    String age = String.valueOf(document.getLong("age"));
                    String occupation = document.getString("occupation");
                    String employment = document.getString("employment");
                    String language = document.getString("language");
                    String gender = document.getString("gender");

                    Voter_tableview voter = new Voter_tableview(fullname, dob, nationality, address, phone, email, voterId, regOfficer, age, occupation, language, employment, registrationDate, gender);
                    votersList.add(voter);
                }

                Platform.runLater(() -> votersTableview.getItems().setAll(votersList));

            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();
            }
        }, Runnable::run);
    }

    private void filterTable(KeyEvent event) {
        String searchText = searchtxt.getText().toLowerCase();

        // Get all items from the TableView
        List<Voter_tableview> allItems = new ArrayList<>(votersTableview.getItems());

        // Filter items
        List<Voter_tableview> filteredItems = new ArrayList<>();
        for (Voter_tableview voter : allItems) {
            if (matchesSearchCriteria(voter, searchText)) {
                filteredItems.add(voter);
            }
        }

        // Update the TableView with filtered items
        votersTableview.getItems().setAll(filteredItems);
    }

    private boolean matchesSearchCriteria(Voter_tableview voter, String searchText) {
        return voter.getFullName().toLowerCase().contains(searchText) ||
                voter.getDob().toLowerCase().contains(searchText) ||
                voter.getNationality().toLowerCase().contains(searchText) ||
                voter.getAddress().toLowerCase().contains(searchText) ||
                voter.getPhone().toLowerCase().contains(searchText) ||
                voter.getEmail().toLowerCase().contains(searchText) ||
                voter.getVoterId().toLowerCase().contains(searchText) ||
                voter.getRegistrationDate().toLowerCase().contains(searchText) ||
                voter.getRegOfficer().toLowerCase().contains(searchText) ||
                voter.getAge().toLowerCase().contains(searchText) ||
                voter.getOccupation().toLowerCase().contains(searchText) ||
                voter.getEmployment().toLowerCase().contains(searchText) ||
                voter.getLanguage().toLowerCase().contains(searchText) ||
                voter.getGender().toLowerCase().contains(searchText);
    }
}
