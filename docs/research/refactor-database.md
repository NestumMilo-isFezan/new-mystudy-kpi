# Refactored Database Schema (PostgreSQL)

## 1. Identity & Access
### `users`
- `id` (UUID)
- `identifier` (string, unique) - e.g., Matric No or Staff ID
- `role` (smallint) - Mapping: 0 = STUDENT, 1 = LECTURER, 2 = STAFF
- `password` (string, hashed)
- `email` (string, unique)

### `user_profiles`
- `user_id` (FK to users)
- `full_name` (string)
- `intake_batch_id` (FK to intake_batches, nullable for staff/lecturers)
- `phone_number` (string)

## 2. Organization
### `intake_batches`
- `id` (INT)
- `name` (string, unique) - e.g., "2023/2024"
- `is_active` (boolean) - To hide old batches from registration dropdowns

### `mentorships`
- `id` (UUID)
- `lecturer_id` (FK to users)
- `batch_id` (FK to intake_batches)
- `title` (string)

### `mentorship_students`
- `mentorship_id` (FK to mentorships)
- `student_id` (FK to users)

## 3. KPI Data
### `kpi_aims`
- `id`, `user_id`
- `cgpa_target` (decimal)
- `activity_targets` (jsonb) - Store as JSON for flexibility: `{ "faculty": 4, "university": 2 ... }`
- `competition_targets` (jsonb)
- `cert_targets` (jsonb)

### `kpi_entries`
- `id`, `user_id`
- `type` (enum) - `activity`, `competition`, `certification`
- `category` (string) - e.g., "Faculty", "National", "Technical"
- `title`, `description`, `date`, `sem`, `year_of_study`
- `attachment_url` (string) - For proof/certificates
