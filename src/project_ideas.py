def generate_project_ideas(resume_text, resume_skills):
    """
    Generates project ideas based on skills using pre-defined templates.
    Fast, logic-based, no AI dependencies.
    """
    
    ideas = []
    ideas.append("### 💡 Recommended Portfolio Projects")
    ideas.append("Building these projects will demonstrate your expertise in your key skills:\n")
    
    # Simple rule-based mapping
    skill_projects = {
        'python': [
            "**Data Analysis Dashboard**: Build a Streamlit app that visualizes a public dataset (e.g., Kaggle) using Pandas and Plotly.",
            "**Automation Script**: Write a script to automate a daily task (e.g., file organizer, email sender) and document it on GitHub."
        ],
        'react': [
            "**E-commerce UI**: Create a responsive shopping cart interface with state management (Redux/Context API).",
            "**Task Tracker**: Build a Trello-like Kanban board with drag-and-drop functionality."
        ],
        'sql': [
            "**Inventory Management System**: Design a normalized database schema and write complex queries for reporting.",
        ],
        'machine learning': [
            "**Predictive Model**: Train a model on the Titanic dataset to predict survival rates and deploy it via an API.",
        ],
        'javascript': [
            "**Weather App**: Fetch real-time data from a public API and display it dynamically.",
        ]
    }
    
    found_ideas = False
    for skill in resume_skills:
        lower_skill = skill.lower()
        if lower_skill in skill_projects:
            found_ideas = True
            ideas.append(f"#### Since you know {skill.capitalize()}:")
            for project in skill_projects[lower_skill]:
                ideas.append(f"- {project}")
            ideas.append("")
            
    if not found_ideas:
        ideas.append("#### General Full-Stack Project")
        ideas.append("- **Blog Platform**: Build a CRUD application with authentication and a database.")
        ideas.append("- **Portfolio Website**: Design a personal site to showcase your resume and projects.")

    return "\n".join(ideas)
