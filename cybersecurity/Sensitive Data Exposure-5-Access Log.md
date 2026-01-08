# Sensitive Data Exposure-5-Access Log

## 1. Methodology
I started by looking for sensitive endpoints related to logs or maintenance.

While testing common paths, I tried `/support/logs` on my Juice Shop instance.

The page opened and displayed a button labeled **Download application logs**.

I clicked this button, which triggered the download of an `access.log` file.

When opening the file, I saw log entries containing HTTP requests, some of which included emails, tokens, or internal paths.

The challenge was automatically validated after the download.

**Techniques used:** Manual URL enumeration, OSINT on common paths  
**Tools used:** Web browser

---

## 2. Exploited Vulnerabilities
**Name:** Sensitive Data Exposure  

**Affected component:** `/support/logs` endpoint exposing application logs without authentication  

**Severity:** High – potential leakage of authentication information, IP addresses, tokens, or user behavior data

---

## 3. Risks
- Access to sensitive data (emails, sessions, API tokens) via logs  
- Reuse of credentials or tokens by an attacker  
- Mapping of internal application activity (called paths, errors, etc.)

---

## 4. Mitigation Actions

### Strategies
- Never expose application logs publicly

### Fixes
- Restrict access to `/support/logs` to authenticated administrators only  
- Remove logs containing sensitive data (credentials, tokens)  
- Do not log request bodies or authentication headers

### Best practices
- Use a centralized logging system with controlled access  
- Regularly audit endpoints exposed in the frontend or routing
