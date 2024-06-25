from langchain_core.tools import tool




@tool
def check_inspection_history():
    """
    Check the inspection history, use this tool to give you an idea of what could be a potential issue
    :return: a history of inspections, list of strings
    """

    return [
        {
            "date": "2022-01-01",
            "inspection_type": "scheduled",
            "inspection_result": "pass",
            "inspector": "John Doe",
            "reason": "Pump was properly lubricated and no wear detected on impeller. Operating at maximum efficiency."
        },
        {
            "date": "2022-03-01",
            "inspection_type": "emergency",
            "inspection_result": "fail",
            "inspector": "Jane Doe",
            "reason": "Pump seals were damaged causing significant leaks and cavitation detected due to low pressure."
        },
        {
            "date": "2022-06-15",
            "inspection_type": "scheduled",
            "inspection_result": "pass",
            "inspector": "Jim Beam",
            "reason": "All parts in good condition, pressure test results within normal range. Advanced monitoring system showing optimal performance."
        },
    ]

@tool
def create_sap_ticket(machine: str, issue: str, user: str):
    """
    Create a SAP ticket request, that needs to be accepted by the user. USE THIS TOOL WHEN ASKING THE USER IF THEY WANT TO CREATE A SAP TICKET
    :param machine: machine with issue
    :param issue: issue description
    :param user: user reporting the issue
    :return: ticket number
    """
    return {"machine": machine, "issue": issue, "user": user} 

@tool
def check_manual(machine: str):
    """
    Check the manual for a machine
    :param machine: machine to check the manual for
    :return: manual for the machine
    """
    manual = """
### Pump Model: P-102

#### Table of Contents
1. Introduction
2. Safety Precautions
3. Installation Instructions
4. Operation Guidelines
5. Maintenance Schedule
6. Troubleshooting
7. Contact Information

---

#### 1. Introduction
The P-102 Pump is designed for efficient fluid transfer in industrial settings. This manual provides essential information for safe and efficient operation.

#### 2. Safety Precautions
- Always disconnect power before servicing.
- Wear appropriate PPE (Personal Protective Equipment).
- Ensure the pump is properly grounded.
- Follow all local safety regulations.

#### 3. Installation Instructions
- Position the pump on a stable, level surface.
- Connect the inlet and outlet pipes securely.
- Verify all connections are leak-free.
- Ensure the power supply matches the pump's specifications.

#### 4. Operation Guidelines
- Check all connections and fittings before starting.
- Start the pump and monitor for any unusual noises or vibrations.
- Maintain proper pressure and flow rates as specified.
- Do not operate the pump dry.

#### 5. Maintenance Schedule
- **Daily:** Check for leaks and unusual noises.
- **Weekly:** Inspect the pump seals and bearings.
- **Monthly:** Perform a pressure test and check the impeller for wear.
- **Annually:** Conduct a full inspection and overhaul if necessary.

#### 6. Troubleshooting
- **Pump Not Starting:** Check power supply and connections.
- **Low Pressure:** Inspect for leaks and check the impeller.
- **Unusual Noises:** Check bearings and seals.
- **Leaks:** Inspect seals and connections.

#### 7. Contact Information
For further assistance, contact our support team:
- Phone: 1-800-555-1234
- Email: support@pumpexample.com
- Address: 123 Pump Street, Industrial City, IN 12345
"""
    return manual

class Toolkit:
    def __init__(self):
        pass

    def get_tools(self):
        """
        Get all tools
        :return: list of tools
        """
        return [
            check_inspection_history,
            create_sap_ticket,
            check_manual
        ]