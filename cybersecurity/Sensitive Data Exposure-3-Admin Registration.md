## Analyzed the registration feature
I inspected how the client-side registration form sends data to the backend by observing the `POST /api/Users/` request in Firefox DevTools.

---

## Attempted privilege escalation through request tampering
I tried adding a `"role": "admin"` parameter inside the JSON body of the registration request, assuming the server might fail to validate user-controlled role assignments.

---

## Identified incorrect JSON formatting
The initial injection failed because my payload lacked a proper JSON comma.  
I corrected the payload to: `"role":"admin",`

---

## Tools used
- Firefox DevTools (Network tab)
- Manual JSON tampering (Burp Suite)

---

## Vulnerability
- Mass Assignment  
- Affected component: Database  
- Severity: High

---

## Risks
- Data leak  
- Reputational damage

---

## Actions
- Implement server-side allowlists  
- Only allow expected fields (email, password, username, e.g.) to be processed during user registration
