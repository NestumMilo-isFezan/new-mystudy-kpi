# Legacy Database Schema Analysis

The database used is named `mykpi`. Based on the source code, the following tables and their structures have been identified.

## Core Tables

### `user`
Stores primary authentication data.
- `userID` (Primary Key)
- `matricNo` (Used as login identifier)
- `userPwd` (Hashed password)

### `userprofile`
Stores extended user information.
- `userID` (Foreign Key to `user`)
- `username`
- `intake_batch` (e.g., "2021/2022")
- *Additional fields likely include email, phone, and address.*

## KPI Management Tables

### `kpiaim`
Stores the target KPI values set by the student.
- `aim_id` (Primary Key)
- `userID` (Foreign Key)
- `cgpa`: Target CGPA
- `a_fac`, `a_uni`, `a_nat`, `a_inter`: Target activity counts for different levels.
- `c_fac`, `c_uni`, `c_nat`, `c_inter`: Target competition counts for different levels.
- `cert_pro`, `cert_tec`: Target certification counts.

### `cgpa`
Stores actual CGPA records per semester.
- `userID` (Foreign Key)
- `cgpa`: Actual CGPA
- `sem`: Semester (1 or 2)
- `year`: Academic year (e.g., "2021/2022")

### `activity`
Individual activity records.
- `a_id` (Primary Key)
- `userID` (Foreign Key)
- `sem`: Semester
- `year`: Academic year
- `activity`: Name of the activity
- `level`: (Faculty, University, National, International)
- `remark`: Optional comments

### `competition`
Individual competition records.
- `comp_id` (Primary Key)
- `userID` (Foreign Key)
- `sem`: Semester
- `year`: Academic year
- `competition`: Name of the competition
- `level`: (Faculty, University, National, International)
- `remark`: Optional comments

### `certification`
Individual certification records.
- `cert_id` (Primary Key)
- `userID` (Foreign Key)
- `sem`: Semester
- `year`: Academic year
- `certification`: Name of the certificate
- `level`: (Professional, Technical)
- `remark`: Optional comments

## Summary/Aggregate Views or Tables
These appear to be used for the main dashboard display to show counts per semester/year.
- `activity_count`
- `comp_count`
- `cert_count`

## Observations
- **Relationships**: Most tables are linked to the `user` table via `userID`.
- **Normalization**: The schema seems reasonably normalized for its purpose, though the `count` tables might be redundant if they are not views.
- **Data Types**: Inferred as mostly `VARCHAR` for strings, `INT` for IDs and counts, and `DECIMAL` or `FLOAT` for CGPA.
