package com.Temp.Service;
import com.Temp.Model.*;
import com.Temp.DTOs.RecruiterJson;
import com.Temp.DTOs.JobJson;
import com.Temp.DTOs.JobOfferJson;
import com.Temp.Repository.RecruiterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Optional;
import java.util.Objects;


@Service
public class RecruiterService {
    @Autowired
    JobApplicationService jobApplicationService;
    @Autowired
    JobService jobService;
    @Autowired
    JobOfferService jobOfferService;
    @Autowired
    RecruiterRepository recruiterRepository;
    @Autowired
    FileStorageService fileStorageService;
    @Autowired
    CandidateService candidateService;
    @Autowired
    GeminiService geminiService;

    public ArrayList<Recruiter> getAll(){
        return (ArrayList<Recruiter>) this.recruiterRepository.findAll();
    }

    public String SignUp(RecruiterJson recruiterJson) {
        Recruiter recruiter = new Recruiter(recruiterJson);
        ArrayList<Recruiter> temp = getAll();
        for(Recruiter r : temp){
            if(Objects.equals(r.getEmail(), recruiter.getEmail()))
                return "Recruiter Already Exist";
        }
        recruiterRepository.save(recruiter);
        return "Success";
    }

    public String SignIn(String email){
        ArrayList<Recruiter> temp = getAll();
        for(Recruiter r : temp){
            if(Objects.equals(r.getEmail(), email))
                return r.getId().toString();
        }
        return "Recruiter Not Exist";
    }
    public Recruiter getRecruiterDetails(Long id){
        ArrayList<Recruiter> recruiters = getAll();
        for(Recruiter recruiter : recruiters){
            if(recruiter.getId() != null && Objects.equals(recruiter.getId(), id)){
                return recruiter;
            }
        }
        return null;
    }

    public Recruiter getRecruiterByEmail(String email){
        ArrayList<Recruiter> recruiters = getAll();
        for(Recruiter recruiter : recruiters){
            if(recruiter.getEmail() != null && Objects.equals(recruiter.getEmail(), email)){
                return recruiter;
            }
        }
        return null;
    }

    public ArrayList<Job> getAllJobsByRecruiterId(Long id) {
        return this.jobService.getAllJobsByRecruiterId(id);
    }

    public ArrayList<JobApplication> getJobApplicationsByJobId(Long id) {
       return this.jobApplicationService.getJobApplicationsByJobId(id);
    }

    public String createJob(JobJson jobJson) {
        try {
            Job job = new Job(
                jobJson.getRecruiterId(),
                jobJson.getTicket(),
                jobJson.getTitle(),
                jobJson.getDescription(),
                jobJson.getStatus(),
                jobJson.getCompany(),
                jobJson.getTechnicalSkills()
            );
            
        
            this.jobService.saveJob(job);
            
            return "Job created successfully";
        } catch (Exception e) {
            return "Failed to create job: " + e.getMessage();
        }
    }

    public String updateJob(JobJson jobJson) {
        try {
            // Find the existing job by ID
            Job existingJob = this.jobService.getJobById(jobJson.getJobId());
            if (existingJob == null) {
                return "Job not found";
            }
            
            // Update the job properties
            existingJob.setTitle(jobJson.getTitle());
            existingJob.setDescription(jobJson.getDescription());
            existingJob.setCompany(jobJson.getCompany());
            existingJob.setStatus(jobJson.getStatus());
            existingJob.setTicket(jobJson.getTicket());
            existingJob.setTechnicalSkills(jobJson.getTechnicalSkills());
            
            // Save the updated job
            this.jobService.saveJob(existingJob);
            
            return "Job updated successfully";
        } catch (Exception e) {
            return "Failed to update job: " + e.getMessage();
        }
    }

