package com.Temp.DTOs;

import com.fasterxml.jackson.annotation.JsonProperty;

public class JobApplicationJson {
    @JsonProperty("jobId")
    private Long jobId;
    @JsonProperty("candidateId")
    private Long candidateId;

    // Default constructor
    public JobApplicationJson() {
    }

    // Constructor with parameters
    public JobApplicationJson(Long jobId, Long candidateId) {
        this.jobId = jobId;
        this.candidateId = candidateId;
    }

    // Getters
    public Long getJobId() {
        return jobId;
    }

    public Long getCandidateId() {
        return candidateId;
    }

    // Setters
    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }
}
