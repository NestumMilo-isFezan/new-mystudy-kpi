# Legacy Features Analysis

The My Study KPI system is designed to help students track their academic and extra-curricular progress against targets.

## 1. User Authentication
- **Registration**: Users can sign up using their Matric No and personal details.
- **Login**: Secure login with password verification.
- **Profile Management**: Users can update their personal information and upload a profile picture.

## 2. KPI Dashboard
The central hub (`managekpi.php`) displays a comprehensive table comparing:
- **Faculty KPI's Aim**: Standard benchmarks set by the faculty.
- **My KPI's Aim**: Personal goals set by the student.
- **Actual Progress**: Real-time data aggregated from semester-by-semester entries.

### Tracked Indicators:
- **CGPA**: Academic performance across 8 semesters.
- **Student's Activity**: Categorized by Faculty, University, National, and International levels.
- **Student's Competition**: Categorized by Faculty, University, National, and International levels.
- **Certifications**: Categorized into Professional and Technical certificates.

## 3. CRUD Modules
Each KPI category has its own management module (located in `managekpi/` subdirectories):
- **View**: List all entries for a specific category.
- **Add**: Create a new entry with semester, year, title, level, and remarks.
- **Edit**: Modify existing entries.
- **Delete**: Remove entries with a confirmation prompt.

## 4. Challenges (In-Progress/Legacy)
- Located in the `challenge/` directory.
- Appears to be a feature for setting or viewing specific goals or challenges, possibly related to student involvement.

## 5. UI/UX Patterns
- **Tabbed Interface**: The Manage KPI section uses a vertical tab system to switch between CGPA, Activity, Competition, and Certificate views.
- **AJAX Loading**: Switching tabs updates the content dynamically without a full page reload, using `XMLHttpRequest`.
- **Responsive Design**: Uses basic CSS media queries to handle mobile and desktop views (e.g., `hideOnMobile` classes).
- **Interactive Search**: Client-side filtering/search in list views (handled via `script/` and `ajax/`).

## 6. Feedback Mechanisms
- Success/Error messages with icons (e.g., `success.png`, `user-error.png`).
- Timed redirects after login or certain actions.
