# Broken Authentication-3-Login Jim

## 1. Methodology
I accessed the login page of my Juice Shop instance.

I tested an SQL injection in the email field using the value:  
`jim@juice-sh.op'--`

I left the password field empty (or entered values such as `12345`).

I clicked **Log in** and was directly logged into Jim’s account.

**Techniques used:** SQL injection, authentication bypass  
**Tools used:** Web browser, Burp Suite (for analysis)

---

## 2. Exploited Vulnerabilities
**Name:** Broken Authentication + SQL Injection  

**Affected component:** Authentication backend (unsecured SQL query)  

**Severity:** High – full access to a user account without knowing the password

---

## 3. Risks
- Unauthorized access to user accounts (in this case, Jim)  
- Theft of personal data or placing orders without the user’s knowledge  
- Potential privilege escalation if the targeted account has elevated permissions

---

## 4. Mitigation Actions

### Strategies
- Never construct SQL queries by concatenating user-controlled input

### Fixes
- Use prepared statements with typed parameters  
- Validate and sanitize all input before processing

### Best practices
- Regularly audit entry points (login, search, etc.)  
- Implement automated tests to detect injection vulnerabilities
