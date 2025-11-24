package com.Temp.Service;
import com.Temp.DTOs.JobApplicationJson;
import com.Temp.Model.*;
import com.Temp.Repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class JobApplicationService {
    @Autowired
    JobApplicationRepository jobApplicationRepository;

public ArrayList<JobApplication> getJobApplicationByCandidateId(Long candidateId){
    if (candidateId == null) {
        return new ArrayList<>();
    }
    List<JobApplication> all = getAll();
    ArrayList<JobApplication> result = new ArrayList<>();
    for (JobApplication application : all) {
        Long currentCandidateId = application.getCandidateId();
        if (currentCandidateId != null && currentCandidateId == candidateId) {
            result.add(application);
        }
    }
    return result;
}



public ArrayList<JobApplication> getAll(){
    return (ArrayList<JobApplication>) this.jobApplicationRepository.findAll();

}


public ArrayList<JobApplication> getJobApplicationsByJobId(Long jobId){
        if (jobId == null) {
            return new ArrayList<>();
        }
        List<JobApplication> all = getAll();
        ArrayList<JobApplication> result = new ArrayList<>();
        for (JobApplication application : all) {
            Long currentJobId = application.getJobId();
            if (currentJobId != null && currentJobId.equals(jobId)) {
                result.add(application);
            }
        }
        return result;
    }

    public String addJobApplication(JobApplicationJson jobApplicationJson) {
        try {
            // Check if JobApplication with same candidateId and jobId already exists
            ArrayList<JobApplication> existingApplications = getAll();
            for (JobApplication existingApp : existingApplications) {
                if (existingApp.getCandidateId() != null && existingApp.getJobId() != null &&
                    existingApp.getCandidateId().equals(jobApplicationJson.getCandidateId()) &&
                    existingApp.getJobId().equals(jobApplicationJson.getJobId())) {
                    return "ERROR"; // Duplicate application exists
                }
            }
            
            // Create new JobApplication from the JSON DTO
            JobApplication jobApplication = new JobApplication(jobApplicationJson);
            
            // Save to database
            jobApplicationRepository.save(jobApplication);
            
            return "OK";
        } catch (Exception e) {
            return "ERROR";
        }
    }

    public String updateJobApplicationStatus(Long jobApplicationId, String status) {
        if (jobApplicationId == null || status == null) {
            return "ERROR";
        }
        String normalized = status.trim().toUpperCase();
        if (!(normalized.equals("PENDING") || normalized.equals("ACCEPTED") || normalized.equals("DENIED"))) {
            return "ERROR";
        }
        try {
            Optional<JobApplication> optional = jobApplicationRepository.findById(jobApplicationId);
            if (!optional.isPresent()) {
                return "ERROR";
            }
            JobApplication application = optional.get();
            application.setStatus(normalized);
            jobApplicationRepository.save(application);
            return "OK";
        } catch (Exception e) {
            return "ERROR";
        }
    }

    public void deleteJobApplication(Long jobApplicationId) {
        try {
            jobApplicationRepository.deleteById(jobApplicationId);
        } catch (Exception e) {
            // Log error but don't throw to avoid breaking the cascade delete
            System.err.println("Failed to delete job application: " + e.getMessage());
        }
    }
}