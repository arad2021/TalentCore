package com.Temp.Model;

import jakarta.persistence.*;

@Embeddable
public class Project {
    private String projectName;
    private String githubLink;
    @Column(length = 2000)
    private String resources;

    public Project() {
    }

    public Project(String projectName, String githubLink) {
        this.projectName = projectName;
        this.githubLink = githubLink;
    }

    public Project(String projectName, String githubLink, String resources) {
        this.projectName = projectName;
        this.githubLink = githubLink;
        this.resources = resources;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getGithubLink() {
        return githubLink;
    }

    public void setGithubLink(String githubLink) {
        this.githubLink = githubLink;
    }

    public String getResources() {
        return resources;
    }

    public void setResources(String resources) {
        this.resources = resources;
    }
}
