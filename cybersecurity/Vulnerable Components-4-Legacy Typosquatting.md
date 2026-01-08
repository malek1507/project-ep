## Analyzed the developer backup file
I accessed the `package.json.bak` file by completing the “Forgotten Developer Backup” challenge. This allowed me to inspect all dependencies used by the Juice Shop application(hint from the scoreboard).

---

## Inspected project dependencies for suspicious entries
While reviewing the list of dependencies, I noticed a package named `epilogue-js`, which appeared suspicious. The intended legitimate package was `epilogue`.  
This discrepancy indicated a potential typosquatting attempt, where a malicious or misconfigured package imitates a legitimate one by using a slightly altered name.

---

## Identified the typosquatting vulnerability
`epilogue-js` is a classic case of typosquatting in npm, where an attacker creates a similarly named package to trick developers into installing it. Installing such a package could introduce malicious code into the application.

---

## Submitted the typosquatted package name to complete the challenge
To solve the challenge, I submitted `epilogue-js` through the Contact / Feedback form in the Juice Shop application, which confirmed successful exploitation.

---

## Tools used
- Web browser to view `package.json.bak`  
- Manual inspection of dependencies in the backup file

---

## Vulnerability
- Vulnerable Components / Typosquatting  
- Affected component: Dependency management / third-party packages  
- Severity: Medium

---

## Risks
- Accidental inclusion of malicious or compromised npm packages  
- Execution of untrusted code from typosquatted dependencies  
- Supply chain compromise

---

## Actions
- Verify dependency names carefully before installing or updating packages  
- Use automated dependency scanning to detect suspicious or typosquatted packages  
- Implement software bill of materials (SBOM) and regular npm audits  
- Avoid using poorly maintained or similarly named packages in projects
