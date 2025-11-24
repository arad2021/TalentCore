package com.Temp.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.Temp.Model.*;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class GeminiService {

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateResponse(String prompt) {
        if (prompt == null || prompt.trim().isEmpty()) {
            return "Empty prompt";
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> contentPart = new HashMap<>();
            contentPart.put("text", prompt);

            Map<String, Object> content = new HashMap<>();
            content.put("parts", new Object[]{contentPart});

            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("temperature", 0.1);
            generationConfig.put("topP", 0.8);

            Map<String, Object> body = new HashMap<>();
            body.put("contents", new Object[]{content});
            body.put("generationConfig", generationConfig);

            String urlWithKey = apiUrl + (apiUrl.contains("?") ? "&" : "?") + "key=" + apiKey;

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(urlWithKey, request, String.class);
            return response.getBody();
        } catch (Exception e) {
            return "Gemini API error: " + e.getMessage();
        }
    }

    public ArrayList<Object[]> getCandidatesWithScore(ArrayList<Candidate> candidates, Job job) {
        ArrayList<Object[]> result = new ArrayList<>();
        if (candidates == null || candidates.isEmpty()) {
            return result;
        }
        for (Candidate candidate : candidates) {
            try {
                String score = getCandidateScore(candidate, job);
                result.add(new Object[]{candidate, score});
            } catch (Exception e) {
                e.printStackTrace();
                // Add candidate with error message if scoring fails
                String errorJson = "{\"compatibility_score\": 0, \"matched_skills\": [], \"missing_skills\": [], \"summary\": \"Error analyzing candidate: " + e.getMessage() + "\"}";
                result.add(new Object[]{candidate, errorJson});
            }
        }
        
        return result;
    }

    private String getCandidateScore(Candidate candidate, Job job) {
        ArrayList<Project> arrayList = new ArrayList<>(candidate.getProjects());
        ArrayList<Project> filteredProjects = new ArrayList<>();
        String technicalSkills = job.getTechnicalSkills();
        if (technicalSkills == null || technicalSkills.trim().isEmpty()) {
            return "{\"compatibility_score\": 0, \"matched_skills\": [], \"missing_skills\": [], \"summary\": \"Job has no technical skills specified\"}";
        }
        String[] jobSkills = technicalSkills.split(",");
        for (Project project : arrayList) {
            String resources = project.getResources();
            if (resources != null && !resources.trim().isEmpty()) {
                if (getFilteredProjects(resources.split(","), jobSkills)) {
                    filteredProjects.add(project);
                }
            }
        }
        if (filteredProjects.isEmpty()) {
            return "{\"compatibility_score\": 0, \"matched_skills\": [], \"missing_skills\": [], \"summary\": \"no relevant projects to evaluate\"}";
        }

		String prompt = createPrompt(filteredProjects, technicalSkills);
		int maxRetries = 3;
		int retryCount = 0;
		String jsonOnly = null;
		String lastApiResponse = null;
		
		while (retryCount < maxRetries) {
			String apiResponse = generateResponse(prompt);
			lastApiResponse = apiResponse;
			jsonOnly = extractJsonFromGeminiResponse(apiResponse);
			
			// Check if jsonOnly or apiResponse contains error codes 503 or 429
			boolean hasError = (jsonOnly != null && (jsonOnly.contains("503") || jsonOnly.contains("429"))) ||
			                   (apiResponse != null && (apiResponse.contains("503") || apiResponse.contains("429")));
			
			if (hasError) {
				retryCount++;
				if (retryCount < maxRetries) {
					try {
						// Wait before retry (exponential backoff: 1s, 2s, 4s)
						long delayMs = (long) Math.pow(2, retryCount - 1) * 1000;
						TimeUnit.MILLISECONDS.sleep(delayMs);
					} catch (InterruptedException e) {
						Thread.currentThread().interrupt();
						break;
					}
					continue; // Retry the API call
				}
			} else {
				// Success or different error - break the loop
				break;
			}
		}
		
		return jsonOnly != null ? jsonOnly : lastApiResponse;
    }


    private Boolean getFilteredProjects(String[] projectSkills, String[] jobSkills) {
        for (String projectSkill : projectSkills) {
            for (String jobSkill : jobSkills) {
                if (projectSkill.trim().equalsIgnoreCase(jobSkill.trim())) {
                    return true;
                }
            }
        }
        return false;
    }

    private String createPrompt(ArrayList<Project> filteredProjects, String TechnicalSkills) {
        String result = "";
        // Build a string describing the candidate's projects in the required format
        StringBuilder sb = new StringBuilder();
        String marna = "You are an expert AI system for analyzing technical compatibility between a candidate’s real project experience and a job’s required skills.\n";
        sb.append("ProjectList:\n[\n");
        for (int i = 0; i < filteredProjects.size(); i++) {
            Project project = filteredProjects.get(i);
            sb.append("  {\n");
            sb.append("    \"project_name\": \"").append(project.getProjectName() != null ? project.getProjectName() : "").append("\",\n");
            sb.append("    \"link\": \"").append(project.getGithubLink() != null ? project.getGithubLink() : "").append("\"\n");
            sb.append("  }");
            if (i < filteredProjects.size() - 1) {
                sb.append(",");
            }
            sb.append("\n");
        }
        sb.append("]\n\n");

        // Add the job requirements formatted as requested
        sb.append("Job Requirements:\n");
        sb.append("List of required or preferred technologies and skills.\n");
        sb.append("put here the technical skills from job\n");
        sb.append(TechnicalSkills != null ? TechnicalSkills : "");
        sb.append("\n");

        result = sb.toString();
        String task = """
###Task:
1. **Deep project analysis:**
   - Visit and read each GitHub link in `ProjectList`.
   - Extract technologies, frameworks, and programming languages actually used in the code (not just listed in README).
   - Identify level of expertise indicators (e.g., advanced design patterns, contribution depth, frequency of commits).

2. **Skill matching logic:**
   - Match the extracted technologies to the `JobRequirements` list.
   - Weight each match based on **depth** (how extensively used) and **relevance** (to the job’s context).
   - Detect missing or weakly represented skills.

3. **Score calculation:**
   - Produce a final `compatibility_score` between 0–100%.
   - 0% = No relevant overlap.
   - 100% = Perfect alignment in technologies and depth.

4. **Summary reasoning:**
   - Write a concise but insightful explanation (2–4 sentences) describing:
     - Which skills are strong.
     - Which are missing or underrepresented.
     - General assessment of candidate’s suitability for the job.
---
### OUTPUT FORMAT

Return a single JSON object:

{
  "compatibility_score": <number 0–100>,
  "matched_skills": [<list of skills found and confirmed>],
  "missing_skills": [<list of job skills not found or weak>],
  "summary": "<short and meaningful explanation of the score>"
}
---
### TONE AND QUALITY
The analysis must be:
- Fact-based (derived from repository content)
- Technically deep and realistic
- Concise, structured, and human-readable
- Output only the JSON (no additional text)

---
""";
        // Combine sb (project+job string) with the task (instructions), first sb then task:
        result = marna + sb.toString() + task;

        return result;
    }

	private String extractJsonFromGeminiResponse(String apiResponse) {
		if (apiResponse == null || apiResponse.isEmpty()) {
			return null;
		}
		try {
			ObjectMapper mapper = new ObjectMapper();
			JsonNode root = mapper.readTree(apiResponse);
			JsonNode candidates = root.path("candidates");
			if (candidates.isArray() && candidates.size() > 0) {
				JsonNode firstCandidate = candidates.get(0);
				JsonNode content = firstCandidate.path("content");
				// Gemini: content.parts[].text
				JsonNode parts = content.path("parts");
				if (parts.isArray() && parts.size() > 0) {
					for (JsonNode part : parts) {
						String text = part.path("text").asText(null);
						if (text != null && !text.isEmpty()) {
							String json = extractJsonFromText(text);
							if (json != null) return json;
						}
					}
				}
			}
			// Fallback: sometimes response text may be directly at top-level (rare)
			String asText = root.path("text").asText(null);
			if (asText != null) {
				String json = extractJsonFromText(asText);
				if (json != null) return json;
			}
		} catch (Exception ignore) {
			// If not a Gemini JSON envelope, try to extract JSON directly from raw string
			String json = extractJsonFromText(apiResponse);
			if (json != null) return json;
		}
		return null;
	}

	private String extractJsonFromText(String text) {
		if (text == null) return null;
		String trimmed = text.trim();
		// Prefer fenced code block ```json ... ``` if present
		Pattern fenced = Pattern.compile("```json\\s*([\\s\\S]*?)```", Pattern.CASE_INSENSITIVE);
		Matcher m = fenced.matcher(trimmed);
		if (m.find()) {
			String candidate = m.group(1).trim();
			String balanced = extractBalancedBraces(candidate);
			if (balanced != null) return balanced;
		}
		// Generic fenced block without json tag
		Pattern fencedAny = Pattern.compile("```\\s*([\\s\\S]*?)```", Pattern.CASE_INSENSITIVE);
		Matcher m2 = fencedAny.matcher(trimmed);
		if (m2.find()) {
			String candidate = m2.group(1).trim();
			String balanced = extractBalancedBraces(candidate);
			if (balanced != null) return balanced;
		}
		// No fences: try to find first balanced JSON object/array
		String balanced = extractBalancedBraces(trimmed);
		return balanced != null ? balanced : null;
	}

	private String extractBalancedBraces(String text) {
		int objStart = text.indexOf('{');
		int arrStart = text.indexOf('[');
		int start = -1;
		char opener = 0;
		char closer = 0;
		if (objStart != -1 && (arrStart == -1 || objStart < arrStart)) {
			start = objStart;
			opener = '{';
			closer = '}';
		} else if (arrStart != -1) {
			start = arrStart;
			opener = '[';
			closer = ']';
		}
		if (start == -1) return null;
		int depth = 0;
		boolean inString = false;
		boolean escaped = false;
		for (int i = start; i < text.length(); i++) {
			char c = text.charAt(i);
			if (inString) {
				if (escaped) {
					escaped = false;
				} else if (c == '\\') {
					escaped = true;
				} else if (c == '"') {
					inString = false;
				}
				continue;
			}
			if (c == '"') {
				inString = true;
				continue;
			}
			if (c == opener) depth++;
			else if (c == closer) depth--;
			if (depth == 0) {
				return text.substring(start, i + 1).trim();
			}
		}
		return null;
	}

    public String analyzeCV(String cv) {
        String prompt = """
        You are an advanced resume analysis system.
Your goal is to extract only relevant professional fields and their estimated years of experience from the given resume.

Instructions:

Read the entire resume carefully and identify all professional areas related to the candidate’s work experience.

Select only the fields that are clearly supported by the candidate’s described experience, roles, or technical skills.

Estimate years of experience for each selected field using start and end dates or experience descriptions in the resume.

Output must follow this exact format (no spaces, extra text, or explanations):

field,years_of_experience,field,years_of_experience


✅ Example:

Software Development,3,Cloud Computing,2,DevOps,1

return only integers as the years_of_experience
Include only fields from the following approved list (case-sensitive):

Artificial Intelligence, Business Development, Cloud Computing, Consulting, Content Creation,
Customer Success, Cybersecurity, Data Science, Database Administration, DevOps,
Digital Marketing, Finance, Game Development, Graphic Design, Human Resources,
Machine Learning, Marketing, Mobile Development, Network Engineering, Operations,
Product Management, Project Management, Quality Assurance, Research & Development,
Sales, Software Development, System Administration, Technical Writing, UI/UX Design, Web Development

If no clear experience is found for a field, do not include it in the output.

Output only the final string — no labels, quotes, or explanations.

Input CV:
""" + cv;
        int maxRetries = 3;
        int retryCount = 0;
        String textOnly = null;
        String lastApiResponse = null;
        
        while (retryCount < maxRetries) {
            String apiResponse = generateResponse(prompt);
            lastApiResponse = apiResponse;
            textOnly = extractTextFromGeminiResponse(apiResponse);
            
            // Check if textOnly or apiResponse contains error codes 503 or 429
            boolean hasError = (textOnly != null && (textOnly.contains("503") || textOnly.contains("429"))) ||
                               (apiResponse != null && (apiResponse.contains("503") || apiResponse.contains("429")));
            
            if (hasError) {
                retryCount++;
                if (retryCount < maxRetries) {
                    try {
                        // Wait before retry (exponential backoff: 1s, 2s, 4s)
                        long delayMs = (long) Math.pow(2, retryCount - 1) * 1000;
                        TimeUnit.MILLISECONDS.sleep(delayMs);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                    continue; // Retry the API call
                }
            } else {
                // Success or different error - break the loop
                break;
            }
        }
        
        return textOnly != null ? textOnly : lastApiResponse;
    }

    private String extractTextFromGeminiResponse(String apiResponse) {
        if (apiResponse == null || apiResponse.isEmpty()) {
            return null;
        }
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(apiResponse);
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode firstCandidate = candidates.get(0);
                JsonNode content = firstCandidate.path("content");
                JsonNode parts = content.path("parts");
                if (parts.isArray() && parts.size() > 0) {
                    JsonNode firstPart = parts.get(0);
                    String text = firstPart.path("text").asText(null);
                    if (text != null && !text.isEmpty()) {
                        return text.trim();
                    }
                }
            }
        } catch (Exception e) {
            // If parsing fails, return null to fallback to original response
        }
        return null;
    }

}