    public String deleteJob(Long jobId) {
        try {
            // Find the existing job by ID
            Job existingJob = this.jobService.getJobById(jobId);
            if (existingJob == null) {
                return "Job not found";
            }
            
            // Delete all job applications for this job
            ArrayList<JobApplication> jobApplications = this.jobApplicationService.getJobApplicationsByJobId(jobId);
            for (JobApplication application : jobApplications) {
                this.jobApplicationService.deleteJobApplication(application.getJobApplicationId());
            }
            
            // Delete all job offers for this job
            ArrayList<JobOffer> jobOffers = this.jobOfferService.getJobOffersByJobId(jobId);
            for (JobOffer offer : jobOffers) {
                this.jobOfferService.deleteJobOffer(offer.getJobOfferId());
            }
            
            // Finally, delete the job itself
            this.jobService.deleteJob(jobId);
            
            return "Job and all related applications and offers deleted successfully";
        } catch (Exception e) {
            return "Failed to delete job: " + e.getMessage();
        }
    }

    public String toggleJobStatus(Long jobId, String newStatus) {
        try {
            // Find the existing job by ID
            Job existingJob = this.jobService.getJobById(jobId);
            if (existingJob == null) {
                return "Job not found";
            }
            
            // Validate the new status
            String normalizedStatus = newStatus.trim();
            if (!(normalizedStatus.equals("Active") || normalizedStatus.equals("Closed"))) {
                return "Invalid status. Must be 'Active' or 'Closed'";
            }
            
            // Update the job status
            existingJob.setStatus(normalizedStatus);
            this.jobService.saveJob(existingJob);
            
            return "Job status updated successfully";
        } catch (Exception e) {
            return "Failed to update job status: " + e.getMessage();
        }
    }

    public ArrayList<JobOffer> getJobOffersByJobId(Long jobId) {
        return this.jobOfferService.getJobOffersByJobId(jobId);
    }

    public ArrayList<Job> getAllJobs() {
        return this.jobService.getAllJobs();
    }

    public String createJobOffer(JobOfferJson jobOfferJson) {
        return this.jobOfferService.createJobOffer(jobOfferJson);
    }

    public String deleteJobOffer(Long jobOfferId) {
        try {
            this.jobOfferService.deleteJobOffer(jobOfferId);
            return "OK";
        } catch (Exception e) {
            return "ERROR";
        }
    }

    public Candidate getCandidateProfile(Long candidateId) {
        return candidateService.getCandidateDetails(candidateId);
    }

    public Resource getCandidateCV(Long candidateId) {
        Candidate candidate = getCandidateProfile(candidateId);
        if (candidate == null) {
            throw new RuntimeException("Candidate not found");
        }

        if (candidate.getCv() == null || candidate.getCv().isEmpty()) {
            throw new RuntimeException("No CV found for this candidate");
        }

        return fileStorageService.loadFileAsResource(candidate.getCv());
    }
    public String updateJobApplicationStatus(Long applicationId, String status) {
        return this.jobApplicationService.updateJobApplicationStatus(applicationId, status);
    }

