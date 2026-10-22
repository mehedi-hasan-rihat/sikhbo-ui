# Frontend Architecture

## 1. Technology Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- Fetch API
- Vitest and React Testing Library

Use the latest mutually compatible stable versions when initializing the project. Commit the lockfile and do not upgrade dependencies arbitrarily.

## 2. Architecture Principles

1. Next.js is the presentation and user interaction layer.
2. Express is the authoritative application API.
3. PostgreSQL is accessed only through the Express backend.
4. Client-side validation improves usability; backend validation enforces correctness.
5. Authorization must never depend on hidden buttons or frontend role checks alone.
6. Shared components should remain simple and reusable.
7. Avoid unnecessary global state and additional dependencies.

## 3. Route Structure

```text
app/
├── layout.tsx
├── page.tsx
├── (auth)/
│   ├── login/page.tsx
│   └── signup/page.tsx
├── (student)/
│   └── student/
│       ├── layout.tsx
│       ├── dashboard/page.tsx
│       └── submissions/new/page.tsx
├── (mentor)/
│   └── mentor/
│       ├── layout.tsx
│       └── submissions/page.tsx
├── error.tsx
├── not-found.tsx
└── loading.tsx
```

Route groups organize code without adding URL segments. The final URLs must be verified against the actual route structure.

## 4. Component Organization

```text
src/
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/
│   ├── feedback/
│   └── shared/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── schemas/
│   │   └── services/
│   ├── submissions/
│   │   ├── components/
│   │   ├── schemas/
│   │   └── services/
│   └── mentor-dashboard/
│       ├── components/
│       └── services/
├── lib/
│   ├── api/
│   ├── auth/
│   ├── constants/
│   └── utils.ts
└── types/
```

Keep components near the feature that owns them. Promote a component to `components/shared` only when reuse is justified.

## 5. Rendering Strategy

Use Server Components by default for static layouts and pages that do not require browser interaction.

Use Client Components for:
- Interactive forms.
- Search, pagination, and filter controls.
- Dialogs and confirmation actions.
- Components that require React state or browser events.

The frontend must not query PostgreSQL directly. It communicates with the Express API.

For authenticated data, use an explicit, secure request strategy. Do not assume that a Server Component automatically authenticates a request to a separate Express server. Forward only the required session credentials through a trusted server-side boundary.

Never expose JWT signing secrets, database credentials, or private environment variables through `NEXT_PUBLIC_` variables.

## 6. API Client

Create a centralized API client that:
- Uses a configured API base URL.
- Adds the appropriate authentication credentials.
- Parses JSON responses safely.
- Normalizes API errors.
- Handles expired sessions consistently.
- Supports query parameters for pagination and filtering.
- Uses appropriate request timeouts where practical.

Do not scatter raw fetch logic across unrelated components.

Example API environment variable:

`API_BASE_URL=http://localhost:4000/api/v1`

This is a server-side environment variable. If browser code must call the API directly, use an explicitly configured public URL instead and configure CORS accordingly.

## 7. Forms and Validation

Use React Hook Form with Zod for interactive form validation.

Validate:
- Required fields.
- String length limits.
- Valid HTTP/HTTPS URLs.
- Empty and whitespace-only values.
- Field-specific errors.

Reuse a shared validation contract where practical, but always validate independently in Express.

Prevent accidental repeated submissions by disabling the submit button while a request is in progress. This is a usability safeguard, not a substitute for backend duplicate protection.

## 8. Data Fetching and State

Use local React state for simple form and dialog interactions.

Use URL search parameters for shareable dashboard filters and pagination.

Avoid adding Redux or Zustand unless actual requirements justify them.

After a review action:
1. Show a pending action state.
2. Submit the review request.
3. Display a useful success or error message.
4. Refresh the affected submission and statistics data.
5. Preserve the current filter and pagination when possible.

Do not display stale statistics as if they were freshly updated.

## 9. Authentication and Authorization

Use a server-verified session model. Prefer an HttpOnly, Secure-in-production, SameSite cookie for the JWT when the deployment architecture supports it.

If browser code calls the API with cookies, configure credentials and CORS explicitly and protect state-changing requests against CSRF.

Never trust a role supplied by a form, URL parameter, local storage, or client state. The Express API derives identity and role from the verified token and, where required, current user records.

Middleware at the Next.js boundary may improve navigation, but it does not replace Express authorization.

## 10. UI States

Every data-driven feature should account for:
- Initial loading.
- Empty results.
- Validation errors.
- Authentication failures.
- Permission failures.
- Network failures.
- Server errors.
- Successful mutations.

Use accessible labels, semantic headings, keyboard-operable dialogs, and visible focus indicators.

## 11. Testing

Test:
- Form validation.
- Login and signup behavior.
- Loading and error states.
- Pagination and filtering.
- Mentor review actions.
- Unauthorized and forbidden UI responses.
- Empty dashboard results.

The backend remains responsible for enforcing security even if the frontend tests pass.
