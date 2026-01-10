import random
from ner_skill_extractor import extract_skills_ner

def generate_questions(jd_text):
    """
    Analyzes JD text to identify key skills and generates 
    tailored behavioral/technical questions.
    """
    try:
        # Extract skills using our existing NER or basic extraction
        skills = extract_skills_ner(jd_text)
        
        # Fallback if no skills found
        if not skills:
            return [
                "Describe a challenging project you worked on and how you overcame obstacles.",
                "What specific qualities make you a great fit for this role?",
                "Tell us about a time you had to learn a new technology quickly."
            ]
            
        # Select up to 3 random skills to ask about
        selected_skills = random.sample(skills, min(len(skills), 3))
        
        questions = []
        templates = [
            "Can you describe a project where you utilized **{skill}** to solve a complex problem?",
            "How would you rate your proficiency in **{skill}** and could you give an example of its application?",
            "Tell us about a time you faced a challenge specifically related to **{skill}**.",
            "In your opinion, what is the most critical aspect of working with **{skill}** in a production environment?"
        ]
        
        for skill in selected_skills:
            template = random.choice(templates)
            questions.append(template.format(skill=skill))
            
        # Add a generic cultural fit question
        questions.append("Based on the job description, which of your personal attributes aligns best with our company culture?")
        
        return questions
    except Exception as e:
        print(f"Error generating questions: {e}")
        return ["Describe your relevant experience for this role."]

def generate_resume_html(data):
    """
    Generates a premium, professional HTML resume based on user input.
    """
    
    # Destructure data
    info = data.get('personal_info', {})
    summary = data.get('summary', '')
    experiences = data.get('experience', [])
    education = data.get('education', [])
    skills = data.get('skills', [])
    
    # Premium Template
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
        <style>
            :root {{
                --primary: #2563eb;
                --text-dark: #1e293b;
                --text-light: #64748b;
                --bg-sidebar: #f8fafc;
            }}
            body {{
                font-family: 'Inter', sans-serif;
                color: var(--text-dark);
                line-height: 1.6;
                max-width: 900px;
                margin: 0 auto;
                background: white;
                box-sizing: border-box;
            }}
            .container {{
                display: flex;
                flex-direction: row;
                min-height: 100vh;
            }}
            
            /* Sidebar (Left) */
            .sidebar {{
                width: 32%;
                background: var(--bg-sidebar);
                padding: 40px 30px;
                border-right: 1px solid #e2e8f0;
            }}
            
            /* Main Content (Right) */
            .main {{
                width: 68%;
                padding: 40px 40px;
            }}

            /* Typography */
            h1 {{
                font-size: 32px;
                font-weight: 800;
                line-height: 1.2;
                margin: 0 0 5px 0;
                color: #0f172a;
                text-transform: uppercase;
                letter-spacing: -0.5px;
            }}
            .role-title {{
                font-size: 16px;
                color: var(--primary);
                font-weight: 600;
                margin-bottom: 30px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }}
            
            h2 {{
                font-size: 14px;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 1.2px;
                color: #94a3b8;
                margin: 0 0 15px 0;
                border-bottom: 2px solid #e2e8f0;
                padding-bottom: 8px;
            }}
            
            h3 {{
                font-size: 16px;
                font-weight: 700;
                margin: 0 0 2px 0;
                color: #334155;
            }}
            
            p {{
                font-size: 14px;
                color: #475569;
                margin-bottom: 10px;
            }}

            /* Contact Info */
            .contact-info {{
                margin-bottom: 40px;
            }}
            .contact-item {{
                font-size: 13px;
                color: #475569;
                margin-bottom: 8px;
                display: block;
                word-wrap: break-word;
            }}
            
            /* Skills Tags */
            .skills-wrap {{
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }}
            .skill-tag {{
                background: white;
                border: 1px solid #cbd5e1;
                padding: 4px 10px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                color: #334155;
            }}

            /* Experience Items */
            .exp-item {{
                margin-bottom: 25px;
            }}
            .exp-header {{
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                margin-bottom: 5px;
            }}
            .company-name {{
                font-size: 14px;
                font-weight: 500;
                color: var(--primary);
            }}
            .date-range {{
                font-size: 12px;
                font-weight: 600;
                color: #94a3b8;
            }}
            .exp-desc {{
                 font-size: 14px;
                 color: #475569;
                 white-space: pre-line;
            }}

            /* Education */
            .edu-item {{
                margin-bottom: 15px;
            }}
            
            /* Utilities */
            .mt-4 {{ margin-top: 2rem; }}
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Left Sidebar -->
            <div class="sidebar">
                <div class="contact-info">
                    <h2>Contact</h2>
                    <span class="contact-item">{info.get('email', '')}</span>
                    <span class="contact-item">{info.get('phone', '')}</span>
                    <span class="contact-item">{info.get('location', '')}</span>
                    {f'<span class="contact-item">{info.get("linkedin", "")}</span>' if info.get('linkedin') else ''}
                </div>

                <div class="skills-section">
                    <h2>Skills</h2>
                    <div class="skills-wrap">
                        {''.join([f'<span class="skill-tag">{skill}</span>' for skill in skills])}
                    </div>
                </div>

                <div class="education-section mt-4">
                    <h2>Education</h2>
                    {''.join([f'''
                    <div class="edu-item">
                        <h3>{edu.get('degree', '')}</h3>
                        <div class="company-name">{edu.get('institution', '')}</div>
                        <div class="date-range">{edu.get('year', '')}</div>
                    </div>
                    ''' for edu in education])}
                </div>
            </div>

            <!-- Main Content -->
            <div class="main">
                <div class="header">
                    <h1>{info.get('name', 'Your Name')}</h1>
                    <div class="role-title">Target Role: {experiences[0].get('role', 'Professional') if experiences else 'Professional'}</div>
                </div>

                <div class="section">
                    <h2>Professional Profile</h2>
                    <p style="font-size: 15px; color: #334155; margin-bottom: 30px;">
                        {summary}
                    </p>
                </div>

                <div class="section">
                    <h2>Work Experience</h2>
                    {''.join([f'''
                    <div class="exp-item">
                        <div class="exp-header">
                            <h3>{exp.get('role', '')}</h3>
                            <span class="date-range">{exp.get('duration', '')}</span>
                        </div>
                        <div class="company-name" style="margin-bottom: 8px;">{exp.get('company', '')}</div>
                        <p class="exp-desc">{exp.get('description', '')}</p>
                    </div>
                    ''' for exp in experiences])}
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    return html
