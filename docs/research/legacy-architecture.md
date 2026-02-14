# Legacy Architecture Analysis

## Tech Stack
- **Server-side**: PHP (Procedural style, using `mysqli` extension)
- **Database**: MySQL
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Icons**: Boxicons, Font Awesome 4.7
- **Fonts**: Raleway, Lilita One, Poppins

## Project Structure
- `ajax/`: Server-side scripts for handling asynchronous requests.
- `challenge/`: Logic related to "Challenges" (needs further investigation).
- `config/`: Configuration files (e.g., database connection).
- `css/`: Stylesheets for different modules.
- `managekpi/`: Core modules for managing KPIs (CGPA, Activity, Competition, Certificate).
- `profile/`: User profile management.
- `script/`: Client-side JavaScript.
- `template/`: Reusable UI components (header, footer, menu).
- `user-auth/`: Login and registration logic.

## Core Patterns
- **Templating**: Basic PHP `include` and `require` for modular UI.
- **Session Management**: Native PHP sessions (`session_start()`).
- **Data Flow**: Direct SQL queries within PHP files.
- **Dynamic Content**: Uses Vanilla JS `XMLHttpRequest` (AJAX) to load partial views in the `managekpi.php` dashboard.
- **Routing**: File-based routing (e.g., `index.php`, `managekpi.php`).

## Identified Issues for Modernization
- **Security**: SQL queries are often concatenated, leading to potential SQL injection (needs validation).
- **Maintainability**: Procedural code with mixed logic (SQL, PHP, HTML) makes testing and scaling difficult.
- **State Management**: Heavy reliance on server-side sessions and page reloads.
- **Code Duplication**: Similar logic patterns repeated across different `view.php` and `add-action.php` files.
