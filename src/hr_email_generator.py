import json
import os
from typing import Dict, List, Optional

def load_hr_data() -> List[Dict]:
    """Load HR data from JSON file"""
    try:
        with open(os.path.join(os.path.dirname(__file__), 'hr_data.json'), 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading HR data: {e}")
        return []

def find_company_hr(company_name: str) -> Optional[Dict]:
    """Find HR data by company name (case-insensitive)"""
    hr_data = load_hr_data()
    company_name = company_name.lower().strip()
    
    for hr in hr_data:
        if hr['company'].lower() == company_name:
            return hr
    
    return None

def generate_hr_email(company_name: str, user_name: str, user_skills: List[str], 
                   user_projects: List[str], target_role: str, resume_text: str) -> Dict:
    """Generate personalized HR email"""
    
    hr_info = find_company_hr(company_name)
    
    if not hr_info:
        return {
            "success": False,
            "error": f"Company '{company_name}' not found in database"
        }
    
    # Extract relevant info from resume
    skills_text = ", ".join(user_skills[:5]) if user_skills else "Python, Machine Learning, React"
    projects_text = ". ".join(user_projects[:2]) if user_projects else "Multiple full-stack projects"
    
    # Generate personalized email based on company notes
    email_content = generate_personalized_content(hr_info, user_name, skills_text, 
                                           projects_text, target_role, resume_text)
    
    return {
        "success": True,
        "hr_info": hr_info,
        "email_content": email_content,
        "subject": f"Application for {target_role} position - {user_name}"
    }

def generate_personalized_content(hr_info: Dict, user_name: str, skills_text: str, 
                              projects_text: str, target_role: str, resume_text: str) -> str:
    """Generate personalized email content based on company preferences"""
    
    company_notes = hr_info.get('notes', '').lower()
    
    # Base email template
    email = f"""Hello {hr_info['hr_name']},

I'm {user_name}, a passionate fresher with strong skills in {skills_text} and hands-on experience through {projects_text}.

I'm excited to apply for the {target_role} role at {hr_info['company']}."""
    
    # Add personalized content based on company notes
    if 'github' in company_notes:
        email += f"""

My GitHub profile showcases my technical projects and coding journey. I believe my practical experience aligns well with {hr_info['company']}'s focus on real-world applications."""
    
    elif 'ats-friendly' in company_notes:
        email += f"""

My resume is formatted to be ATS-friendly with clear sections and keywords that highlight my technical expertise and project impact."""
    
    elif 'concise resumes' in company_notes:
        email += f"""

I've prepared a concise, impactful resume that clearly demonstrates my skills and achievements without unnecessary details."""
    
    elif 'internships + certifications' in company_notes:
        email += f"""

In addition to my academic projects, I've completed relevant certifications and internships that have strengthened my practical knowledge."""
    
    elif 'communication + problem-solving' in company_notes:
        email += f"""

I pride myself on strong communication skills and a systematic approach to problem-solving, which I've demonstrated through team projects and technical challenges."""
    
    elif 'cloud + ai projects' in company_notes:
        email += f"""

My experience includes cloud-based projects and AI/ML implementations that showcase my ability to work with cutting-edge technologies."""
    
    elif 'dsa + system design' in company_notes:
        email += f"""

I have a strong foundation in data structures and algorithms, along with experience designing scalable systems for various applications."""
    
    elif 'e-commerce' in company_notes:
        email += f"""

My projects include e-commerce applications that demonstrate my understanding of business-critical systems and user experience optimization."""
    
    elif 'fintech' in company_notes:
        email += f"""

I've worked on fintech-focused applications that emphasize security, performance, and user trust in financial systems."""
    
    elif 'analytics + consulting' in company_notes:
        email += f"""

My analytical skills and consulting approach enable me to translate complex business requirements into effective technical solutions."""
    
    # Add closing
    email += f"""

My resume is attached for your review. I'm confident that my skills and enthusiasm make me a strong candidate for this role.

Thank you for your time and consideration.

Regards,
{user_name}
LinkedIn: [Your LinkedIn Profile]
GitHub: [Your GitHub Profile]"""
    
    return email

def send_email_via_api(hr_email: str, subject: str, email_content: str) -> Dict:
    """Send email using external API (placeholder for actual email service)"""
    # This would integrate with email service like SendGrid, AWS SES, etc.
    # For demo purposes, we'll return success
    return {
        "success": True,
        "message": "Email sent successfully",
        "to": hr_email,
        "subject": subject
    }
