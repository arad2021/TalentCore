package com.Temp.Controller;
import com.Temp.DTOs.CandidateJson;
import com.Temp.DTOs.JobApplicationJson;
import com.Temp.DTOs.TicketJson;
import com.Temp.Model.*;
import com.Temp.Service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;

@RestController
@RequestMapping("/api/Candidate")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"})
public class CandidateController {
    @Autowired
    CandidateService candidateService;

    @GetMapping("/jobapplications/{id}")
    public ArrayList<JobApplication> getJobApplicationByCandidateId(@PathVariable Long id) {
        return candidateService.getJobApplicationByCandidateId(id);

    }

    @GetMapping("/details/{id}")
    public Candidate getCandidateDetails(@PathVariable Long id) {
        return this.candidateService.getCandidateDetails(id);
    }

    @PostMapping("/signup")
    public String signUp(@RequestBody CandidateJson candidateJson) {
        return this.candidateService.SignUp(candidateJson);

    }
    @GetMapping("/signin/{email}")
    public String signIn(@PathVariable String email) {
        return this.candidateService.SignIn(email);
    }

    @PostMapping("/{candidateId}/github-projects")
    public String addGitHubProject(@PathVariable Long candidateId, 
                                   @RequestParam String projectName, 
                                   @RequestParam String githubLink,
                                   @RequestParam(required = false) String resources) {
        return this.candidateService.addProject(candidateId, projectName, githubLink, resources);
    }

    @PutMapping("/{candidateId}/projects/{projectName}")
    public String updateProject(@PathVariable Long candidateId, 
                               @PathVariable String projectName,
                               @RequestParam(required = false) String newProjectName,
                               @RequestParam(required = false) String githubLink,
                               @RequestParam(required = false) String resources) {
        return this.candidateService.updateProject(candidateId, projectName, newProjectName, githubLink, resources);
    }

    @DeleteMapping("/{candidateId}/projects/{projectName}")
    public String removeProject(@PathVariable Long candidateId, @PathVariable String projectName) {
        return this.candidateService.removeProjectFromCandidate(candidateId, projectName);
    }

    @PutMapping("/{candidateId}/ticket")
    public String updateTicket(@PathVariable Long candidateId, @RequestBody TicketJson ticketJson) {
        return this.candidateService.updateCandidateTicket(candidateId, ticketJson);
    }

    @GetMapping("/joboffers/{id}")
    public ArrayList<JobOffer> getJobOffersById(@PathVariable Long id) {
        return this.candidateService.getJobOffersById(id);
    }

    @GetMapping("/alljobs")
    public ArrayList<Job> getAllJobs() {
        return this.candidateService.getAllJobs();
    }

    @PostMapping("/apply")
    public String applyForJob(@RequestBody JobApplicationJson jobApplicationJson) {
        return this.candidateService.applyForJob(jobApplicationJson);
    }

    @PutMapping("/{candidateId}/personal-info")
    public String updatePersonalInfo(@PathVariable Long candidateId, @RequestBody CandidateJson candidateJson) {
        return this.candidateService.updateCandidatePersonalInfo(candidateId, candidateJson);
    }

    @PostMapping("/{candidateId}/cv/upload")
    public String uploadCV(@PathVariable Long candidateId, @RequestParam("file") MultipartFile file) {
        return this.candidateService.uploadCV(candidateId, file);
    }

    @GetMapping("/{candidateId}/cv/download")
    public ResponseEntity<Resource> downloadCV(@PathVariable Long candidateId) {
        return this.candidateService.downloadCVWithHeaders(candidateId);
    }

    @GetMapping("/{candidateId}/cv/view")
    public ResponseEntity<Resource> viewCV(@PathVariable Long candidateId) {
        return this.candidateService.viewCVWithHeaders(candidateId);
    }

    @DeleteMapping("/{candidateId}/cv")
    public String deleteCV(@PathVariable Long candidateId) {
        return this.candidateService.deleteCV(candidateId);
    }

    @GetMapping("/{candidateId}/cv/exists")
    public boolean hasCV(@PathVariable Long candidateId) {
        return this.candidateService.hasCV(candidateId);
    }

    @PostMapping("/{candidateId}/profile-picture/upload")
    public String uploadProfilePicture(@PathVariable Long candidateId, @RequestParam("file") MultipartFile file) {
        return this.candidateService.uploadProfilePicture(candidateId, file);
    }

    @GetMapping("/{candidateId}/profile-picture/view")
    public ResponseEntity<Resource> viewProfilePicture(@PathVariable Long candidateId) {
        return this.candidateService.viewProfilePictureWithHeaders(candidateId);
    }

    @DeleteMapping("/{candidateId}/profile-picture")
    public String deleteProfilePicture(@PathVariable Long candidateId) {
        return this.candidateService.deleteProfilePicture(candidateId);
    }

    @GetMapping("/{candidateId}/profile-picture/exists")
    public boolean hasProfilePicture(@PathVariable Long candidateId) {
        return this.candidateService.hasProfilePicture(candidateId);
    }

    @DeleteMapping("/jobapplications/{applicationId}")
    public String withdrawApplication(@PathVariable Long applicationId) {
        return this.candidateService.withdrawApplication(applicationId);
    }

    @PutMapping("/joboffers/{jobOfferId}/status/{status}")
    public String updateJobOfferStatus(@PathVariable Long jobOfferId, @PathVariable String status) {
        return this.candidateService.updateJobOfferStatus(jobOfferId, status);
    }
}





