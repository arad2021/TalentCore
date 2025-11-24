package com.Temp.Controller;
import com.Temp.DTOs.RecruiterJson;
import com.Temp.DTOs.JobJson;
import com.Temp.DTOs.JobOfferJson;
import com.Temp.Model.*;
import com.Temp.Service.RecruiterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/Recruiter")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"})
public class RecruiterController {
    @Autowired
    RecruiterService recruiterService;

    @GetMapping("/Details/{id}")
    public Recruiter getRecruiterDetails(@PathVariable Long id) {
        return this.recruiterService.getRecruiterDetails(id);
    }

    @PostMapping("/signup")
    public String SignUp(@RequestBody RecruiterJson recruiterJson) {
        return this.recruiterService.SignUp(recruiterJson);

    }

    @GetMapping("/signin/{email}")
    public String SignIn(@PathVariable String email) {
        return this.recruiterService.SignIn(email);
    }

    @GetMapping("/myjobs/{id}")
    public ArrayList<Job> getAllJobsByRecruiterId(@PathVariable Long id) {
        return this.recruiterService.getAllJobsByRecruiterId(id);

    }
    @GetMapping("/jobapplications/{id}")
    public ArrayList<JobApplication> getJobApplicationsByJobId(@PathVariable Long id) {
        return this.recruiterService.getJobApplicationsByJobId(id);

    }

    @PutMapping("/jobapplications/{applicationId}/status/{status}")
    public String updateJobApplicationStatus(@PathVariable Long applicationId, @PathVariable String status) {
        return this.recruiterService.updateJobApplicationStatus(applicationId, status);
    }

    @PostMapping("/createjob")
    public String createJob(@RequestBody JobJson jobJson) {
        return this.recruiterService.createJob(jobJson);
    }

    @PutMapping("/updatejob")
    public String updateJob(@RequestBody JobJson jobJson) {
        return this.recruiterService.updateJob(jobJson);
    }

    @DeleteMapping("/deletejob/{jobId}")
    public String deleteJob(@PathVariable Long jobId) {
        return this.recruiterService.deleteJob(jobId);
    }

    @PutMapping("/togglejobstatus/{jobId}/{newStatus}")
    public String toggleJobStatus(@PathVariable Long jobId, @PathVariable String newStatus) {
        return this.recruiterService.toggleJobStatus(jobId, newStatus);
    }

    @GetMapping("/joboffers/{jobId}")
    public ArrayList<JobOffer> getJobOffersByJobId(@PathVariable Long jobId) {
        return this.recruiterService.getJobOffersByJobId(jobId);
    }

    @GetMapping("/alljobs")
    public ArrayList<Job> getAllJobs() {
        return this.recruiterService.getAllJobs();
    }

    @PostMapping("/createjoboffer")
    public String createJobOffer(@RequestBody JobOfferJson jobOfferJson) {
        return this.recruiterService.createJobOffer(jobOfferJson);
    }

    @DeleteMapping("/joboffers/{jobOfferId}")
    public String deleteJobOffer(@PathVariable Long jobOfferId) {
        return this.recruiterService.deleteJobOffer(jobOfferId);
    }

    @GetMapping("/candidate/{candidateId}/profile")
    public Candidate getCandidateProfile(@PathVariable Long candidateId) {
        return this.recruiterService.getCandidateProfile(candidateId);
    }

    @GetMapping("/candidate/{candidateId}/cv")
    public ResponseEntity<Resource> getCandidateCV(@PathVariable Long candidateId) {
        return this.recruiterService.getCandidateCVWithHeaders(candidateId);
    }

    @PutMapping("/{recruiterId}/personal-info")
    public String updatePersonalInfo(@PathVariable Long recruiterId, @RequestBody RecruiterJson recruiterJson) {
        return this.recruiterService.updateRecruiterPersonalInfo(recruiterId, recruiterJson);
    }

    @GetMapping("/gemini/getcandidates/{jobId}")
    public List<Object[]> getCandidatesForJob(@PathVariable Long jobId) {
        return this.recruiterService.getCandidatesForJob(jobId);
    }

    @PostMapping("/{recruiterId}/profile-picture/upload")
    public String uploadProfilePicture(@PathVariable Long recruiterId, @RequestParam("file") MultipartFile file) {
        return this.recruiterService.uploadProfilePicture(recruiterId, file);
    }

    @GetMapping("/{recruiterId}/profile-picture/view")
    public ResponseEntity<Resource> viewProfilePicture(@PathVariable Long recruiterId) {
        return this.recruiterService.viewProfilePictureWithHeaders(recruiterId);
    }

    @DeleteMapping("/{recruiterId}/profile-picture")
    public String deleteProfilePicture(@PathVariable Long recruiterId) {
        return this.recruiterService.deleteProfilePicture(recruiterId);
    }

    @GetMapping("/{recruiterId}/profile-picture/exists")
    public boolean hasProfilePicture(@PathVariable Long recruiterId) {
        return this.recruiterService.hasProfilePicture(recruiterId);
    }
}