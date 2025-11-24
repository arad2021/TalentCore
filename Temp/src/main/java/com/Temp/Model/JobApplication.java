package com.Temp.Model;

import com.Temp.DTOs.JobApplicationJson;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class JobApplication {  
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long jobApplicationId;
	private Long jobId;
	private Long candidateId;
	private String status;
	private Boolean isActive;

	public Long getJobApplicationId() {
		return jobApplicationId;
	}

	public JobApplication() {

    }

	public JobApplication(
					   Long jobId,
					   Long candidateId,
					   String status,
					   Boolean isActive) {
		this.jobId = jobId;
		this.candidateId = candidateId;
		this.status = status;
		this.isActive = isActive;
	}

	// Constructor from DTO with default values
	public JobApplication(JobApplicationJson dto) {
		this.jobId = dto.getJobId();
		this.candidateId = dto.getCandidateId();
		this.status = "PENDING"; // Default status
		this.isActive = true; // Default to active
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

	public Boolean getIsActive() {
		return isActive;
	}

	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
	}
}
