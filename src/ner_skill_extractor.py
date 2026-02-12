import spacy
from spacy.matcher import PhraseMatcher
from skills import COMMON_SKILLS

# Simple cache for the NLP model
nlp_cache = None

def load_nlp():
    global nlp_cache
    if nlp_cache is not None:
        return nlp_cache
        
    try:
        # First attempt: try to load the model directly
        nlp_cache = spacy.load("en_core_web_sm")
        return nlp_cache
    except OSError as e:
        print("⚠️ spaCy model 'en_core_web_sm' not found. Falling back to basic extraction.")
        return None  # Explicitly return None if model is not available

def extract_skills_ner(text):
    try:
        nlp = load_nlp()
        if nlp is None:
            raise RuntimeError("spaCy NER model not available; use basic extraction instead.")
        
        doc = nlp(text)
        matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
        
        # Create patterns correctly - flat list of Doc objects, not nested lists
        patterns = [nlp.make_doc(skill) for skill in COMMON_SKILLS]
        matcher.add("SKILLS", patterns)
        
        matches = matcher(doc)
        skills_found = list(set([doc[start:end].text for match_id, start, end in matches]))
        return skills_found
        
    except Exception as e:
        raise RuntimeError(f"spaCy NER extraction failed: {str(e)}")

def extract_name_ner(text):
    """Extracts the first PERSON entity found in the text (assumed to be the candidate's name)."""
    try:
        nlp = load_nlp()
        if nlp is None:
            return "Candidate"
        
        # Limit to the first 1000 chars as names appear at the top
        doc = nlp(text[:1000])
        for ent in doc.ents:
             if ent.label_ == "PERSON":
                 # Filter out single words if possible, or just take the first one
                 if len(ent.text.split()) >= 1: 
                     return ent.text.strip().title()
        return "Candidate"
    except Exception:
        return fallback_name_extraction(text)

def fallback_name_extraction(text):
    """Refined Regex/Heuristic extraction if NER fails."""
    try:
        import re
        lines = text.split('\n')
        # 1. Look for common headers
        for line in lines[:20]:
            if "name" in line.lower() and ":" in line:
                parts = line.split(":")
                if len(parts) > 1:
                    candidate = parts[1].strip()
                    if 3 < len(candidate) < 50:
                        return candidate.title()
                        
        # 2. Look for the first capitalized words at the start (common in resumes)
        # Skip lines that are likely contact info or headers
        for line in lines[:10]:
            line = line.strip()
            if not line: continue
            # Check if it looks like a name (2-3 words, titled)
            if re.match(r"^[A-Z][a-z]+(\s[A-Z][a-z]+){1,2}$", line):
                return line
                
        return "Candidate"
    except:
        return "Candidate"
