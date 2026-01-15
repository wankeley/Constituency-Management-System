package com.example.bookshop_inventory_mgt;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.chart.*;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.BorderPane;
import javafx.scene.text.Text;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ExecutionException;

public class Dashboard {

    @FXML
    private BorderPane Main_Interface;
    @FXML
    private TextField searchtxt1;
    @FXML
    private Text Vote_totaltxt;
    @FXML
    private BarChart<String, Number> voters_barchat;
    @FXML
    private PieChart gender_piechart;
    @FXML
    private LineChart<String, Number> employmets_linechart;
    @FXML
    private Button searchbtn;
    @FXML
    private TableView<Dashboard_tableview> voters_tableview1;
    @FXML
    private TableColumn<Dashboard_tableview, String> fulllnameCb1;
    @FXML
    private TableColumn<Dashboard_tableview, String> genderCb1;
    @FXML
    private TableColumn<Dashboard_tableview, String> phoneCb1;
    @FXML
    private TableColumn<Dashboard_tableview, Integer> AgeCb1;
    @FXML
    private TableColumn<Dashboard_tableview, String> VoterIdCb1;
    @FXML
    private ScrollPane dashboard_Pane;


    @FXML
    public void initialize() {
        fetchAndUpdateCharts();
        setupTableView();
    }


    private void setupTableView() {
        fulllnameCb1.setCellValueFactory(new PropertyValueFactory<>("fullname"));
        genderCb1.setCellValueFactory(new PropertyValueFactory<>("gender"));
        phoneCb1.setCellValueFactory(new PropertyValueFactory<>("phone"));
        AgeCb1.setCellValueFactory(new PropertyValueFactory<>("age"));
        VoterIdCb1.setCellValueFactory(new PropertyValueFactory<>("voterId"));

        fetchAndPopulateTable();
    }

    private void fetchAndPopulateTable() {
        Firestore db = FirestoreClient.getFirestore();

        ApiFuture<QuerySnapshot> future = db.collection("voters").get();
        future.addListener(() -> {
            try {
                List<QueryDocumentSnapshot> documents = future.get().getDocuments();
                List<Dashboard_tableview> votersList = new ArrayList<>();

                for (DocumentSnapshot document : documents) {
                    String fullname = document.getString("fullName");
                    String gender = document.getString("gender");
                    String phone = document.getString("phone");
                    int age = document.getLong("age").intValue();
                    String voterId = document.getString("voterId");

                    Dashboard_tableview voter = new Dashboard_tableview(fullname, gender, phone, age, voterId);
                    votersList.add(voter);
                }

                Platform.runLater(() -> voters_tableview1.getItems().setAll(votersList));

            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();
            }
        }, Runnable::run);
    }

    public void displayFirstFXML() {
        Main_Interface.setCenter(dashboard_Pane);
        fetchAndUpdateCharts(); // Refresh charts when displaying the dashboard
        fetchAndPopulateTable(); // Refresh table when displaying the dashboard
    }



