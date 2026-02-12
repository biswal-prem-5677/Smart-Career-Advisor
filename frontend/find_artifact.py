import os
import re

def search_files(directory):
    with open("found_artifacts.txt", "w", encoding='utf-8') as outfile:
        for root, dirs, files in os.walk(directory):
            for file in files:
                if file.endswith(".jsx"):
                    path = os.path.join(root, file)
                    with open(path, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                        for i, line in enumerate(lines):
                            stripped = line.strip()
                            if ')}' in stripped:
                                # Ignore heavily nested closures at end of line if they look correct
                                # But let's log everything that is suspicious.
                                # Suspicious: contains text characters before )} or after )}
                                # Or is just )} but not at end of block.
                                
                                # Ignore lines that are JUST closing brackets/braces
                                if re.match(r'^[\) \t]*\}\)*[\;]*$', stripped):
                                    continue

                                outfile.write(f"{path}:{i+1}: {stripped}\n")

search_files(r"c:\next mind\Smart-Career-Advisor\frontend\src")
