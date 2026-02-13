# GROZA POC - Key App Flows

Below are the main flows to cover in the first POC wireframes. Each flow includes actors, trigger, core steps, and expected outcome, plus suggested screens to sketch.

---

## 1) Authentication & Role-Based Landing
**Actors:** All roles (GLOBAL_ADMIN, VALIDATOR, FUNERAL_COMPANY_ADMIN, FUNERAL_COMPANY_EMPLOYEE, DSP_AUTHORIZER, INSPECTOR)

**Trigger:** User opens app and logs in.

**Steps:**
1. User enters credentials.
2. System authenticates and detects role.
3. User lands on role-specific dashboard.

**Outcome:** User sees relevant shortcuts and status widgets.

**Wireframes:** Login → Role-based dashboard.

---

## 2) Company Onboarding (Create + Approve)
**Actors:** GLOBAL_ADMIN, FUNERAL_COMPANY_ADMIN

**Trigger:** New company needs to be registered in APF platform.

**Steps:**
1. GLOBAL_ADMIN creates company record with initial details.
2. FUNERAL_COMPANY_ADMIN completes mandatory registration elements (location, employee minimums, vehicles).
3. GLOBAL_ADMIN reviews and approves company.
4. Company state set to GREEN/RED by GLOBAL_ADMIN.

**Outcome:** Company is authorized and visible for validations.

**Wireframes:** Admin company list → Create company → Company profile (completeness) → Approval modal/status.

---

## 3) Company Change Request Approval
**Actors:** FUNERAL_COMPANY_ADMIN, GLOBAL_ADMIN

**Trigger:** Company updates mandatory elements (e.g., location change).

**Steps:**
1. FUNERAL_COMPANY_ADMIN submits change request.
2. System marks request as “Pending Approval.”
3. GLOBAL_ADMIN reviews diff (old vs new data).
4. GLOBAL_ADMIN approves/rejects with note.

**Outcome:** Company data updated or request rejected; audit log stored.

**Wireframes:** Company profile → Change request form → Admin review queue → Approval detail.

---

## 4) Employee & Vehicle Management (Non-approval)
**Actors:** FUNERAL_COMPANY_ADMIN

**Trigger:** Company adds/removes employees or vehicles.

**Steps:**
1. Admin opens Employees/Vehicles tab.
2. Adds/removes entries and uploads required docs (if any).
3. Changes reflect immediately in company profile.

**Outcome:** Updated resources available for validations and cases.

**Wireframes:** Company profile → Employees list → Add employee form; Vehicles list → Add vehicle form.

---

## 5) Create CASE & Attach Documents
**Actors:** FUNERAL_COMPANY_ADMIN, FUNERAL_COMPANY_EMPLOYEE

**Trigger:** New deceased person case is created.

**Steps:**
1. User creates CASE with deceased details.
2. Uploads required documents (death certificate, ID, others).
3. System validates required attachments.
4. CASE status becomes “Ready for pickup.”

**Outcome:** A complete CASE exists for permits and validation.

**Wireframes:** Case list → New case form → Document upload → Case detail.

---

## 6) Generate CASE QR Code
**Actors:** FUNERAL_COMPANY_EMPLOYEE

**Trigger:** Employee is assigned to pickup.

**Steps:**
1. Employee opens CASE.
2. System checks company status.
3. If status is GREEN, employee clicks “Generate QR.”
4. System generates QR tied to CASE + company + assigned employee + vehicle.
5. If status is not GREEN, QR generation is blocked and a warning is shown.
6. Employee presents QR at hospital (if generated).

**Outcome:** QR code is ready for hospital validation only when company status is GREEN.

**Wireframes:** Case detail → QR generation panel → QR display.

---

## 7) Hospital Validation via QR
**Actors:** VALIDATOR (hospital staff)

**Trigger:** Funeral company arrives with QR.

**Steps:**
1. Validator scans QR.
2. System shows validation summary:
   - Company authorization status (GREEN/RED)
   - Assigned employee verification
   - Vehicle authorization status
   - CASE match (deceased details)
3. Validator confirms or rejects handover.

**Outcome:** Pickup approved or denied; action logged.

**Wireframes:** QR scanner → Validation summary → Confirm/Reject.

---

## 8) Permit Generation (Automatic)
**Actors:** FUNERAL_COMPANY_ADMIN

**Trigger:** CASE needs permits (transport, mortuary passport).

**Steps:**
1. User opens CASE → Permits section.
2. System auto-generates eligible permits based on CASE data.
3. User reviews and downloads.

**Outcome:** Permits issued and stored under CASE.

**Wireframes:** Case detail → Permits panel → Generated permits list.

---

## 9) Permit Manual Approval (DSP)
**Actors:** DSP_AUTHORIZER

**Trigger:** Embalming permit requires manual decision.

**Steps:**
1. DSP_AUTHORIZER opens pending approvals queue.
2. Reviews CASE data and documents.
3. Approves or rejects with reason.
4. System updates permit status and notifies company.

**Outcome:** Embalming permit issued or denied with reason.

**Wireframes:** DSP queue → Permit review → Approve/Reject with note.

---

## 10) Inspector Oversight & Reports
**Actors:** INSPECTOR

**Trigger:** Inspector audits platform activity.

**Steps:**
1. Inspector views company list and details.
2. Filters by permits, changes, date ranges.
3. Flags suspicious/illegal activity.
4. Generates reports (exportable).

**Outcome:** Audit trail, flags, and analytics available.

**Wireframes:** Inspector dashboard → Company list → Flag action → Reports.

---

## 11) Global User & Role Management
**Actors:** GLOBAL_ADMIN

**Trigger:** New global role needed (VALIDATOR/DSP/INSPECTOR).

**Steps:**
1. GLOBAL_ADMIN creates a user.
2. Assigns role and access scope.
3. User receives activation and can log in.

**Outcome:** Global role user provisioned.

**Wireframes:** Admin users list → Create user → Assign role.