    public void displaySecondFXML() {
        try {
            Node content = loadFXML("voter_input.fxml");
            Main_Interface.setCenter(content);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void displayThirdFXML() {
        try {
            Node content = loadFXML("report.fxml");
            Main_Interface.setCenter(content);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void displayFourthFXML() {
        try {
            Node content = loadFXML("welfare_input.fxml");
            Main_Interface.setCenter(content);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private Node loadFXML(String fxmlFile) throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource(fxmlFile));
        return loader.load();
    }

    private void fetchAndUpdateCharts() {
        Firestore db = FirestoreClient.getFirestore();

        // Fetch and update gender distribution pie chart
        ApiFuture<QuerySnapshot> genderFuture = db.collection("voters").get();
        genderFuture.addListener(() -> {
            try {
                List<QueryDocumentSnapshot> documents = genderFuture.get().getDocuments();
                Map<String, Integer> genderCounts = new HashMap<>();

                for (QueryDocumentSnapshot document : documents) {
                    String gender = document.getString("gender");

                    if (gender != null) {
                        genderCounts.put(gender, genderCounts.getOrDefault(gender, 0) + 1);
                    } else {
                        System.out.println("Warning: Found a document without a gender field.");
                    }
                }

                Platform.runLater(() -> updateGenderPieChart(genderCounts));

            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();
            }
        }, Runnable::run);

        // Fetch and update employment distribution line chart
        ApiFuture<QuerySnapshot> employmentFuture = db.collection("voters").get();
        employmentFuture.addListener(() -> {
            try {
                List<QueryDocumentSnapshot> documents = employmentFuture.get().getDocuments();
                Map<String, Integer> employmentCounts = new HashMap<>();
                for (QueryDocumentSnapshot document : documents) {
                    String employmentStatus = document.getString("employment");
                    if (employmentStatus != null) {
                        employmentCounts.put(employmentStatus, employmentCounts.getOrDefault(employmentStatus, 0) + 1);
                    }
                }
                Platform.runLater(() -> updateEmploymentLineChart(employmentCounts));
            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();
            }
        }, Runnable::run);

        // Fetch and update age distribution bar chart
        ApiFuture<QuerySnapshot> ageFuture = db.collection("voters").get();
        ageFuture.addListener(() -> {
            try {
                List<QueryDocumentSnapshot> documents = ageFuture.get().getDocuments();
                Map<String, Integer> ageGroups = new HashMap<>();
                ageGroups.put("19-20", 0);
                ageGroups.put("21-30", 0);
                ageGroups.put("31-42", 0);
                ageGroups.put("43-50", 0);
                ageGroups.put("60+", 0);

                for (QueryDocumentSnapshot document : documents) {
                    int age = document.getLong("age").intValue();
                    if (age >= 19 && age <= 20) {
                        ageGroups.put("19-20", ageGroups.get("19-20") + 1);
                    } else if (age >= 21 && age <= 30) {
                        ageGroups.put("21-30", ageGroups.get("21-30") + 1);
                    } else if (age >= 31 && age <= 42) {
                        ageGroups.put("31-42", ageGroups.get("31-42") + 1);
                    } else if (age >= 43 && age <= 50) {
                        ageGroups.put("43-50", ageGroups.get("43-50") + 1);
                    } else if (age >= 60) {
                        ageGroups.put("60+", ageGroups.get("60+") + 1);
                    }
                }
                Platform.runLater(() -> updateAgeBarChart(ageGroups));
            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();
            }
        }, Runnable::run);
    }

    private void updateGenderPieChart(Map<String, Integer> genderCounts) {
        gender_piechart.getData().clear();

        for (Map.Entry<String, Integer> entry : genderCounts.entrySet()) {
            PieChart.Data slice = new PieChart.Data(entry.getKey() + ": " + entry.getValue(), entry.getValue());
            gender_piechart.getData().add(slice);

            // Add a listener to apply styles after the chart is rendered
            slice.nodeProperty().addListener((obs, oldNode, newNode) -> {
                if (newNode != null) {
                    String color = getColorForGender(entry.getKey());
                    newNode.setStyle("-fx-pie-color: " + color + ";");
                }
            });
        }

        gender_piechart.setLabelsVisible(true);
    }

    private String getColorForGender(String gender) {
        switch (gender) {
            case "Male":
                return "#1f77b4"; // Blue
            case "Female":
                return "#ff7f0e"; // Orange
            case "Other":
                return "#2ca02c"; // Green
            default:
                return "#d62728"; // Red for unknown or other categories
        }
    }

    private void updateEmploymentLineChart(Map<String, Integer> employmentCounts) {
        employmets_linechart.getData().clear();

        XYChart.Series<String, Number> series = new XYChart.Series<>();
        for (Map.Entry<String, Integer> entry : employmentCounts.entrySet()) {
            series.getData().add(new XYChart.Data<>(entry.getKey(), entry.getValue()));
        }

        employmets_linechart.getData().add(series);

        // Customize the color of the line
        series.getNode().lookup(".chart-series-line").setStyle("-fx-stroke: blue;");

        // Customize the color of the data points (optional)
        for (XYChart.Data<String, Number> data : series.getData()) {
            data.getNode().setStyle("-fx-background-color: blue, white;");
        }
    }

    private void updateAgeBarChart(Map<String, Integer> ageGroups) {
        voters_barchat.getData().clear();

        XYChart.Series<String, Number> series = new XYChart.Series<>();
        for (Map.Entry<String, Integer> entry : ageGroups.entrySet()) {
            series.getData().add(new XYChart.Data<>(entry.getKey(), entry.getValue()));
        }
        voters_barchat.getData().add(series);

        if (voters_barchat.getXAxis() instanceof CategoryAxis) {
            CategoryAxis xAxis = (CategoryAxis) voters_barchat.getXAxis();
            xAxis.setTickLabelRotation(45); // Rotate labels 45 degrees
            xAxis.setTickLabelGap(10); // Add space between labels
            xAxis.setLabel("Age Groups"); // Set X-Axis Label
            xAxis.setTickLabelsVisible(true); // Ensure tick labels are visible
        }

        if (voters_barchat.getYAxis() instanceof NumberAxis) {
            NumberAxis yAxis = (NumberAxis) voters_barchat.getYAxis();
            yAxis.setLabel("Number of Voters"); // Set Y-Axis Label
        }
    }
}
