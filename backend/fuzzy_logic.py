import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl

def get_washing_system():
    # New Antecedents/Consequents
    # Load: 0 to 12 kg
    load = ctrl.Antecedent(np.arange(0, 13, 1), 'load')
    # Dirt: 0 to 10 scale
    dirt = ctrl.Antecedent(np.arange(0, 11, 1), 'dirt')
    # Delicateness: 0 to 10 scale (0=Robust, 10=Very Delicate)
    sensitivity = ctrl.Antecedent(np.arange(0, 11, 1), 'sensitivity')

    # Outputs
    wash_time = ctrl.Consequent(np.arange(0, 61, 1), 'wash_time') # Minutes
    water_level = ctrl.Consequent(np.arange(0, 101, 1), 'water_level') # Percent
    spin_speed = ctrl.Consequent(np.arange(0, 1401, 10), 'spin_speed') # RPM
    detergent = ctrl.Consequent(np.arange(0, 201, 1), 'detergent') # ML

    # Membership Functions
    
    # Load
    load['small'] = fuzz.trimf(load.universe, [0, 0, 5])
    load['medium'] = fuzz.trimf(load.universe, [3, 6, 9])
    load['large'] = fuzz.trimf(load.universe, [7, 12, 12])

    # Dirt
    dirt['low'] = fuzz.trimf(dirt.universe, [0, 0, 4])
    dirt['medium'] = fuzz.trimf(dirt.universe, [2, 5, 8])
    dirt['high'] = fuzz.trimf(dirt.universe, [6, 10, 10])

    # Sensitivity
    sensitivity['robust'] = fuzz.trimf(sensitivity.universe, [0, 0, 4])
    sensitivity['normal'] = fuzz.trimf(sensitivity.universe, [2, 5, 8])
    sensitivity['delicate'] = fuzz.trimf(sensitivity.universe, [6, 10, 10])

    # Outputs - Wash Time
    wash_time['short'] = fuzz.trimf(wash_time.universe, [0, 15, 25])
    wash_time['medium'] = fuzz.trimf(wash_time.universe, [20, 35, 45])
    wash_time['long'] = fuzz.trimf(wash_time.universe, [40, 60, 60])

    # Water Level
    water_level['low'] = fuzz.trimf(water_level.universe, [0, 20, 40])
    water_level['medium'] = fuzz.trimf(water_level.universe, [30, 50, 70])
    water_level['high'] = fuzz.trimf(water_level.universe, [60, 100, 100])

    # Spin Speed
    spin_speed['very_low'] = fuzz.trimf(spin_speed.universe, [0, 400, 600]) # For delicate
    spin_speed['low'] = fuzz.trimf(spin_speed.universe, [400, 600, 800])
    spin_speed['medium'] = fuzz.trimf(spin_speed.universe, [600, 1000, 1200])
    spin_speed['high'] = fuzz.trimf(spin_speed.universe, [1000, 1400, 1400])

    # Detergent
    detergent['little'] = fuzz.trimf(detergent.universe, [0, 30, 60])
    detergent['normal'] = fuzz.trimf(detergent.universe, [50, 100, 130])
    detergent['lots'] = fuzz.trimf(detergent.universe, [120, 200, 200])

    # Rules
    # Base decisions on Load
    rule1 = ctrl.Rule(load['small'] & dirt['low'], (wash_time['short'], water_level['low'], detergent['little']))
    rule2 = ctrl.Rule(load['small'] & dirt['medium'], (wash_time['medium'], water_level['low'], detergent['normal']))
    rule3 = ctrl.Rule(load['small'] & dirt['high'], (wash_time['medium'], water_level['medium'], detergent['normal']))
    
    rule4 = ctrl.Rule(load['medium'] & dirt['low'], (wash_time['medium'], water_level['medium'], detergent['normal']))
    rule5 = ctrl.Rule(load['medium'] & dirt['medium'], (wash_time['medium'], water_level['medium'], detergent['normal']))
    rule6 = ctrl.Rule(load['medium'] & dirt['high'], (wash_time['long'], water_level['high'], detergent['lots']))

    rule7 = ctrl.Rule(load['large'] & dirt['low'], (wash_time['medium'], water_level['high'], detergent['normal']))
    rule8 = ctrl.Rule(load['large'] & dirt['medium'], (wash_time['long'], water_level['high'], detergent['lots']))
    rule9 = ctrl.Rule(load['large'] & dirt['high'], (wash_time['long'], water_level['high'], detergent['lots']))

    # Sensitivity Overrides/Adjustments for Spin Speed
    rule10 = ctrl.Rule(sensitivity['delicate'], spin_speed['very_low'])
    rule11 = ctrl.Rule(sensitivity['normal'], spin_speed['medium'])
    rule12 = ctrl.Rule(sensitivity['robust'], spin_speed['high'])

    # Rules can be more complex, but this covers the basics
    
    washing_ctrl = ctrl.ControlSystem([
        rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8, rule9, 
        rule10, rule11, rule12
    ])
    
    return ctrl.ControlSystemSimulation(washing_ctrl)

def calculate_fuzzy_values(total_load: float, avg_dirt: float, max_sensitivity: float):
    washing_sim = get_washing_system()
    
    washing_sim.input['load'] = min(total_load, 12) # Cap at 12
    washing_sim.input['dirt'] = min(avg_dirt, 10)
    washing_sim.input['sensitivity'] = min(max_sensitivity, 10)

    # Crunch the numbers
    washing_sim.compute()

    return {
        "wash_time": washing_sim.output['wash_time'],
        "water_level": washing_sim.output['water_level'],
        "spin_speed": washing_sim.output['spin_speed'],
        "detergent_amount": washing_sim.output['detergent'],
        "explanation": f"Fuzzy Calculation based on Load={total_load:.1f}, Dirt={avg_dirt:.1f}, Sensitivity={max_sensitivity:.1f}"
    }
