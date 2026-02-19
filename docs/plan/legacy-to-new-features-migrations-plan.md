# Legacy-to-New Features Migration Plan

This document outlines the strategy for migrating KPI data from the legacy MySQL database to the new Symfony PostgreSQL backend.

## 1. Schema Mapping & Evolution

### `kpi_aims` (Targets)
The goal is to provide a "Shared Target" system where students, lecturers, and entire batches can have defined KPI targets.

| New Column | Type | Legacy Source | Notes |
| :--- | :--- | :--- | :--- |
| `id` | `smallint` | `kpiaim.aim_id` | Primary Key |
| `student_id` | `uuid` (FK) | `kpiaim.userID` | Nullable if batch-wide |
| `lecturer_id` | `uuid` (FK) | - | Nullable if set by student |
| `batch_id` | `integer` (FK)| - | Nullable if individual |
| `cgpa_target` | `decimal` | `kpiaim.cgpa` | |
| `activity_targets`| `jsonb` | `a_fac`, `a_uni`, `a_nat`, `a_inter` | Keys: `faculty`, `university`, `local`, `national`, `international` |
| `competition_targets` | `jsonb` | `c_fac`, `c_uni`, `c_nat`, `c_inter` | Keys: `faculty`, `university`, `local`, `national`, `international` |
| `certificate_targets` | `jsonb` | `cert_pro`, `cert_tec` | Keys: `professional`, `technical` |

### `semester_records` (Parent Container)
New intermediate table to group records by semester/year.

| New Column | Type | Legacy Source | Notes |
| :--- | :--- | :--- | :--- |
| `id` | `smallint` | - | Primary Key |
| `student_id` | `uuid` (FK) | `userID` | From any kpi table |
| `semester` | `smallint` | `sem` | |
| `academic_year`| `string` | `year` | e.g., "2023/2024" |

### `cgpa_records` (Children)
| New Column | Type | Legacy Source | Notes |
| :--- | :--- | :--- | :--- |
| `id` | `smallint` | - | Primary Key |
| `record_id` | `smallint` (FK)| - | Link to `semester_records` |
| `gpa` | `decimal` | `cgpa.cgpa` | |

### `kpi_records` (Polymorphic Entries)
Consolidates `activity`, `competition`, and `certification` records.

| New Column | Type | Legacy Source | Notes |
| :--- | :--- | :--- | :--- |
| `id` | `smallint` | - | Primary Key |
| `record_id` | `smallint` (FK)| - | Link to `semester_records` |
| `type` | `enum` | - | `activity`, `competition`, `certification` |
| `title` | `string` | `activity` / `competition` / `certification` | |
| `description` | `text` | `remark` | |
| `level` | `smallint` (null)| `level` | Mapping (Activity/Comp): 0=Faculty, 1=University, 2=Local, 3=National, 4=International. **NULL for Cert.** |
| `category` | `smallint` (null)| `level` | Mapping (Cert): 0=Professional, 1=Technical. **NULL for Activity/Comp.** |
| `tags` | `jsonb` | - | New metadata for filtering |

**Note on Integrity**: At the application (Symfony) and database level, a record MUST have either a `level` OR a `category` depending on its `type`.
| `notes` | `text` | - | Internal lecturer/student notes |

---

## 2. Implementation Strategy

### Phase 1: Entity Creation
1. Define Symfony Entities (`KpiAim`, `SemesterRecord`, `CgpaRecord`, `KpiRecord`).
2. Implement custom Repository methods for fetching aggregated student progress.
3. Run migrations to update the PostgreSQL schema.

### Phase 2: Data Transformation
1. **Extraction**: Export legacy MySQL tables to JSON/CSV.
2. **Normalization**:
   - Resolve `userID` (Matric No) to New Backend `UUID`.
   - Resolve `batch` names to `IntakeBatch` IDs.
   - Combine legacy columns (e.g., `a_fac`, `a_uni`) into target JSON objects.
3. **De-duplication**: Ensure `semester_records` are only created once per student/sem/year.

### Phase 3: Seeding / Import
- Develop a Symfony CLI command (`app:migrate-legacy-kpi`) to:
  - Create `SemesterRecord` first.
  - Create children `CgpaRecord` and `KpiRecord`.
  - Create `KpiAim` records, linking to `User` and `IntakeBatch`.

### Phase 4: Validation
- Compare legacy dashboard counts with new backend aggregations.
- Verify `lecturer_id` relationship (shared target) works as intended in the UI.
