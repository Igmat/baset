---
name: Bug report
about: Create a report to help us improve

---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Run `baset '...'`
2. Go to file '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment (please complete the following information):**
 - OS: [e.g. *nix/win]
 - Node.js version: [e.g. 9.4.0]
 - npm version: [e.g. 5.6.0]
 - BaseT version: [e.g. 0.13.4]
 - BaseT config:
```JSON
{
    "specs": "**/*.spec.{js,jsx}",
    "bases": "**/*.spec.base.md",
    "plugins": {
        ".spec.jsx?$": {
            "readers": ["baset-reader-babel"],
            "resolvers": "baset-resolver-react",
            "baseliner": "baset-baseliner-md"
        }
    }
}
```

**Additional context**
Add any other context about the problem here.
