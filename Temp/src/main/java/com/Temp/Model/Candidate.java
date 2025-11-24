package com.Temp.Model;

import jakarta.persistence.*;
import com.Temp.DTOs.CandidateJson;
import java.util.*;


@Entity
public class Candidate extends User {
	private String cv;
	private String profilePicture;
    @Embedded
	private Ticket ticket;
	@ElementCollection
	@CollectionTable(name = "candidate_projects", joinColumns = @JoinColumn(name = "candidate_id"))
	private List<Project> projects;
	private String facebookUrl;
	private String linkedinUrl;

	public Candidate() {
	}

	public Candidate(String firstName, String lastName, String phoneNumber, String email) {
		super(firstName, lastName, phoneNumber, email);
		this.cv = null;
		this.ticket = null;
		this.projects = new ArrayList<>();
	}

	public Candidate(
                   String firstName,
				   String lastName,
				   String phoneNumber,
				   String email,
				   Ticket ticket) {
		super(firstName, lastName, phoneNumber, email);
		this.ticket = ticket;
        this.projects = new ArrayList<>();
	}

    public Candidate(CandidateJson candidateJson){
        super(candidateJson.getFirstName(), candidateJson.getLastName(), candidateJson.getPhoneNumber(), candidateJson.getEmail());

        this.cv = null;
        this.ticket = new Ticket();
        this.projects = new ArrayList<>();
        this.facebookUrl = candidateJson.getFacebookUrl();
        this.linkedinUrl = candidateJson.getLinkedinUrl();
    }


	public String getCv() {
		return cv;
	}

	public void setCv(String cv) {
		this.cv = cv;
	}

	public String getProfilePicture() {
		return profilePicture;
	}

	public void setProfilePicture(String profilePicture) {
		this.profilePicture = profilePicture;
	}

	public Ticket getTicket() {
		return ticket;
	}

	public void setTicket(Ticket ticket) {
		this.ticket = ticket;
	}

	public List<Project> getProjects() {
		return this.projects;
	}

	public void setProjects(List<Project> projects) {
		this.projects = projects;
	}

	// Method to get projects as a Map for frontend compatibility
	public Map<String, String> getAllGitHubProjects() {
		Map<String, String> projectMap = new HashMap<>();
		if (projects != null) {
			for (Project project : projects) {
				if (project.getProjectName() != null && project.getGithubLink() != null) {
					projectMap.put(project.getProjectName(), project.getGithubLink());
				}
			}
		}
		return projectMap;
	}

	// Method to add a project
	public void addProject(String projectName, String githubLink) {
		if (projects == null) {
			projects = new ArrayList<>();
		}
		projects.add(new Project(projectName, githubLink));
	}

	// Method to add a project with all fields
	public void addProject(String projectName, String githubLink, ArrayList<String> lang) {
		if (projects == null) {
			projects = new ArrayList<>();
		}
		// Convert ArrayList<String> to comma-separated String
		String resourcesString = String.join(", ", lang);
		projects.add(new Project(projectName, githubLink, resourcesString));
	}

	// Method to remove a project
	public boolean removeProject(String projectName) {
		if (projects != null) {
			return projects.removeIf(project -> projectName.equals(project.getProjectName()));
		}
		return false;
	}

	// Method to update a project
	public boolean updateProject(String projectName, String newProjectName, String githubLink, String resources) {
		if (projects != null) {
			for (Project project : projects) {
				if (projectName.equals(project.getProjectName())) {
					// Update the project fields
					project.setProjectName(newProjectName);
					project.setGithubLink(githubLink);
					project.setResources(resources);
					return true;
				}
			}
		}
		return false;
	}

	// Method to get a specific project
	public Project getProject(String projectName) {
		if (projects != null) {
			for (Project project : projects) {
				if (projectName.equals(project.getProjectName())) {
					return project;
				}
			}
		}
		return null;
	}

	public String getFacebookUrl() {
		return facebookUrl;
	}

	public void setFacebookUrl(String facebookUrl) {
		this.facebookUrl = facebookUrl;
	}

	public String getLinkedinUrl() {
		return linkedinUrl;
	}

	public void setLinkedinUrl(String linkedinUrl) {
		this.linkedinUrl = linkedinUrl;
	}


}



