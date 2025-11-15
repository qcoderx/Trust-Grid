# Refactoring Plan: Centralize API Requests and Fix Logout

## Information Gathered
- `frontend/src/services/api.js`: Contains ApiService class with methods for organization, API key, data request, verification, citizen, and health check endpoints.
- `frontend/src/api.js`: Contains ApiClient class with similar methods, used by AuthContext and ApiKeysTable.
- `frontend/src/pages/DashboardPage.jsx`: Uses apiService from services/api.js and direct fetch calls.
- `frontend/src/pages/CitizenApp.jsx`: Uses direct fetch calls.
- `frontend/src/components/api/ApiKeysTable.jsx`: Uses apiClient from api.js.
- `frontend/src/context/AuthContext.jsx`: Uses apiClient from api.js.
- `frontend/src/components/Header.jsx`: Already has logout via AuthContext.
- No .jsx files use axios; they use fetch or apiClient.

## Plan
1. Merge ApiClient methods from `frontend/src/api.js` into `frontend/src/services/api.js` ApiService class.
2. Update `frontend/src/context/AuthContext.jsx` to use apiService from services/api.js.
3. Update `frontend/src/components/api/ApiKeysTable.jsx` to use apiService from services/api.js.
4. Refactor `frontend/src/pages/DashboardPage.jsx` to replace direct fetch calls with apiService methods.
5. Refactor `frontend/src/pages/CitizenApp.jsx` to replace direct fetch calls with apiService methods.
6. Remove `frontend/src/api.js` after migration.
7. Ensure logout functionality in Header is working (already integrated via AuthContext).

## Dependent Files to Edit
- `frontend/src/services/api.js`: Add merged methods.
- `frontend/src/context/AuthContext.jsx`: Change import to services/api.js.
- `frontend/src/components/api/ApiKeysTable.jsx`: Change import to services/api.js.
- `frontend/src/pages/DashboardPage.jsx`: Replace fetch with apiService.
- `frontend/src/pages/CitizenApp.jsx`: Replace fetch with apiService.
- Remove `frontend/src/api.js`.

## Followup Steps
- Test API calls after refactoring.
- Verify logout functionality in Header.
- Run the app to ensure no errors.
