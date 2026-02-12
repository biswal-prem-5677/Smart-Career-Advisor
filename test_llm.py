import sys
import os

# Add src to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'src')))

try:
    from llm_utils import generate_company_prep_plan
    print("Testing generate_company_prep_plan...")
    plan = generate_company_prep_plan("Product", "Google", "4 Weeks")
    print(f"Plan generated: {plan}")
    
    if not plan or plan == {}:
        print("❌ Plan is empty! Model might be invalid.")
    else:
        print("✅ Plan generated successfully!")
        if 'insights' in plan:
            print("Insights present.")
        else:
            print("Insights MISSING.")
            
except Exception as e:
    print(f"Error: {e}")
    with open("test_log.txt", "w") as f:
        f.write(str(e))
