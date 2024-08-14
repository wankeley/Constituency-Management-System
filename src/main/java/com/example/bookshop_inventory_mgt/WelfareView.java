package com.example.bookshop_inventory_mgt;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextField;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.input.KeyEvent;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

public class WelfareView {

    @FXML
    private TextField searchtxt; // Change to TextField for user input

    @FXML
    private TableView<Welfare> program_tableview;
    @FXML
    private TableColumn<Welfare, String> programe_nameCB;
    @FXML
    private TableColumn<Welfare, String> program_idCB;
    @FXML
    private TableColumn<Welfare, String> progrsam_descriptionCB;
    @FXML
    private TableColumn<Welfare, String> start_dateCB;
    @FXML
    private TableColumn<Welfare, String> end_dateCB;

    @FXML
    private TableView<Beneficiary> beneficiary_tableview;
    @FXML
    private TableColumn<Beneficiary, String> fullnameCB;
    @FXML
    private TableColumn<Beneficiary, String> beneficiaryCB;
    @FXML
    private TableColumn<Beneficiary, String> date_of_birthCB;
    @FXML
    private TableColumn<Beneficiary, String> genderCB;
    @FXML
    private TableColumn<Beneficiary, String> phoneCB;
    @FXML
    private TableColumn<Beneficiary, String> family_statusCB;
    @FXML
    private TableColumn<Beneficiary, String> programCB;

    @FXML
    public void initialize() {
        setupWelfareTableView();
        setupBeneficiaryTableView();
        searchtxt.setOnKeyReleased(this::filterTable); // Set up search functionality
    }

    private void setupWelfareTableView() {
        programe_nameCB.setCellValueFactory(new PropertyValueFactory<>("programname"));
        program_idCB.setCellValueFactory(new PropertyValueFactory<>("programeid"));
        progrsam_descriptionCB.setCellValueFactory(new PropertyValueFactory<>("prodescription"));
        start_dateCB.setCellValueFactory(new PropertyValueFactory<>("startdate"));
        end_dateCB.setCellValueFactory(new PropertyValueFactory<>("enddate"));

        fetchAndPopulateWelfareTable();
    }

    private void setupBeneficiaryTableView() {
        fullnameCB.setCellValueFactory(new PropertyValueFactory<>("voterid"));
        beneficiaryCB.setCellValueFactory(new PropertyValueFactory<>("benid"));
        date_of_birthCB.setCellValueFactory(new PropertyValueFactory<>("dob"));
        genderCB.setCellValueFactory(new PropertyValueFactory<>("gender"));
        phoneCB.setCellValueFactory(new PropertyValueFactory<>("conatact"));
        family_statusCB.setCellValueFactory(new PropertyValueFactory<>("family"));
        programCB.setCellValueFactory(new PropertyValueFactory<>("welfare"));

        fetchAndPopulateBeneficiaryTable();
    }

    private void fetchAndPopulateWelfareTable() {
        Firestore db = FirestoreClient.getFirestore();

        ApiFuture<QuerySnapshot> future = db.collection("welfarePrograms").get();
        future.addListener(() -> {
            try {
                List<QueryDocumentSnapshot> documents = future.get().getDocuments();
                List<Welfare> welfareList = new ArrayList<>();

                for (DocumentSnapshot document : documents) {
                    String programName = document.getString("programname");
                    String programId = document.getString("programeid");
                    String programDescription = document.getString("prodescription");
                    String startDate = document.getString("startdate");
                    String endDate = document.getString("enddate");

                    Welfare welfare = new Welfare(programName, programId, programDescription, startDate, endDate);
                    welfareList.add(welfare);
                }

                Platform.runLater(() -> program_tableview.getItems().setAll(welfareList));

            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();
            }
        }, Runnable::run);
    }

    private void fetchAndPopulateBeneficiaryTable() {
        Firestore db = FirestoreClient.getFirestore();

        ApiFuture<QuerySnapshot> future = db.collection("beneficiaries").get();
        future.addListener(() -> {
            try {
                List<QueryDocumentSnapshot> documents = future.get().getDocuments();
                List<Beneficiary> beneficiaryList = new ArrayList<>();

                for (DocumentSnapshot document : documents) {
                    String voterId = document.getString("voterid");
                    String benId = document.getString("benid");
                    String dob = document.getString("dob");
                    String gender = document.getString("gender");
                    String contact = document.getString("conatact");
                    String welfare = document.getString("welfare");
                    String family = document.getString("family");

                    Beneficiary beneficiary = new Beneficiary(voterId, benId, dob, gender, contact, welfare, family);
                    beneficiaryList.add(beneficiary);
                }

                Platform.runLater(() -> beneficiary_tableview.getItems().setAll(beneficiaryList));

            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();
            }
        }, Runnable::run);
    }

    private void filterTable(KeyEvent event) {
        String searchText = searchtxt.getText().toLowerCase();

        // Get all items from both TableViews
        List<Welfare> welfareItems = new ArrayList<>(program_tableview.getItems());
        List<Beneficiary> beneficiaryItems = new ArrayList<>(beneficiary_tableview.getItems());

        // Filter items
        List<Welfare> filteredWelfareItems = new ArrayList<>();
        for (Welfare welfare : welfareItems) {
            if (matchesSearchCriteriaWelfare(welfare, searchText)) {
                filteredWelfareItems.add(welfare);
            }
        }

        List<Beneficiary> filteredBeneficiaryItems = new ArrayList<>();
        for (Beneficiary beneficiary : beneficiaryItems) {
            if (matchesSearchCriteriaBeneficiary(beneficiary, searchText)) {
                filteredBeneficiaryItems.add(beneficiary);
            }
        }

        // Update the TableViews with filtered items
        program_tableview.getItems().setAll(filteredWelfareItems);
        beneficiary_tableview.getItems().setAll(filteredBeneficiaryItems);
    }

    private boolean matchesSearchCriteriaWelfare(Welfare welfare, String searchText) {
        return welfare.getProgramname().toLowerCase().contains(searchText) ||
                welfare.getProgrameid().toLowerCase().contains(searchText) ||
                welfare.getProdescription().toLowerCase().contains(searchText) ||
                welfare.getStartdate().toLowerCase().contains(searchText) ||
                welfare.getEnddate().toLowerCase().contains(searchText);
    }

    private boolean matchesSearchCriteriaBeneficiary(Beneficiary beneficiary, String searchText) {
        return beneficiary.getVoterid().toLowerCase().contains(searchText) ||
                beneficiary.getBenid().toLowerCase().contains(searchText) ||
                beneficiary.getDob().toLowerCase().contains(searchText) ||
                beneficiary.getGender().toLowerCase().contains(searchText) ||
                beneficiary.getConatact().toLowerCase().contains(searchText) ||
                beneficiary.getFamily().toLowerCase().contains(searchText) ||
                beneficiary.getWelfare().toLowerCase().contains(searchText);
    }
}
