package com.Temp.DTOs;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.Temp.Model.Ticket;

public class JobJson {
    @JsonProperty("jobId")
    private Long jobId;
    @JsonProperty("recruiterId")
    private Long recruiterId;
    @JsonProperty("title")
    private String title;
    @JsonProperty("description")
    private String description;
    @JsonProperty("status")
    private String status;
    @JsonProperty("company")
    private String company;
    @JsonProperty("ticket")
    private Ticket ticket;
    @JsonProperty("technicalSkills")
    private String technicalSkills;

    public JobJson() {
    }

    public JobJson(Long jobId, Long recruiterId, String title, String description, String status, String company, Ticket ticket, String technicalSkills) {
        this.jobId = jobId;
        this.recruiterId = recruiterId;
        this.title = title;
        this.description = description;
        this.status = status;
        this.company = company;
        this.ticket = ticket;
        this.technicalSkills = technicalSkills;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public Long getRecruiterId() {
        return recruiterId;
    }

    public void setRecruiterId(Long recruiterId) {
        this.recruiterId = recruiterId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public String getTechnicalSkills() {
        return technicalSkills;
    }

    public void setTechnicalSkills(String technicalSkills) {
        this.technicalSkills = technicalSkills;
    }

}
