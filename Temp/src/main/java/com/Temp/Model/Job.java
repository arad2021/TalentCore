package com.Temp.Model;

import jakarta.persistence.*;



@Entity
public class Job {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long jobId;
	private Long recruiterId;
	@Embedded
	private Ticket ticket;
	@Column(length = 500)
	private String title;
	@Column(length = 10000)
	private String description;
	@Column(length = 50)
	private String status;
	@Column(length = 200)
	private String company;
	@Column(length = 2000)
	private String technicalSkills;


	public Job() {
	}

	public Job(
			  Long recruiterId,
			  Ticket ticket,
			  String title,
			  String description,
			  String status,
			  String company,
			  String technicalSkills) {
		this.recruiterId = recruiterId;
		this.ticket = ticket;
		this.title = title;
		this.description = description;
		this.status = status;
		this.company = company;
		this.technicalSkills = technicalSkills;
	}

	public Long getJobId() {
		return this.jobId;
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

	public Ticket getTicket() {
		return ticket;
	}

	public void setTicket(Ticket ticket) {
		this.ticket = ticket;
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

	public String getTechnicalSkills() {
		return technicalSkills;
	}

	public void setTechnicalSkills(String technicalSkills) {
		this.technicalSkills = technicalSkills;
	}

}
