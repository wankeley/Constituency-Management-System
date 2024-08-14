package com.example.bookshop_inventory_mgt;

public class Welfare {

    public String programname;
    public String programeid;
    public String prodescription;
    public String startdate;
    public String enddate;


    // Default constructor required for Firebase
    public Welfare() {}

    public Welfare(String programname, String programeid, String prodescription, String startdate, String enddate )
    {
        this.programname=programname;
        this.programeid=programeid;
        this.prodescription=prodescription;
        this.startdate=startdate;
        this.enddate=enddate;
    }


    public String getProgramname() {
        return programname;
    }

    public void setProgramname(String programname) {
        this.programname = programname;
    }

    public String getProgrameid() {
        return programeid;
    }

    public void setProgrameid(String programeid) {
        this.programeid = programeid;
    }

    public String getProdescription() {
        return prodescription;
    }

    public void setProdescription(String prodescription) {
        this.prodescription = prodescription;
    }

    public String getStartdate() {
        return startdate;
    }

    public void setStartdate(String startdate) {
        this.startdate = startdate;
    }

    public String getEnddate() {
        return enddate;
    }

    public void setEnddate(String enddate) {
        this.enddate = enddate;
    }
}