    public ResponseEntity<Resource> getCandidateCVWithHeaders(Long candidateId) {
        try {
            Resource resource = getCandidateCV(candidateId);
            
            String filename = resource.getFilename();
            MediaType contentType = MediaType.APPLICATION_PDF;
            String downloadFilename = "candidate_cv.pdf";
            
            if (filename != null && (filename.endsWith(".doc") || filename.endsWith(".docx"))) {
                contentType = filename.endsWith(".docx") ? 
                    MediaType.valueOf("application/vnd.openxmlformats-officedocument.wordprocessingml.document") :
                    MediaType.valueOf("application/msword");
                downloadFilename = "candidate_cv" + filename.substring(filename.lastIndexOf("."));
            }
            
            return ResponseEntity.ok()
                    .contentType(contentType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + downloadFilename + "\"")
                    .body(resource);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    public String updateRecruiterPersonalInfo(Long recruiterId, RecruiterJson recruiterJson) {
        try {
            if (recruiterId == null || recruiterJson == null) {
                return "Invalid request";
            }

            Optional<Recruiter> optional = recruiterRepository.findById(recruiterId);
            if (!optional.isPresent()) {
                return "Recruiter not found";
            }

            Recruiter recruiter = optional.get();
            recruiter.setFirstName(recruiterJson.getFirstName());
            recruiter.setLastName(recruiterJson.getLastName());
            recruiter.setPhoneNumber(recruiterJson.getPhoneNumber());
            recruiter.setEmail(recruiterJson.getEmail());
            recruiter.setCompany(recruiterJson.getCompany());

            recruiterRepository.save(recruiter);

            return "Personal information updated successfully";
        } catch (Exception e) {
            return "Failed to update personal information";
        }
    }

    public String generateResponse(String prompt) {
        return this.geminiService.generateResponse(prompt);
    }

    public ArrayList<Object[]> getCandidatesForJob(Long jobId) {
        try {
            Job job = this.jobService.getJobById(jobId);
            if (job == null) {
                return new ArrayList<>();
            }
            Ticket jobTicket = job.getTicket();
            ArrayList<Candidate> candidates = this.candidateService.getCandidatesByJobTicket(jobTicket);
            if (candidates == null || candidates.isEmpty()) {
                return new ArrayList<>();
            }
            ArrayList<Object[]> candidatesWithScore = this.geminiService.getCandidatesWithScore(candidates, job);
            return candidatesWithScore != null ? candidatesWithScore : new ArrayList<>();
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public String uploadProfilePicture(Long recruiterId, MultipartFile file) {
        Optional<Recruiter> optional = recruiterRepository.findById(recruiterId);
        if (!optional.isPresent()) {
            return "Recruiter not found";
        }

        Recruiter recruiter = optional.get();
        try {
            // Delete old profile picture if exists
            if (recruiter.getProfilePicture() != null && !recruiter.getProfilePicture().isEmpty()) {
                fileStorageService.deleteFile(recruiter.getProfilePicture());
            }

            // Store new profile picture
            String filename = fileStorageService.storeRecruiterProfilePicture(file, recruiterId);
            recruiter.setProfilePicture(filename);
            recruiterRepository.save(recruiter);

            return "Profile picture uploaded successfully";
        } catch (Exception e) {
            return "Error uploading profile picture: " + e.getMessage();
        }
    }

    public Resource downloadProfilePicture(Long recruiterId) {
        Optional<Recruiter> optional = recruiterRepository.findById(recruiterId);
        if (!optional.isPresent()) {
            throw new RuntimeException("Recruiter not found");
        }

        Recruiter recruiter = optional.get();
        if (recruiter.getProfilePicture() == null || recruiter.getProfilePicture().isEmpty()) {
            throw new RuntimeException("No profile picture found for this recruiter");
        }

        return fileStorageService.loadFileAsResource(recruiter.getProfilePicture());
    }

    public ResponseEntity<Resource> viewProfilePictureWithHeaders(Long recruiterId) {
        try {
            Resource resource = downloadProfilePicture(recruiterId);
            
            String filename = resource.getFilename();
            MediaType contentType = MediaType.IMAGE_JPEG;
            
            if (filename != null) {
                if (filename.toLowerCase().endsWith(".png")) {
                    contentType = MediaType.IMAGE_PNG;
                } else if (filename.toLowerCase().endsWith(".gif")) {
                    contentType = MediaType.IMAGE_GIF;
                } else if (filename.toLowerCase().endsWith(".webp")) {
                    contentType = MediaType.valueOf("image/webp");
                }
            }
            
            return ResponseEntity.ok()
                    .contentType(contentType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    public String deleteProfilePicture(Long recruiterId) {
        Optional<Recruiter> optional = recruiterRepository.findById(recruiterId);
        if (!optional.isPresent()) {
            return "Recruiter not found";
        }

        Recruiter recruiter = optional.get();
        if (recruiter.getProfilePicture() == null || recruiter.getProfilePicture().isEmpty()) {
            return "No profile picture found for this recruiter";
        }

        try {
            boolean deleted = fileStorageService.deleteFile(recruiter.getProfilePicture());
            if (deleted) {
                recruiter.setProfilePicture(null);
                recruiterRepository.save(recruiter);
                return "Profile picture deleted successfully";
            } else {
                return "Failed to delete profile picture file";
            }
        } catch (Exception e) {
            return "Error deleting profile picture: " + e.getMessage();
        }
    }

    public boolean hasProfilePicture(Long recruiterId) {
        Optional<Recruiter> optional = recruiterRepository.findById(recruiterId);
        if (!optional.isPresent()) {
            return false;
        }

        Recruiter recruiter = optional.get();
        return recruiter.getProfilePicture() != null && !recruiter.getProfilePicture().isEmpty() && 
               fileStorageService.fileExists(recruiter.getProfilePicture());
    }
}
