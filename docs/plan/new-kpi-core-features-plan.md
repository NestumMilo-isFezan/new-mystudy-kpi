# New KPI Core Features Implementation Plan

This plan outlines the development of the core KPI management system, transitioning from the completed schema/entity phase to functional API endpoints and frontend interfaces.

## 1. Module: Manage Academics (Semesters & GPA) - **COMPLETED**
- **Status**: Backend (CRUD + Lazy Scaffolding) and Frontend (Modular Table + Mobile Cards + Analytics) finished.
- **Key Features**: Auto-scaffold 8 standard semesters, manual Semester 3 (Short Semester) support, GPA trend visualization.

---

## 2. Module: Manage KPI Records - **COMPLETED**
- **Status**: Backend (DTO + Service + secured CRUD endpoints) and Frontend (nested routes + reusable form + table/cards + analytics) finished.
- **Key Features**: Semester-linked record CRUD, type-based filtering (Activity/Competition/Certification), and responsive manage page with action controls.

**Goal**: CRUD operations for Activity, Competition, and Certification records.

### Backend Requirements
- **DTOs**: `KpiRecordDto`.
- **Service**: `KpiRecordService` to manage entries linked to `SemesterRecord`.
- **Endpoints**:
  - `GET /api/student/kpi-records`: Fetch all records grouped/filterable by type.
  - `POST /api/student/kpi-records`: Create new record (linked to a `semester_record`).
  - `PATCH /api/student/kpi-records/{id}`: Edit record details.
  - `DELETE /api/student/kpi-records/{id}`: Remove record.

### Frontend Requirements
- **Route**: `src/routes/_auth/_student/kpi/records.tsx`.
- **Sidebar Label**: "Manage KPI Records"
- **Components**:
  - Reusable `KpiRecordForm` (handling levels for activities/comps vs. categories for certs).
  - Record lists with status badges and filtering by Type (Activity, Comp, Cert).
  - "Manage Intake" style pattern: Header, Table (Desktop), Cards (Mobile), and Action Group.

---

## 3. Module: Manage KPI Target (Individual) - **COMPLETED**
- **Status**: Backend (enum source via `target_set_by` + DTO/service + secured GET/PUT + actual aggregation) and Frontend (nested target routes + report table + editable sectioned form) finished.
- **Key Features**: Personal/Lecturer/Batch target comparison, actual KPI records + CGPA evaluation, and switchable report/edit workflow.

**Goal**: Allow students to set their own performance targets and view lecturer/batch requirements.

### Backend Requirements
- **DTOs**: `KpiAimUpdateDto`, `KpiAimResponseDto` (Laravel-style Resource).
- **Service**: `KpiAimService` to handle the logic of "Target Priority."
- **Repository**: `findAimsForStudent(User $student)`:
  - Fetches **Personal** (`student_id` set, `lecturer_id` NULL).
  - Fetches **Lecturer** (`student_id` set, `lecturer_id` NOT NULL).
  - Fetches **Batch** (`batch_id` matching student, `student_id` NULL).
- **Resource Mapping (JSON Structure)**:
  ```json
  {
    "personal": {
      "cgpa": "3.80",
      "activities": { "faculty": 2, "university": 1, ... },
      "lastUpdated": "2026-02-18T..."
    },
    "lecturer": {
      "source": "Lecturer Name",
      "cgpa": "3.50",
      "activities": { ... }
    },
    "batch": { ... }
  }
  ```
- **Endpoints**:
  - `GET /api/student/kpi-aim`: Returns the mapped resource above.
  - `PUT /api/student/kpi-aim`: Update personal targets ONLY.

### Frontend Requirements
- **Route**: `src/routes/_auth/_student/kpi/target/{route,index,edit}.tsx`.
- **Sidebar Label**: "Manage KPI Target"
- **Components**:
  - **Comparison Dashboard**: A table or grid showing "My Goal" vs "Lecturer/Batch Target" side-by-side.
  - **Sync Action**: Button to "Sync with Lecturer/Batch Targets" (copies lecturer, otherwise batch values to personal).
  - Target Setting Form (Grid of inputs for levels: Faculty to International).

---

## 4. Module: Overview (Dashboard) - **COMPLETED**
- **Status**: Backend (Aggregation Service + Gap Analysis endpoint) and Frontend (Dashboard components + Summary Cards + Bar Chart + Quick Actions) finished.
- **Key Features**: High-level achievement summary, target gap analysis, visual level distribution, and contextual quick actions.

**Goal**: An aggregated view of progress against targets.

### Backend Requirements
- **Service**: `KpiAggregationService` to calculate:
  - Current total counts per level/category.
  - Gap analysis (Targets vs. Actuals).
  - Latest GPA vs. Target GPA.
- **Endpoint**:
  - `GET /api/student/kpi-summary`: Returns a combined object of counts and targets.

### Frontend Requirements
- **Route**: `src/routes/_auth/_student/kpi/overview.tsx`.
- **Components**:
  - Summary Cards (Total Points, GPA, Completion %).
  - Radar Chart or Bar Charts showing Achievement vs. Aims.
  - "Quick Actions" for adding new records.

---

## 5. Module: Manage Challenges (Reflections)
**Goal**: Qualitative student reflections on semester-specific hurdles and mitigation plans.

### Backend Requirements
- **Entity**: `Challenge` linked to `SemesterRecord`.
- **Fields**: `challenge` (text), `plan` (text), `remark` (text, optional), `imgPath` (string, optional).
- **Service**: `ChallengeService`.
- **Endpoints**:
  - `GET /api/student/challenges`: Fetch entries.
  - `POST /api/student/challenges`: Create entry.
  - `PATCH /api/student/challenges/{id}`: Edit entry.
  - `DELETE /api/student/challenges/{id}`: Remove entry.

### Frontend Requirements
- **Route**: `src/routes/_auth/_student/challenges.tsx`.
- **Sidebar Label**: "Manage Challenges"
- **Components**:
  - `ChallengeForm`: Reusable form for add/edit.
  - `ChallengeList`: Dashboard-style list of reflections grouped by semester.

---

## Implementation Order
1.  **Phase 1: Academics**: The foundation for grouping records.
2.  **Phase 2: KPI Records**: The data entry portion.
3.  **Phase 3: KPI Aim**: Setting the benchmarks.
4.  **Phase 4: Overview**: Bringing it all together with data visualization.
5.  **Phase 5: Challenges**: Qualitative data layer.
