package com.Temp.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class StaticController {

    @GetMapping("/user-portal.html")
    public String userPortal() {
        return "forward:/index.html";
    }

    @GetMapping("/")
    public String home() {
        return "forward:/index.html";
    }

    // Candidate routes
    @GetMapping("/candidate")
    public String candidate() {
        return "forward:/index.html";
    }

    @GetMapping("/candidate/profile")
    public String candidateProfile() {
        return "forward:/index.html";
    }

    @GetMapping("/candidate/jobs")
    public String candidateJobs() {
        return "forward:/index.html";
    }

    @GetMapping("/candidate/personalized-jobs")
    public String candidatePersonalizedJobs() {
        return "forward:/index.html";
    }

    // Recruiter routes
    @GetMapping("/recruiter")
    public String recruiter() {
        return "forward:/index.html";
    }

    @GetMapping("/recruiter/profile")
    public String recruiterProfile() {
        return "forward:/index.html";
    }

    @GetMapping("/recruiter/jobs")
    public String recruiterJobs() {
        return "forward:/index.html";
    }

    @GetMapping("/recruiter/create-job")
    public String recruiterCreateJob() {
        return "forward:/index.html";
    }

    // Public jobs route
    @GetMapping("/jobs")
    public String publicJobs() {
        return "forward:/index.html";
    }
}
