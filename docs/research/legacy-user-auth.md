# Legacy User Authentication Analysis

## Overview
The authentication system is a custom-built PHP session-based implementation. It handles user registration, login, and session persistence.

## 1. Registration Flow
- **File**: `user-auth/register-form.php` and `user-auth/register-action.php`
- **Process**:
    1. Collects user data: Matric No, Name, Email, Password, Intake Batch, etc.
    2. Hashes the password using `password_hash()` (assuming standard PHP practices based on `login-action.php`).
    3. Inserts data into the `user` table (credentials) and `userprofile` table (meta-data).
    4. Initializes a default entry in `kpiaim` for the new user.

## 2. Login Flow
- **File**: `user-auth/login-action.php`
- **Process**:
    1. Receives `matricNo` and `userPwd` from the login form.
    2. Queries the `user` table for the `matricNo`.
    3. Verifies the password using `password_verify($_POST['userPwd'], $row["userPwd"])`.
    4. If successful:
        - Sets session variables: `$_SESSION['UID']`, `$_SESSION['matricNo']`, `$_SESSION['username']`, `$_SESSION['intake']`.
        - Records login time in `$_SESSION['loggedin_time']`.
        - Redirects to `index.php`.
    5. If failed: Displays an error message and redirects back to the login form.

## 3. Session Management
- **Initialization**: `session_start()` is called at the beginning of `template/header.php`.
- **Authorization**: Protected pages (like `managekpi.php`) check for the existence of `$_SESSION['UID']`. If missing, the user is redirected to `index.php`.
- **Logout**: `user-auth/logout-action.php` clears the session and redirects to the home page.

## 4. Security Considerations
- **Password Hashing**: Uses modern `password_verify()`, which is a good practice.
- **SQL Injection Risk**: The login query uses direct variable injection:
  `$sql = "SELECT * FROM user WHERE matricNo='$userMatric' LIMIT 1";`
  This is vulnerable if `$userMatric` is not properly escaped (though `mysqli_real_escape_string` might be used elsewhere, it's not visible in the snippet).
- **Session Security**: Basic session handling without CSRF protection or session regeneration after login.

## 5. User Roles
- The current implementation seems to focus on a single role: **Student**.
- No clear evidence of an Administrator role in the current legacy codebase snippets.
