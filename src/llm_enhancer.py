from llm_utils import get_ai_response

def enhance_resume_section(resume_text, jd_text, missing_skills):
    """
    Generates AI-powered suggestions for resume enhancement using Google Gemini.
    """
    
    prompt = f"""
    You are an expert ATS-friendly Resume Writer.
    
    Candidate Resume Segment:
    "{resume_text[:2000]}..."
    
    Target Job Description:
    "{jd_text[:2000]}..."
    
    Missing Skills Identified: {', '.join(missing_skills)}
    
    TASK:
    1. Analyze the resume against the JD.
    2. Suggest 3 specific, actionable bullet point rewrites that incorporate the missing skills naturally.
    3. Explain WHY these changes improve the resume (short reason).
    4. Keep the tone professional, action-oriented, and quantified (use numbers/metrics).
    
    Output Format (Markdown):
    ### 🚀 AI-Powered Enhancement Suggestions
    
    **1. Skill Integration**
    *Current Gap*: Missing {missing_skills[0] if missing_skills else "key keywords"}
    *Suggested Rewrite*: "[Rewrite a bullet point to include the skill]"
    
    **2. Impact Optimization**
    [Rewrite another section to be more results-driven]
    
    **3. Strategic Addition**
    [Suggest a new project or certification to bridge the gap]
    """
    
    try:
        response = get_ai_response(prompt)
        if "Error" in response:
            return fallback_enhancer(resume_text, jd_text, missing_skills)
        return response
    except Exception as e:
        return fallback_enhancer(resume_text, jd_text, missing_skills)

def fallback_enhancer(resume_text, jd_text, missing_skills):
    # Original logic as fallback
    suggestions = []
    suggestions.append("### ⚠️ AI Service Unavailable - Showing Static Tips")
    suggestions.append("Based on the job description, here are targeted actions to improve your resume:")
    
    if missing_skills:
        suggestions.append("\n#### 1. Skill Integration")
        suggestions.append(f"Your resume appears to miss: **{', '.join(missing_skills)}**.")
    
    suggestions.append("\n#### 2. Section Optimization")
    suggestions.append("- **Summary**: Ensure your professional summary includes the exact job title from the JD.")
    
    return "\n".join(suggestions)
