package com.example.bookshop_inventory_mgt;
public class Voter_tableview {
    public String fullName;
    public String dob;
    public String gender;
    public String nationality;
    public String address;
    public String phone;
    public String email;
    public String voterId;
    public String regOfficer;
    public String age;
    public String occupation;
    public String language;
    public String employment;
    public String registrationDate;

    // Default constructor required for Firebase
    public Voter_tableview() {}

    public Voter_tableview(String fullName, String dob,String nationality, String address, String phone, String email, String voterId, String regOfficer, String age, String occupation, String language, String employment, String registrationDate, String gender) {
        this.fullName = fullName;
        this.dob = dob;
        this.gender = gender;
        this.nationality = nationality;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.voterId = voterId;
        this.regOfficer = regOfficer;
        this.age = age;
        this.occupation = occupation;
        this.language = language;
        this.employment = employment;
        this.registrationDate = registrationDate;
    }

    // Getters and Setters
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getVoterId() { return voterId; }
    public void setVoterId(String voterId) { this.voterId = voterId; }
    public String getRegOfficer() { return regOfficer; }
    public void setRegOfficer(String regOfficer) { this.regOfficer = regOfficer; }
    public String getAge() { return age; }
    public void setAge(String age) { this.age = age; }
    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getEmployment() { return employment; }
    public void setEmployment(String employment) { this.employment = employment; }
    public String getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(String registrationDate) { this.registrationDate = registrationDate; }
}
