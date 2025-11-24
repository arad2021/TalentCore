package com.Temp.Service;
import com.Temp.DTOs.*;
import com.Temp.DTOs.TicketJson;
import com.Temp.Model.*;
import com.Temp.Repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.extractor.WordExtractor;


@Service
public class CandidateService {
    @Autowired
    JobApplicationService jobApplicationService;
    @Autowired
    JobService jobService;
    @Autowired
    JobOfferService jobOfferService;
    @Autowired
    CandidateRepository candidateRepository;
    @Autowired
    FileStorageService fileStorageService;
    @Autowired
    GeminiService geminiService;

    public ArrayList<JobApplication> getJobApplicationByCandidateId(Long CandidateId) {
       return jobApplicationService.getJobApplicationByCandidateId(CandidateId);
    }

    public ArrayList<Candidate> getAll(){
        return (ArrayList<Candidate>) this.candidateRepository.findAll();

    }

    public String SignUp(CandidateJson candidateJson) {
        Candidate candidate = new Candidate(candidateJson);
        ArrayList<Candidate> temp = getAll();
        for(Candidate c : temp){
            if(Objects.equals(c.getEmail(), candidate.getEmail()))
                return "Candidate Already Exist";
        }
        candidateRepository.save(candidate);
        return "Success";
    }

    public String SignIn(String email){
        ArrayList<Candidate> temp = getAll();
        for(Candidate c : temp){
            if(Objects.equals(c.getEmail(), email))
                return c.getId().toString();
        }
        return "Candidate Not Exist";
    }
    public Candidate getCandidateDetails(@PathVariable Long id) {
        ArrayList<Candidate> candidates = getAll();
        for (Candidate candidate : candidates) {
            if (candidate.getId() != null && Objects.equals(candidate.getId(), id)) {
                return candidate;
            }
        }
        return null;
    }

    public Candidate getCandidateByEmail(String email) {
        ArrayList<Candidate> candidates = getAll();
        for (Candidate candidate : candidates) {
            if (candidate.getEmail() != null && Objects.equals(candidate.getEmail(), email)) {
                return candidate;
            }
        }
        return null;
    }


    public String updateCandidateTicket(Long candidateId, TicketJson ticketJson) {
        Candidate candidate = getCandidateDetails(candidateId);
        if (candidate == null) {
            return "Candidate not found";
        }
        Ticket t = candidate.getTicket();


        // Create new ticket from JSON
        Ticket newTicket = new Ticket(
            ticketJson.getCity(),
            t.getExperience(),
            ticketJson.getRemote(),
            ticketJson.getJobType(),
            t.getField(),
            ticketJson.getDegree()
        );

        candidate.setTicket(newTicket);
        candidateRepository.save(candidate);
        
        return "Ticket updated successfully";
    }

    public String updateCandidateExp(Long candidateId, TicketJson ticketJson) {
        Candidate candidate = getCandidateDetails(candidateId);
        if (candidate == null) {
            return "Candidate not found";
        }
        Ticket t = candidate.getTicket();

        Ticket newTicket = new Ticket(
                t.getCity(),
                ticketJson.getExperience(),
                t.getRemote(),
                t.getJobType(),
                ticketJson.getField(),
                t.getDegree()
        );

        candidate.setTicket(newTicket);
        candidateRepository.save(candidate);

        return "Ticket updated successfully";
    }

    public void analyzeCV(String cv,Long candidateId) {
        String response = geminiService.analyzeCV(cv);
        String[] responseArray = response.split(",");
        TicketJson ticket = new TicketJson();
        ticket.setField(responseArray[0].trim());
        ticket.setExperience(responseArray[1].trim());
        for(int i = 2; i < responseArray.length; i+=2) {
            ticket.setField(ticket.getField()+","+responseArray[i].trim());
            ticket.setExperience(ticket.getExperience()+","+responseArray[i+1].trim());
        }
        updateCandidateExp(candidateId, ticket);
        
    }

    public ArrayList<JobOffer> getJobOffersById(Long candidateId) {
        return jobOfferService.getJobOffersById(candidateId);
    }

