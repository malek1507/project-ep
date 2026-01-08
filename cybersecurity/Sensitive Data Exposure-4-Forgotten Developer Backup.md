## Analyzed the FTP directory for exposed backup files
Since I had already explored the FTP area in earlier challenges, I inspected the file listing again and found a file named `package-lock.json.bak`. Based on common patterns, `.bak` files are typically developer backups that often contain sensitive data or internal configuration details.

---

## Attempted direct access to the backup file
I tried accessing the file directly through the browser, but the server responded with a `401 Unauthorized` error. This indicated that the application applied access restrictions or extension checks to prevent direct retrieval of backup files.

---

## Tested null-byte injection to bypass extension filtering
Knowing from previous challenges that null-byte (`%00`) injection can bypass file extension validation, I attempted to append `%00` to the filename. However, this resulted in a `400 Bad Request` error, meaning the server rejected the raw null-byte encoding.

---

## Bypassed validation using URL-encoded null-byte and allowed extension
After researching proper encoding formats, I learned that the null-byte needs to be fully URL-encoded as `%2500`.  
By requesting the file as `package-lock.json.bak%2500.md`, the server processed the `.md` extension while ignoring the original `.bak` portion. This successfully bypassed the validation and allowed me to retrieve the forgotten developer backup file.

---

## Tools used
- Firefox DevTools (URL testing)
- Manual URL encoding manipulation

---

## Vulnerability
- Sensitive Data Exposure / Improper Input Validation  
- Affected component: File access and backup handling  
- Severity: High

---

## Risks
- Exposure of developer backups  
- Leakage of internal configuration or dependency information  
- Reputational damage

---

## Actions
- Block access to backup files and development artifacts  
- Enforce strict file extension and path validation  
- Remove unnecessary `.bak` files from production and restrict FTP directory access
