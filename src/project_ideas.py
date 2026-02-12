from llm_utils import get_ai_response

def generate_project_ideas(resume_text, resume_skills):
    """
    Generates AI-powered project ideas based on resume context using OpenAI.
    """
    
    prompt = f"""
    You are a Senior Tech Career Mentor.
    
    Candidate Skills: {', '.join(resume_skills)}
    Resume Excerpt: "{resume_text[:1000]}..."
    
    TASK: Suggest 3 impressive "Portfolio Projects" that would make this candidate stand out to recruiters.
    - Projects must use the candidate's existing skills but push them slightly (e.g., add Cloud or CI/CD).
    - Avoid generic ideas like "To-Do List". Suggest "Real World" use cases.
    - Format in Markdown.
    
    Output Format:
    ### 💡 Recommended Portfolio Projects
    
    **1. [Project Name]**
    *Tech Stack*: [List technologies]
    *Description*: [Brief pitch of what it does and why it's impressive]
    
    **2. [Project Name]**
    ...
    """
    
    try:
        return get_ai_response(prompt)
    except Exception:
        return fallback_project_ideas(resume_skills)

def fallback_project_ideas(resume_skills):
    ideas = []
    ideas.append("### 💡 Recommended Portfolio Projects (Offline Mode)")
    ideas.append("Building these projects will demonstrate your expertise:\n")
    
    # Simple rule-based logic
    if 'python' in [s.lower() for s in resume_skills]:
        ideas.append("- **Data Analysis Dashboard**: Build a Streamlit app that visualizes a public dataset.")
    if 'react' in [s.lower() for s in resume_skills]:
        ideas.append("- **E-commerce UI**: Create a responsive shopping cart interface.")
        
    if not ideas:
        ideas.append("- **Portfolio Website**: Design a personal site to showcase your resume.")
        
    return "\n".join(ideas)
