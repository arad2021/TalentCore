package com.Temp.DTOs;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TicketJson {
    @JsonProperty("city")
    private String city;
    @JsonProperty("experience")
    private String experience;
    @JsonProperty("remote")
    private String remote;
    @JsonProperty("jobType")
    private String jobType;
    @JsonProperty("field")
    private String field;
    @JsonProperty("degree")
    private String degree;

    public TicketJson() {
    }

    public TicketJson(String city, String experience, String remote, String jobType, String field, String degree) {
        this.city = city;
        this.experience = experience;
        this.remote = remote;
        this.jobType = jobType;
        this.field = field;
        this.degree = degree;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getRemote() {
        return remote;
    }

    public void setRemote(String remote) {
        this.remote = remote;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    @Override
    public String toString() {
        return "TicketJson{" +
                "city='" + city + '\'' +
                ", experience='" + experience + '\'' +
                ", remote='" + remote + '\'' +
                ", jobType='" + jobType + '\'' +
                ", field='" + field + '\'' +
                ", degree='" + degree + '\'' +
                '}';
    }
}
