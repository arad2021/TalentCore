package com.Temp.Model;

import com.Temp.DTOs.JobOfferJson;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class JobOffer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long jobOfferId;
    private Long jobId;
    private Long candidateId;
    private String status;

    public JobOffer(){

    }

    public JobOffer(Long jobId, Long candidateId, String status) {
        this.jobId = jobId;
        this.candidateId = candidateId;
        this.status = status;
    }

    // Constructor from DTO with default values
    public JobOffer(JobOfferJson dto) {
        this.jobId = dto.getJobId();
        this.candidateId = dto.getCandidateId();
        this.status = "PENDING"; // Default status
    }

    public Long getJobOfferId() {
        return jobOfferId;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public Long getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
