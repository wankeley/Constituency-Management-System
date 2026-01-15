package com.example.bookshop_inventory_mgt;

public class Beneficiary {

    public String voterid;
    public String benid;
    public String dob;
    public String gender;
    public String conatact;
    public String welfare;
    public String family;


    // Default constructor required for Firebase
    public Beneficiary() {}


    public Beneficiary(String voterid, String benid, String dob, String gender, String conatact, String welfare, String family)
    {
        this.voterid=voterid;
        this.benid=benid;
        this.conatact=conatact;
        this.dob=dob;
        this.gender=gender;
        this.welfare=welfare;
        this.family=family;
    }

    public String getVoterid() {
        return voterid;
    }

    public void setVoterid(String voterid) {
        this.voterid = voterid;
    }

    public String getBenid() {
        return benid;
    }

    public void setBenid(String benid) {
        this.benid = benid;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getConatact() {
        return conatact;
    }

    public void setConatact(String conatact) {
        this.conatact = conatact;
    }

    public String getWelfare() {
        return welfare;
    }

    public void setWelfare(String welfare) {
        this.welfare = welfare;
    }

    public String getFamily() {
        return family;
    }

    public void setFamily(String family) {
        this.family = family;
    }
}
