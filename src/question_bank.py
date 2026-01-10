import random

def get_aptitude_question():
    questions = [
        {"q": "What is the next number in the series: 2, 6, 12, 20, 30, ...?", "options": ["40", "42", "44", "48"], "correct": "42"},
        {"q": "If A is the brother of B; B is the sister of C; and C is the father of D, how is D related to A?", "options": ["Product", "Nephew", "Brother", "Cannot be determined"], "correct": "Nephew/Niece"},
        {"q": "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?", "options": ["120 m", "150 m", "180 m", "150 m"], "correct": "150 m"},
        {"q": "Look at this series: 7, 10, 8, 11, 9, 12, ... What number should come next?", "options": ["7", "10", "12", "13"], "correct": "10"},
        {"q": "Which word does NOT belong with the others?", "options": ["Parsley", "Basil", "Dill", "Mayonnaise"], "correct": "Mayonnaise"}
    ]
    return random.choice(questions)

def get_technical_question():
    questions = [
        {"q": "What does HTML stand for?", "options": ["Hyper Text Markup Language", "High Tech Markup Language", "Hyper Tabular Markup Language", "None of these"], "correct": "Hyper Text Markup Language"},
        {"q": "Which language is used for styling web pages?", "options": ["HTML", "JQuery", "CSS", "XML"], "correct": "CSS"},
        {"q": "What is React.js?", "options": ["Server-side framework", "User Interface library", "A Database", "An OS"], "correct": "User Interface library"},
        {"q": "Which symbol is used for comments in Python?", "options": ["//", "/* */", "#", "--"], "correct": "#"},
        {"q": "What does SQL stand for?", "options": ["Structured Question Language", "Structured Query Language", "Strong Query Language", "None of these"], "correct": "Structured Query Language"}
    ]
    return random.choice(questions)

def get_coding_problem():
    problems = [
        "Write a function `twoSum(nums, target)` that returns indices of the two numbers such that they add up to target.",
        "Write a function to check if a given string is a Palindrome.",
        "Implement a function to reverse a linked list.",
        "Write a program to find the factorial of a number using recursion.",
        "Given an array of integers, find the maximum subarray sum (Kadane's Algorithm)."
    ]
    return random.choice(problems)

def get_interview_question():
    questions = [
        "Tell me about yourself and your background.",
        "Why do you want to work for this company?",
        "Describe a challenging project you worked on and how you handled it.",
        "Where do you see yourself in 5 years?",
        "What are your greatest strengths and weaknesses?"
    ]
    return random.choice(questions)
