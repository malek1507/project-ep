## Analyzed the feedback submission mechanism
I initially attempted to capture the feedback submission request using **Firefox DevTools**. I inspected the **Network** tab while submitting feedback to see if I could locate a `POST /api/Feedback` request that contained a user identifier.

---

## Attempted IDOR exploitation
My first idea was to exploit an **Insecure Direct Object Reference (IDOR)** by modifying the `UserId` field in the outgoing request. However, DevTools did not display the feedback POST request, making direct manipulation impossible from the browser alone.

---

## Identified the hidden POST request using Burp Suite
After researching common Juice Shop exploitation methods, I learned that some requests are not visible in DevTools due to the framework’s internal handling. I installed **Burp Suite Community Edition**, configured it as a proxy, and resent the feedback form submission.  
Burp successfully intercepted the `POST /api/Feedback` request. I modified the `UserId` field from the default admin ID to another user ID (e.g., `5`).

---

## Tools used
- Firefox DevTools (Network tab)
- Burp Suite (manual request interception and modification)

---

## Vulnerability
- Broken Access Control / IDOR  
- Affected component: Feedback API  
- Severity: High

---

## Risks
- Unauthorized actions performed on behalf of other users  
- Manipulated or fraudulent feedback entries  
- Reputational damage

---

## Actions
- Enforce server-side authorization checks for all user-controlled identifiers  
- Ignore or overwrite `UserId` fields with the authenticated session’s user ID
