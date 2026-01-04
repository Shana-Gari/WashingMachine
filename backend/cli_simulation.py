import sys
import os

# Ensure we can import from the current directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from fuzzy_logic import calculate_fuzzy_values
except ImportError as e:
    print("Error importing fuzzy_logic. Make sure requirements are installed.")
    print(f"Details: {e}")
    sys.exit(1)

def get_float_input(prompt, min_val=None, max_val=None):
    while True:
        try:
            val = float(input(prompt))
            if min_val is not None and val < min_val:
                print(f"Value must be at least {min_val}")
                continue
            if max_val is not None and val > max_val:
                print(f"Value must be at most {max_val}")
                continue
            return val
        except ValueError:
            print("Invalid input. Please enter a number.")

def main():
    print("==================================================")
    print("   Fuzzy Logic Washing Machine - CLI Simulator    ")
    print("==================================================")
    
    while True:
        print("\n--- New Wash Load ---")
        clothes = []
        
        while True:
            print(f"\nAdding Cloth #{len(clothes) + 1}")
            weight = get_float_input("  Weight (kg): ", 0.1, 10.0)
            dirt = get_float_input("  Dirt Level (1-10): ", 1, 10)
            delicate = get_float_input("  Delicateness (1-10, 1=Robust, 10=Delicate): ", 1, 10)
            
            clothes.append({'weight': weight, 'dirt': dirt, 'delicate': delicate})
            
            more = input("\nAdd another cloth? (y/n): ").lower()
            if more != 'y':
                break
        
        # Aggregation
        total_load = sum(c['weight'] for c in clothes)
        avg_dirt = sum(c['dirt'] for c in clothes) / len(clothes)
        max_delicate = max(c['delicate'] for c in clothes)
        
        print("\n[Aggregated Inputs]")
        print(f"Total Load: {total_load:.2f} kg")
        print(f"Avg Dirt Level: {avg_dirt:.2f}")
        print(f"Max Delicateness: {max_delicate:.1f}")
        
        print("\nCalculating Optimal Parameters...")
        result = calculate_fuzzy_values(total_load, avg_dirt, max_delicate)
        
        print("\n[Fuzzy Logic Results]")
        print(f"Wash Time:       {result['wash_time']:.1f} min")
        print(f"Water Level:     {result['water_level']:.1f} %")
        print(f"Spin Speed:      {result['spin_speed']:.0f} RPM")
        print(f"Detergent:       {result['detergent_amount']:.1f} ml")
        
        choice = input("\nRun another simulation? (y/n): ").lower()
        if choice != 'y':
            print("Exiting...")
            break

if __name__ == "__main__":
    main()
