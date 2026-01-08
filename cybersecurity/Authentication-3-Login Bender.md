# Broken Authentication-3-Login Bender

## 1. Methodology
I went to the login page of my Juice Shop instance.

I tested an SQL injection in the email field using:  
`bender@juice-sh.op'--`

I entered any password (e.g., `12345`).

By clicking **Log in**, I was directly logged into Bender’s account.

**Techniques used:** SQL injection, authentication bypass  
**Tools used:** Web browser (DevTools)

---

## 2. Exploited Vulnerabilities
**Name:** Broken Authentication + SQL Injection  

**Affected component:** Authentication backend (SQL query vulnerable to injection via the email field)  

**Severity:** High – full access to a user account without knowing the password

---

## 3. Risks
- Unauthorized access to a user account (in this case, Bender)  
- Ability to place orders, view order history, or modify personal information  
- If the account had elevated privileges, risk of privilege escalation

---

## 4. Mitigation Actions

### Strategies
- Never build SQL queries using unfiltered user input

### Fixes
- Use prepared statements with typed parameters  
- Validate and sanitize all server-side input

### Best practices
- Regularly test authentication forms with simple SQL payloads  
- Deploy a WAF to block obvious injection attempts
