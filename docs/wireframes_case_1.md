# Wireframes — Case 1: Authentication & Role-Based Landing

This document provides low‑fidelity wireframes for Flow #1 in `docs/poc_flows.md`.

---

## Screen 1 — Login

```
┌────────────────────────────────────────────────────────────────────┐
│ GROZA                                                             │
│                                                                    │
│                        Sign in to your account                    │
│                                                                    │
│  Email / Username                                                 │
│  ┌──────────────────────────────────────────────┐                 │
│  │ user@example.com                             │                 │
│  └──────────────────────────────────────────────┘                 │
│                                                                    │
│  Password                                                         │
│  ┌──────────────────────────────────────────────┐                 │
│  │ •••••••••••••                               │                 │
│  └──────────────────────────────────────────────┘                 │
│                                                                    │
│  [ Sign In ]                                                       │
│                                                                    │
│  Forgot password?                                                  │
└────────────────────────────────────────────────────────────────────┘
```

### Notes
- Minimal fields: username + password.
- Optional: “Forgot password” link and environment badge.

---

## Screen 2 — Role-Aware Dashboard (Template)

```
┌────────────────────────────────────────────────────────────────────┐
│ GROZA                                    [User]  [Logout]         │
│────────────────────────────────────────────────────────────────────│
│ Dashboard (Role-Aware)                                             │
│                                                                    │
│  Quick Actions                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │ Action 1    │  │ Action 2    │  │ Action 3    │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
│                                                                    │
│  Status Widgets                                                    │
│  ┌─────────────────────┐  ┌─────────────────────┐                 │
│  │ Metric A             │  │ Metric B             │                │
│  │ value                │  │ value                │                │
│  └─────────────────────┘  └─────────────────────┘                 │
│                                                                    │
│  Recent Activity                                                   │
│  ┌────────────────────────────────────────────────┐               │
│  │ - item 1                                         │              │
│  │ - item 2                                         │              │
│  │ - item 3                                         │              │
│  └────────────────────────────────────────────────┘               │
└────────────────────────────────────────────────────────────────────┘
```

### Notes
- User does not select a role.
- The dashboard shows combined sections based on all roles assigned.
- Optional: show a “Roles” badge list in the header (read-only).

---

## Role-Specific Dashboard Content (Examples)

### GLOBAL_ADMIN
- Quick actions: “Create company”, “Approve changes”, “Create user”.
- Metrics: # companies (GREEN/RED), pending approvals.

### VALIDATOR
- Quick actions: “Scan QR”, “Manual lookup”.
- Metrics: validated today, rejected today.

### FUNERAL_COMPANY_ADMIN
- Quick actions: “New CASE”, “Add employee”, “Add vehicle”, “Generate permits”.
- Metrics: open cases, permits issued.

### FUNERAL_COMPANY_EMPLOYEE
- Quick actions: “My CASEs”, “Generate QR”.
- Metrics: assigned pickups, completed pickups.

### DSP_AUTHORIZER
- Quick actions: “Pending approvals”.
- Metrics: pending queue, approved today.

### INSPECTOR
- Quick actions: “View companies”, “Generate report”, “Flag activity”.
- Metrics: flags open, audits this month.