    public String updateJobOfferStatus(Long jobOfferId, String status) {
        return jobOfferService.updateJobOfferStatus(jobOfferId, status);
    }

    public ArrayList<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    public String applyForJob(JobApplicationJson jobApplicationJson) {
        return jobApplicationService.addJobApplication(jobApplicationJson);
    }


    public ArrayList<Candidate> getCandidatesByJobTicket(Ticket jobTicket) {
        ArrayList<Candidate> matchingCandidates = new ArrayList<>();
        if (jobTicket == null) {
            return matchingCandidates;
        }

        ArrayList<Candidate> allCandidates = getAll();
        for (Candidate candidate : allCandidates) {
            Ticket candidateTicket = candidate.getTicket();
            if (candidateTicket != null && candidateTicket.equals(jobTicket)) {
                matchingCandidates.add(candidate);
            }
        }

        return matchingCandidates;
    }



    public String updateCandidatePersonalInfo(Long candidateId, CandidateJson candidateJson) {
        Candidate candidate = getCandidateDetails(candidateId);
        if (candidate == null) {
            return "Candidate not found";
        }

        // Update personal information
        candidate.setFirstName(candidateJson.getFirstName());
        candidate.setLastName(candidateJson.getLastName());
        candidate.setPhoneNumber(candidateJson.getPhoneNumber());
        candidate.setEmail(candidateJson.getEmail());
        
        // Update social media URLs (allow null or empty string to clear)
        candidate.setFacebookUrl(candidateJson.getFacebookUrl() != null && !candidateJson.getFacebookUrl().trim().isEmpty() 
            ? candidateJson.getFacebookUrl().trim() : null);
        candidate.setLinkedinUrl(candidateJson.getLinkedinUrl() != null && !candidateJson.getLinkedinUrl().trim().isEmpty() 
            ? candidateJson.getLinkedinUrl().trim() : null);

        candidateRepository.save(candidate);

        return "Personal information updated successfully";
    }

