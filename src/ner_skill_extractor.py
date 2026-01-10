import streamlit as st
import spacy
from spacy.matcher import PhraseMatcher
from skills import COMMON_SKILLS

@st.cache_resource
def load_nlp():
    try:
        # First attempt: try to load the model directly
        return spacy.load("en_core_web_sm")
    except OSError as e:
        st.warning("⚠️ spaCy model not found. Falling back to basic extraction.")
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
        return "Candidate"
