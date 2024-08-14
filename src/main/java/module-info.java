module com.example.bookshop_inventory_mgt {
    requires javafx.controls;
    requires javafx.fxml;
    requires com.google.auth.oauth2;
    requires firebase.admin;
    requires com.google.auth;
    requires com.google.api.client;
    requires com.google.api.apicommon;
    requires google.cloud.firestore;
    requires google.cloud.core;




    opens com.example.bookshop_inventory_mgt to javafx.fxml;
    exports com.example.bookshop_inventory_mgt;
}