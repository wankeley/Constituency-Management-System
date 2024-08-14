package com.example.bookshop_inventory_mgt;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import javafx.fxml.FXML;
import javafx.scene.chart.LineChart;
import javafx.scene.chart.PieChart;
import javafx.scene.chart.XYChart;
import javafx.scene.text.Text;

import java.util.List;
import java.util.concurrent.ExecutionException;

public class Report {

    @FXML
    private PieChart beneficiary_piechart; // Pie chart for beneficiaries

    @FXML
    private LineChart<String, Number> voters_piechart; // Line chart for total voters

    @FXML
    private Text Benefeciary_totaltxt; // Text for total beneficiaries

    @FXML
    private Text Vote_totaltxt; // Text for total voters



    @FXML
    public void initialize() {
        fetchData();
    }

    // Fetch and update data from Firestore
    public void fetchData() {
        Firestore db = FirestoreClient.getFirestore();
        try {
            // Fetch beneficiaries data
            ApiFuture<QuerySnapshot> beneficiaryFuture = db.collection("beneficiaries").get();
            List<QueryDocumentSnapshot> beneficiaryDocuments = beneficiaryFuture.get().getDocuments();
            updateBeneficiaryPieChart(beneficiaryDocuments);

            // Fetch voters data
            ApiFuture<QuerySnapshot> votersFuture = db.collection("voters").get();
            List<QueryDocumentSnapshot> votersDocuments = votersFuture.get().getDocuments();
            updateTotalVotersLineChart(votersDocuments);

            // Set totals
            int beneficiaryTotal = beneficiaryDocuments.size();
            int voteTotal = votersDocuments.size();
            setBeneficiaryTotal(beneficiaryTotal);
            setVoteTotal(voteTotal);

        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }

    private void updateBeneficiaryPieChart(List<QueryDocumentSnapshot> documents) {
        // Each document represents one beneficiary
        PieChart.Data[] data = new PieChart.Data[documents.size()];
        for (int i = 0; i < documents.size(); i++) {
            data[i] = new PieChart.Data("Beneficiary " + (i + 1), 1); // Each slice represents a beneficiary
        }
        beneficiary_piechart.setData(javafx.collections.FXCollections.observableArrayList(data));
    }

    private void updateTotalVotersLineChart(List<QueryDocumentSnapshot> documents) {
        XYChart.Series<String, Number> series = new XYChart.Series<>();
        // Assuming each document has a timestamp field "timestamp"
        for (QueryDocumentSnapshot doc : documents) {
            String timestamp = doc.getString("gender"); // Use a proper timestamp format
            Number count = doc.getLong("age"); // Use a proper count value if needed
            series.getData().add(new XYChart.Data<>(timestamp, count));
        }
        voters_piechart.getData().clear();
        voters_piechart.getData().add(series);
    }

    private void setBeneficiaryTotal(int total) {
        Benefeciary_totaltxt.setText("Total Beneficiaries: " + total);
    }

    private void setVoteTotal(int total) {
        Vote_totaltxt.setText("Total Voters: " + total);
    }
}
