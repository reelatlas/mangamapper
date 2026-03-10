

## Update auth toggle text

Change the toggle text in `src/pages/Auth.tsx` (around lines 157-165) from:

- `// account(does_not_exist) → sign_up` / `// account(exists) → sign_in`

To:

- `// account_exists(false) → sign_up` (when on login view)
- `// account_exists(true) → sign_in` (when on signup view)

Single line change in the ternary that renders the comment text.

