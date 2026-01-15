package com.example.bookshop_inventory_mgt;

public class Dashboard_tableview {
        private String fullname;
        private String gender;
        private String phone;
        private int age;
        private String voterId;

        public Dashboard_tableview(String fullname, String gender, String phone, int age, String voterId) {
            this.fullname = fullname;
            this.gender = gender;
            this.phone = phone;
            this.age = age;
            this.voterId = voterId;
        }

        public String getFullname() {
            return fullname;
        }

        public String getGender() {
            return gender;
        }

        public String getPhone() {
            return phone;
        }

        public int getAge() {
            return age;
        }

        public String getVoterId() {
            return voterId;
        }
    }


