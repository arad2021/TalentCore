package com.Temp.Service;

import com.Temp.Repository.JobOfferRepository;
import com.Temp.DTOs.JobOfferJson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Objects;
import com.Temp.Model.JobOffer;

@Service
public class JobOfferService {
    @Autowired
    JobOfferRepository jobOfferRepository;

    public ArrayList<JobOffer> getJobOffersById(Long candidateId) {
        ArrayList<JobOffer> allJobOffers = (ArrayList<JobOffer>) jobOfferRepository.findAll();
        ArrayList<JobOffer> candidateJobOffers = new ArrayList<>();
        
        for (JobOffer jobOffer : allJobOffers) {
            if (jobOffer.getCandidateId() != null && Objects.equals(jobOffer.getCandidateId(), candidateId)) {
                candidateJobOffers.add(jobOffer);
            }
        }
        
        return candidateJobOffers;
    }

    public ArrayList<JobOffer> getJobOffersByJobId(Long jobId) {
        ArrayList<JobOffer> allJobOffers = (ArrayList<JobOffer>) jobOfferRepository.findAll();
        ArrayList<JobOffer> jobOffers = new ArrayList<>();
        
        for (JobOffer jobOffer : allJobOffers) {
            if (jobOffer.getJobId() != null && Objects.equals(jobOffer.getJobId(), jobId)) {
                jobOffers.add(jobOffer);
            }
        }
        
        return jobOffers;
    }

    public String createJobOffer(JobOfferJson jobOfferJson) {
        try {
            // Check if JobOffer already exists with same jobId and candidateId
            ArrayList<JobOffer> allJobOffers = (ArrayList<JobOffer>) jobOfferRepository.findAll();
            for (JobOffer existingOffer : allJobOffers) {
                if (existingOffer.getJobId() != null && existingOffer.getCandidateId() != null &&
                    Objects.equals(existingOffer.getJobId(), jobOfferJson.getJobId()) &&
                    Objects.equals(existingOffer.getCandidateId(), jobOfferJson.getCandidateId())) {
                    return "ERROR";
                }
            }
            
            // Create new JobOffer
            JobOffer jobOffer = new JobOffer(jobOfferJson);
            jobOfferRepository.save(jobOffer);
            return "OK";
        } catch (Exception e) {
            return "ERROR";
        }
    }

    public void deleteJobOffer(Long jobOfferId) {
        try {
            jobOfferRepository.deleteById(jobOfferId);
        } catch (Exception e) {
            // Log error but don't throw to avoid breaking the cascade delete
            System.err.println("Failed to delete job offer: " + e.getMessage());
        }
    }

    public String updateJobOfferStatus(Long jobOfferId, String status) {
        if (jobOfferId == null || status == null) {
            return "ERROR";
        }
        String normalized = status.trim().toUpperCase();
        if (!(normalized.equals("PENDING") || normalized.equals("ACCEPTED") || normalized.equals("DENIED"))) {
            return "ERROR";
        }
        try {
            java.util.Optional<JobOffer> optional = jobOfferRepository.findById(jobOfferId);
            if (!optional.isPresent()) {
                return "ERROR";
            }
            JobOffer jobOffer = optional.get();
            jobOffer.setStatus(normalized);
            jobOfferRepository.save(jobOffer);
            return "OK";
        } catch (Exception e) {
            return "ERROR";
        }
    }
}
