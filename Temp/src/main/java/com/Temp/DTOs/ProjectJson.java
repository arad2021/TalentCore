package com.Temp.DTOs;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ProjectJson {
    @JsonProperty("projectName")
    private String projectName;
    @JsonProperty("githubLink")
    private String githubLink;
    @JsonProperty("resources")
    private String resources;

    public ProjectJson() {
    }

    public ProjectJson(String projectName, String githubLink, String resources) {
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
