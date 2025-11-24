package com.Temp.Model;

import com.Temp.DTOs.RecruiterJson;
import jakarta.persistence.Entity;

@Entity
public class Recruiter extends User {
	private String company;
	private String profilePicture;

	public Recruiter() {
	}


	public Recruiter(
				   String firstName,
				   String lastName,
				   String phoneNumber,
				   String email,
				   String company) {
		super(firstName, lastName, phoneNumber, email);
		this.company = company;
	}

    public Recruiter(RecruiterJson recruiterJson){
        super(recruiterJson.getFirstName(), recruiterJson.getLastName(), recruiterJson.getPhoneNumber(), recruiterJson.getEmail());
        this.company = recruiterJson.getCompany();
    }

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getProfilePicture() {
		return profilePicture;
	}

	public void setProfilePicture(String profilePicture) {
		this.profilePicture = profilePicture;
	}
}
