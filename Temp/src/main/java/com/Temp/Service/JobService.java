package com.Temp.Service;
import com.Temp.Model.*;
import com.Temp.Repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class JobService {
    @Autowired
    JobRepository jobRepository;


    public ArrayList<Job> getAll(){
        return (ArrayList<Job>) this.jobRepository.findAll();
    }

    public ArrayList<Job> getAllJobs(){
        return (ArrayList<Job>) this.jobRepository.findAll();
    }
    public ArrayList<Job> getAllJobsByRecruiterId(Long id){
        ArrayList<Job> temp = getAll();
        ArrayList<Job> result = new ArrayList<Job>();

        for(Job j : temp){
            if(j.getRecruiterId() == id)
                result.add(j);
        }
        return result;
    }

    public Job saveJob(Job job) {
        return this.jobRepository.save(job);
    }

    public Job getJobById(Long jobId) {
        return this.jobRepository.findById(jobId).orElse(null);
    }

    public void deleteJob(Long jobId) {
        this.jobRepository.deleteById(jobId);
    }

}
