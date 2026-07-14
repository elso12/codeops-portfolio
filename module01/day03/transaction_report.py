"""
Module 01 - Day 03: Transaction Log Reader
Author: Elsay
Description: Aggregates TeleBirr transaction logs and generates a summary report.
"""

import os

# Setup file paths
script_dir = os.path.dirname(__file__)
input_file = os.path.join(script_dir, "transactions.txt")
output_file = os.path.join(script_dir, "report.txt")

customer_totals = {}

# 1 & 4. Read file with graceful error handling
try:
    with open(input_file, "r") as f:
        for line in f:
            if "," in line:
                name, amount = line.strip().split(",")
                # 2. Build dictionary mapping customer to total spend
                customer_totals[name] = customer_totals.get(name, 0) + int(amount)
    
    # 3. Sort by total spent (highest first)
    sorted_totals = sorted(customer_totals.items(), key=lambda item: item[1], reverse=True)

    # Prepare report content
    report_lines = ["--- Customer Transaction Report ---"]
    for name, total in sorted_totals:
        report_lines.append(f"{name}: {total} ETB")
    
    # Print to console for immediate feedback
    for line in report_lines:
        print(line)

    # 5. Write the summary to report.txt
    with open(output_file, "w") as f:
        f.write("\n".join(report_lines))
    print(f"\nReport successfully generated: {output_file}")

except FileNotFoundError:
    print(f"Error: The input file '{input_file}' was not found.")