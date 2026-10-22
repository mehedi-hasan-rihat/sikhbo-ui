# Project Review Portal — PRD

## 1. Product Overview

Project Review Portal is a web application where students submit development projects and mentors review, approve, or reject those submissions.

The application consists of a Next.js frontend and an Express.js REST API backed by PostgreSQL and Prisma ORM.

## 2. User Roles

### Student
- Create an account and log in.
- Submit a project with a name, repository URL, live URL, and description.
- Receive clear feedback for invalid or duplicate submissions.
- View the result of their submission.

### Mentor
- Log in using a seeded mentor/admin account.
- View submissions in a paginated dashboard.
- Filter submissions by approval status.
- Approve or reject pending submissions.
- View aggregated submission statistics.

A mentor account cannot be created through public signup.

## 3. Core Requirements

### Authentication
- Student registration and login.
- JWT-based authentication.
- Protected routes based on user role.
- Secure token handling and logout.
- Clear authentication and authorization error states.

### Student Submission Portal
- Form fields: project name, repository URL, live URL, description.
- Client-side validation for immediate feedback.
- Server-side validation as the authoritative check.
- Prevent duplicate submissions according to the agreed business rules.
- Display loading, success, validation, and API error states.

### Mentor Dashboard
- Paginated submission table.
- Columns: project, student, repository, live link, status, submission date, actions.
- Server-side status filtering.
- Approve and reject actions.
- Pending, approved, and rejected statistics.
- Confirmation before changing a submission's status.
- Refresh affected dashboard data after a successful review.

### Signup and Login
- Signup accepts student registration only.
- Login returns an authenticated session.
- Invalid credentials produce a generic error.
- Authentication errors must not expose sensitive server details.

## 4. Product Decisions

- Each student can create multiple submissions, but only one submission per student is allowed for the same normalized repository URL.
- A submission begins with `PENDING` status.
- Only mentors can approve or reject submissions.
- Only pending submissions can be reviewed.
- Approved or rejected submissions cannot be reviewed again through the normal workflow.
- Students can view their own submission history and status.
- Students cannot change review status or access other students' private data.
- The dashboard uses server-side pagination, filtering, and statistics.

These decisions resolve ambiguities in the assessment and should be documented in the backend business rules.

## 5. Non-Functional Requirements

- Responsive desktop and mobile layouts.
- Accessible form controls, keyboard navigation, and visible focus states.
- Secure authorization on every protected API operation.
- Consistent API error responses.
- Pagination to avoid loading every submission at once.
- Basic rate limiting for authentication and submission endpoints.
- TypeScript across the frontend and backend.
- No secrets or privileged database access in browser code.

## 6. Acceptance Criteria

- A student can register, log in, and submit a valid project.
- Invalid input is rejected by both the frontend and backend.
- Duplicate repository submissions are prevented, including concurrent requests.
- A student cannot access mentor-only actions.
- A mentor can filter and paginate submissions.
- Approve and reject actions persist to PostgreSQL.
- Dashboard statistics reflect persisted submission statuses.
- Unauthorized API requests are rejected.
- The application can be started locally using documented setup instructions.

## 7. Out of Scope

- Email notifications.
- Real-time collaboration.
- Multiple mentors reviewing the same submission.
- Advanced analytics.
- File uploads.
- Public student leaderboards.