    public String uploadCV(Long candidateId, MultipartFile file) {
        Candidate candidate = getCandidateDetails(candidateId);
        if (candidate == null) {
            return "Candidate not found";
        }

        try {
            // Delete old CV if exists
            if (candidate.getCv() != null && !candidate.getCv().isEmpty()) {
                fileStorageService.deleteFile(candidate.getCv());
            }

            // Store new CV
            String filename = fileStorageService.storeFile(file, candidateId);
            candidate.setCv(filename);
            candidateRepository.save(candidate);
            String cvToString = "";
            try {
                byte[] fileBytes = file.getBytes();
                String contentType = file.getContentType();
                if (contentType != null && contentType.equalsIgnoreCase("application/pdf")) {
                    // אם זה PDF
                    try (PDDocument document = Loader.loadPDF(fileBytes)) {
                        PDFTextStripper stripper = new PDFTextStripper();
                        cvToString = stripper.getText(document);
                    }
                } else if (contentType != null &&
                            (contentType.equalsIgnoreCase("application/msword") ||
                             contentType.equalsIgnoreCase("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
                             file.getOriginalFilename().toLowerCase().endsWith(".doc") ||
                             file.getOriginalFilename().toLowerCase().endsWith(".docx"))) {
                    // אם זה DOC או DOCX
                    if (file.getOriginalFilename().toLowerCase().endsWith(".docx") ||
                        contentType.equalsIgnoreCase("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
                        try (XWPFDocument docx = new XWPFDocument(new ByteArrayInputStream(fileBytes))) {
                            XWPFWordExtractor extractor = new XWPFWordExtractor(docx);
                            cvToString = extractor.getText();
                        }
                    } else {
                        try (HWPFDocument doc = new HWPFDocument(new ByteArrayInputStream(fileBytes))) {
                            WordExtractor extractor = new WordExtractor(doc);
                            cvToString = extractor.getText();
                        }
                    }
                } else {
                    // ברירת מחדל: קובץ טקסט או לא ידוע
                    cvToString = new String(fileBytes, StandardCharsets.UTF_8);
                }
            } catch (Exception ex) {
                cvToString = "";
            }
            analyzeCV(cvToString, candidateId);
            return "CV uploaded successfully";
        } catch (Exception e) {
            return "Error uploading CV: " + e.getMessage();
        }
    }

    public Resource downloadCV(Long candidateId) {
        Candidate candidate = getCandidateDetails(candidateId);
        if (candidate == null) {
            throw new RuntimeException("Candidate not found");
        }

        if (candidate.getCv() == null || candidate.getCv().isEmpty()) {
            throw new RuntimeException("No CV found for this candidate");
        }

        return fileStorageService.loadFileAsResource(candidate.getCv());
    }

    public String deleteCV(Long candidateId) {
        Candidate candidate = getCandidateDetails(candidateId);
        if (candidate == null) {
            return "Candidate not found";
        }

        if (candidate.getCv() == null || candidate.getCv().isEmpty()) {
            return "No CV found for this candidate";
        }

        try {
            boolean deleted = fileStorageService.deleteFile(candidate.getCv());
            if (deleted) {
                candidate.setCv(null);
                candidateRepository.save(candidate);
                return "CV deleted successfully";
            } else {
                return "Failed to delete CV file";
            }
        } catch (Exception e) {
            return "Error deleting CV: " + e.getMessage();
        }
    }

    public boolean hasCV(Long candidateId) {
        Candidate candidate = getCandidateDetails(candidateId);
        if (candidate == null) {
            return false;
        }

        return candidate.getCv() != null && !candidate.getCv().isEmpty() && 
               fileStorageService.fileExists(candidate.getCv());
    }

    public ResponseEntity<Resource> downloadCVWithHeaders(Long candidateId) {
        try {
            Resource resource = downloadCV(candidateId);
            
            String filename = resource.getFilename();
            MediaType contentType = MediaType.APPLICATION_PDF;
            String downloadFilename = "cv.pdf";
            
            if (filename != null && (filename.endsWith(".doc") || filename.endsWith(".docx"))) {
                contentType = filename.endsWith(".docx") ? 
                    MediaType.valueOf("application/vnd.openxmlformats-officedocument.wordprocessingml.document") :
                    MediaType.valueOf("application/msword");
                downloadFilename = "cv" + filename.substring(filename.lastIndexOf("."));
            }
            
            return ResponseEntity.ok()
                    .contentType(contentType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + downloadFilename + "\"")
                    .body(resource);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    public ResponseEntity<Resource> viewCVWithHeaders(Long candidateId) {
        try {
            Resource resource = downloadCV(candidateId);
            
            String filename = resource.getFilename();
            MediaType contentType = MediaType.APPLICATION_PDF;
            String viewFilename = "cv.pdf";
            
            if (filename != null && (filename.endsWith(".doc") || filename.endsWith(".docx"))) {
                contentType = filename.endsWith(".docx") ? 
                    MediaType.valueOf("application/vnd.openxmlformats-officedocument.wordprocessingml.document") :
                    MediaType.valueOf("application/msword");
                viewFilename = "cv" + filename.substring(filename.lastIndexOf("."));
            }
            
            return ResponseEntity.ok()
                    .contentType(contentType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + viewFilename + "\"")
                    .body(resource);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    public String withdrawApplication(Long applicationId) {
        try {
            if (applicationId == null) {
                return "ERROR";
            }
            
            // Check if application exists
            ArrayList<JobApplication> allApplications = jobApplicationService.getAll();
            boolean applicationExists = allApplications.stream()
                .anyMatch(app -> app.getJobApplicationId().equals(applicationId));
            
            if (!applicationExists) {
                return "ERROR";
            }
            
            // Delete the application
            jobApplicationService.deleteJobApplication(applicationId);
            return "OK";
        } catch (Exception e) {
            return "ERROR";
        }
    }

    public String addGitHubProject(Long candidateId, String projectName, String githubLink) {
        Candidate candidate = getCandidateDetails(candidateId);
        if (candidate == null) {
            return "Candidate not found";
        }

        candidate.addProject(projectName, githubLink);
        candidateRepository.save(candidate);
        return "Project added successfully";
    }

    public String addProject(Long candidateId, String projectName, String githubLink, String resources) {
        Candidate candidate = getCandidateDetails(candidateId);
        if (candidate == null) {
            return "Candidate not found";
        }

        // Convert String resources to ArrayList<String>
        ArrayList<String> langList = new ArrayList<>();
        if (resources != null && !resources.trim().isEmpty()) {
            String[] languages = resources.split(",");
            for (String lang : languages) {
                langList.add(lang.trim());
            }
        }
        
        candidate.addProject(projectName, githubLink, langList);
        candidateRepository.save(candidate);
        return "Project added successfully";
    }

    public String removeProjectFromCandidate(Long candidateId, String projectName) {
        Candidate candidate = getCandidateDetails(candidateId);
        if (candidate == null) {
            return "Candidate not found";
        }

        boolean removed = candidate.removeProject(projectName);
        if (removed) {
            candidateRepository.save(candidate);
            return "Project removed successfully";
        } else {
            return "Project not found";
        }
    }

    public String updateProject(Long candidateId, String projectName, String newProjectName, String githubLink, String resources) {
        Candidate candidate = getCandidateDetails(candidateId);
        if (candidate == null) {
            return "Candidate not found";
        }

        boolean updated = candidate.updateProject(projectName, newProjectName, githubLink, resources);
        if (updated) {
            candidateRepository.save(candidate);
            return "Project updated successfully";
        } else {
            return "Project not found";
        }
    }

    public Project getProject(Long candidateId, String projectName) {
        Candidate candidate = getCandidateDetails(candidateId);
        if (candidate == null) {
            return null;
        }

        return candidate.getProject(projectName);
    }

    public String uploadProfilePicture(Long candidateId, MultipartFile file) {
        Candidate candidate = getCandidateDetails(candidateId);
        if (candidate == null) {
            return "Candidate not found";
        }

        try {
            // Delete old profile picture if exists
            if (candidate.getProfilePicture() != null && !candidate.getProfilePicture().isEmpty()) {
                fileStorageService.deleteFile(candidate.getProfilePicture());
            }

            // Store new profile picture
            String filename = fileStorageService.storeProfilePicture(file, candidateId);
            candidate.setProfilePicture(filename);
            candidateRepository.save(candidate);

            return "Profile picture uploaded successfully";
        } catch (Exception e) {
            return "Error uploading profile picture: " + e.getMessage();
        }
    }

    public Resource downloadProfilePicture(Long candidateId) {
        Candidate candidate = getCandidateDetails(candidateId);
        if (candidate == null) {
            throw new RuntimeException("Candidate not found");
        }

        if (candidate.getProfilePicture() == null || candidate.getProfilePicture().isEmpty()) {
            throw new RuntimeException("No profile picture found for this candidate");
        }

        return fileStorageService.loadFileAsResource(candidate.getProfilePicture());
    }

    public ResponseEntity<Resource> viewProfilePictureWithHeaders(Long candidateId) {
        try {
            Resource resource = downloadProfilePicture(candidateId);
            
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

    public String deleteProfilePicture(Long candidateId) {
        Candidate candidate = getCandidateDetails(candidateId);
        if (candidate == null) {
            return "Candidate not found";
        }

        if (candidate.getProfilePicture() == null || candidate.getProfilePicture().isEmpty()) {
            return "No profile picture found for this candidate";
        }

        try {
            boolean deleted = fileStorageService.deleteFile(candidate.getProfilePicture());
            if (deleted) {
                candidate.setProfilePicture(null);
                candidateRepository.save(candidate);
                return "Profile picture deleted successfully";
            } else {
                return "Failed to delete profile picture file";
            }
        } catch (Exception e) {
            return "Error deleting profile picture: " + e.getMessage();
        }
    }

    public boolean hasProfilePicture(Long candidateId) {
        Candidate candidate = getCandidateDetails(candidateId);
        if (candidate == null) {
            return false;
        }

        return candidate.getProfilePicture() != null && !candidate.getProfilePicture().isEmpty() && 
               fileStorageService.fileExists(candidate.getProfilePicture());
    }
}


