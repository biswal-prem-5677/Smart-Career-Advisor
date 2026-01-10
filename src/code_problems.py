import random

PROBLEMS = [
    {
        "id": "1",
        "title": "Two Sum",
        "difficulty": "Easy",
        "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
        "example_input": "nums = [2,7,11,15], target = 9",
        "example_output": "[0,1]",
        "starter_code": {
            "python": "def two_sum(nums, target):\n    # Write your code here\n    pass",
            "javascript": "function twoSum(nums, target) {\n    // Write your code here\n}"
        }
    },
    {
        "id": "2",
        "title": "Palindrome Number",
        "difficulty": "Easy",
        "description": "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.",
        "example_input": "x = 121",
        "example_output": "true",
        "starter_code": {
            "python": "def is_palindrome(x):\n    # Write your code here\n    pass",
            "javascript": "function isPalindrome(x) {\n    // Write your code here\n}"
        }
    },
    {
        "id": "3",
        "title": "Reverse Linked List",
        "difficulty": "Medium",
        "description": "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
        "example_input": "head = [1,2,3,4,5]",
        "example_output": "[5,4,3,2,1]",
        "starter_code": {
            "python": "def reverse_list(head):\n    # Write your code here\n    pass",
            "javascript": "function reverseList(head) {\n    // Write your code here\n}"
        }
    }
]

def get_problems():
    return PROBLEMS

def evaluate_code(code, language, problem_id):
    """
    Simulates code evaluation. 
    In a real app, this would use a sandbox execution environment (e.g. docker).
    Here we simulate passing/failing test cases.
    """
    import time
    time.sleep(1.5) # Simulate execution time
    
    # Deterministic simulation based on code length logic to make it feel responsive
    # Realistically, we just want to show the UI flows.
    
    score = random.randint(70, 100)
    passed_cases = random.randint(3, 5)
    total_cases = 5
    
    if len(code) < 20:
        return {
            "success": False,
            "score": 0,
            "results": [
                {"case": "Case 1", "status": "Failed", "output": "Syntax Error: Unexpected EOF"},
                {"case": "Case 2", "status": "Skipped", "output": "-"},
            ],
            "feedback": "It looks like you haven't written much code yet. Try implementing the solution!"
        }
        
    return {
        "success": True,
        "score": score,
        "results": [
            {"case": f"Case {i+1}", "status": "Passed" if i < passed_cases else "Failed", "output": "Output matches expected" if i < passed_cases else "Output mismatch"}
            for i in range(total_cases)
        ],
        "feedback": "Great attempt! Your logic seems sound for most edge cases." if score > 80 else "Good start, but check edge cases for negative numbers."
    }
