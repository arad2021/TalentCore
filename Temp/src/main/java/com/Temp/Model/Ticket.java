package com.Temp.Model;


import jakarta.persistence.Embeddable;
import jakarta.persistence.Column;
import java.util.Objects;

@Embeddable
public class Ticket {

	@Column(length = 100)
	private String city;
	@Column
	private String experience;
	@Column(length = 20)
	private String remote;
	@Column(length = 2000)
	private String jobType;
	@Column(length = 2000)
	private String field;
	@Column(length = 50)
	private String degree;

	public Ticket() {
		this.city = "";
		this.experience = "";
		this.remote = "";
		this.jobType = "";
		this.field = "";
		this.degree = "";
	}

	public Ticket(String city,
			   String experience,
			   String remote,
			   String jobType,
			   String field,
			   String degree) {
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


	public boolean equals(Ticket other) {
		if (other == null) {
			return false;
		}
		if (this.experience == null || this.field == null) {
			return false;
		}
		String[] thisFields = this.field.split(",");
		String otherFields = other.field;
		String[] thisExperiences = this.experience.split(",");
		if (!hasCommonValue(this.field, otherFields)) {
				return false;
		}
		int index = -1;
		for (int i = 0; i < thisFields.length; i++) {
			if (thisFields[i].equals(otherFields)) {
				index = i;
				break;
			}
		}
		if (index == -1) {
			return false;
		}
		if (!(Integer.parseInt(thisExperiences[index]) >= Integer.parseInt(other.experience))) {
			return false;
		}




		// others is only one option should be the same as one of the options in this.
		if (!hasCommonValue(this.city, other.city)) {
			return false;
		}


		// others is only one option should be the same as one of the options in this. 
		if (!hasCommonValue(this.remote, other.remote)) {
			return false;
		}

		if (!hasCommonValue(this.jobType, other.jobType)) {
			return false;
		}



        if (!isDegreeCompatible(this.degree, other.degree)) {
			return false;
		}

		return true;
	}



	private boolean hasCommonValue(String thisValue, String otherValue) {
		if (thisValue == null || otherValue == null) {
			return thisValue == null && otherValue == null;
		}

		String[] thisFields = thisValue.split(",");

		for (String thisF : thisFields) {
				if (thisF.trim().equalsIgnoreCase(otherValue)) {
					return true;
				}
		}
		return false; 
	}

	
	private boolean isDegreeCompatible(String thisDegree, String otherDegree) {
		if (thisDegree == null || otherDegree == null) {
			return thisDegree == null && otherDegree == null;
		}

		int thisDegreeLevel = getDegreeLevel(thisDegree);
		int otherDegreeLevel = getDegreeLevel(otherDegree);

		return thisDegreeLevel >= otherDegreeLevel;
	}


	private int getDegreeLevel(String degree) {
		if (degree == null) return 0;
		
		switch (degree.trim()) {
			case "No Degree":
				return 0;
			case "High School Diploma":
				return 1;
			case "Bootcamp Graduate":
				return 2;
			case "Professional Certification":
				return 3;
			case "College Diploma":
				return 4;
			case "Bachelor's Degree":
				return 5;
			case "Master's Degree":
				return 6;
			case "PhD or Doctorate":
				return 7;
			default:

				String lowerDegree = degree.toLowerCase();
				if (lowerDegree.contains("phd") || lowerDegree.contains("doctorate")) {
					return 7;
				} else if (lowerDegree.contains("master")) {
					return 6;
				} else if (lowerDegree.contains("bachelor")) {
					return 5;
				} else if (lowerDegree.contains("college") || lowerDegree.contains("diploma")) {
					return 4;
				} else if (lowerDegree.contains("certification") || lowerDegree.contains("professional")) {
					return 3;
				} else if (lowerDegree.contains("bootcamp")) {
					return 2;
				} else if (lowerDegree.contains("high school")) {
					return 1;
				}
				return 0;
		}
	}
}
