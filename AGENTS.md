# Package manager

Use `yarn` as the package manager for the frontend:

```bash
yarn install
yarn add <package>
yarn remove <package>
```

# Testing

After each change you eill need to test it. Run the `make test` target to execute all tests and checks for both backend and frontend code:

```bash
make test
```

# Automated fixes

When encountering linter or formatting errors, always run the `make fix` target to automatically fix them for both backend and frontend:

```bash
make fix
```

Only fix these errors manually if the command above was unable to do that.

# Terminology

This project has consistent terminology:

- **Note** is a template of the note that user edits. Notes use markdown language 
- **Run** is a particular instance of a **Note** which contains snapshot of a **Note** on the point of time at which it was instantiated. Runs are not editable apart from small changes, such as ticking of checkboxes and can only be viewed as a rendered markdown.
