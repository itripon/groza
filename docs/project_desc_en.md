This is a project called GROZA - software meant to facilitate collaboration between state institutions, funeral companies, and the Funeral Companies Association (APF).

Some of the problems the application should solve:
1. When a funeral company shows up at a hospital to collect a deceased person, there is no way for the hospital to validate whether the company is authorized by APF, whether the vehicle is registered as APF-authorized for transporting the deceased, etc.
2. Funeral companies need three types of permits (current status, more may be added in the future) issued by DSP (Public Health Directorate):
 - transport permit - fairly simple; based on information extracted from other documents, it can be generated automatically
 - mortuary passport - fairly simple; based on information extracted from other documents, it can be generated automatically
 - embalming permit - in most cases it can be generated automatically, but in some cases it must be generated manually by DSP because there are situations where DSP must assess embalming conditions (for example, if the deceased died from an infectious disease, DSP may decide that embalming cannot be performed, or that it must be done in a certain way, etc.)

In order to be authorized by APF, funeral companies must meet certain conditions, such as:
- having a processing/storage/embalming location
- having a minimum number of specialized authorized employees
- having a minimum number of authorized vehicles of certain types (parade, transport)

For each deceased person, the company should create a CASE, and have the ability to attach relevant documents to the CASE:
 - death certificate
 - ID
 - other documents

The application has 5 role types:
- GLOBAL_ADMIN - the super admin role that can do anything in the application
    - create global users and assign roles
    - add new companies
    - approve company changes
    - delete companies
    - change company state (GREEN/RED)
    - others
- VALIDATOR - global role, can:
    - validate whether a company is authorized in the APF platform (e.g., at the hospital, when a funeral company comes to collect a deceased person, the company employee presents a QR code automatically generated for the specific CASE, and the hospital employee scans the QR code to see whether the company is authorized and the person in the CASE corresponds; if authorized, they also see details about the company - for example, whether it has the necessary permits to collect the deceased, whether the employee present at the hospital is an employee of the company, whether the vehicle is registered as authorized for transporting the deceased, etc.)
- FUNERAL_COMPANY_ADMIN - company role that can:
    - add/remove employees
    - add/remove vehicles
    - add/remove permits
    - view details of its own company
    - define mandatory registration elements
        - processing/storage/embalming location
    - request changes to mandatory elements - for example, if a company moves to another location, it can request changing the location registered in the platform - there should be an approval process for these changes
    - change elements that do not require approval - for example adding an employee, adding a vehicle
    - generate the transport permit, mortuary passport, and embalming permit documents (when they can be generated automatically)
- FUNERAL_COMPANY_EMPLOYEE - company role that can:
    - see company cases
    - generate CASE QR code
- DSP_AUTHORIZER - global role that can:
    - when a permit cannot be generated automatically, manually approve that permit after evaluating the conditions (for example for the embalming permit, assess whether the deceased died from an infectious disease and decide whether embalming can be performed, or whether it must be performed in a certain way, etc.)
- INSPECTOR - global role that can:
    - see all companies registered in the platform
    - see details of all companies
    - see all permits issued for all companies
    - see all changes made by companies (for example adding an employee, adding a vehicle, requesting a location change, etc.)
    - create reports based on this data (for example how many companies are authorized in the platform, how many transport permits were issued in a certain period, the most common reasons why DSP does not approve embalming permits, etc.)
    - flag if something is suspicious/illegal with a company
