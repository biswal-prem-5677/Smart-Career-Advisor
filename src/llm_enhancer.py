def enhance_resume_section(resume_text, jd_text, missing_skills):
    """
    Generates suggestions for resume enhancement based on missing skills using templates.
    Fast, logic-based, no AI dependencies.
    """
    
    suggestions = []
    
    suggestions.append("### 🎯 Strategic Improvements")
    suggestions.append("Based on the job description, here are targeted actions to improve your resume:")
    
    if missing_skills:
        suggestions.append("\n#### 1. Skill Integration")
        suggestions.append(f"Your resume appears to miss: **{', '.join(missing_skills)}**.")
        suggestions.append("- **Action**: Add a 'Technical Skills' or 'Competencies' section if you possess these skills.")
        suggestions.append("- **Context**: For each skill, try to include a bullet point in your Experience section demonstrating how you applied it.")
        suggestions.append(f"  *Example*: 'Leveraged **{missing_skills[0]}** to optimize workflow efficiency by 20%.'")
    else:
         suggestions.append("\n#### 1. Skill Validation")
         suggestions.append("You have a strong skill match! Focus on quantifying your achievements.")

    suggestions.append("\n#### 2. Section Optimization")
    suggestions.append("- **Summary**: Ensure your professional summary includes the exact job title from the JD.")
    suggestions.append("- **Formatting**: Use clean, consistent fonts (like Arial or Calibri) and ensure dates are right-aligned.")
    
    return "\n".join(suggestions)
