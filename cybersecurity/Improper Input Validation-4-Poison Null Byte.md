## Analyzed the file access restrictions
I inspected how the application handled file retrieval for resources like the easter egg and the forgotten developer backup. These files were not directly accessible due to server-side extension validation and path filtering. I reviewed the URL patterns and backend behavior to understand where improper input validation might occur.

---

## Identified filtering based on file extensions
When attempting to access restricted files, the server rejected the request because it validated the file extension before serving the content. This indicated that bypassing the extension check could allow access to otherwise blocked resources.

---

## Applied the poison null byte technique to bypass validation
I used the null byte injection technique (`%00`), URL-encoded as `%2500`, to terminate the filename on the server side.  
By appending `%2500` to the filename (e.g., `filename%2500.md`), the server processed only the allowed `.md` extension while ignoring the remainder of the actual filename.  
This bypass allowed me to access both the easter egg file and the forgotten developer backup, completing the challenge.

---

## Tools used
- Firefox DevTools (URL testing)
- Manual URL manipulation

---

## Vulnerability
- Improper Input Validation / Poison Null Byte  
- Affected component: File access and extension validation logic  
- Severity: High

---

## Risks
- Unauthorized access to internal or sensitive files  
- Exposure of developer backups or configuration data  
- Reputational damage

---

## Actions
- Implement strict file path and extension validation  
- Reject URLs containing null bytes or abnormal encodings  
- Canonicalize and sanitize filenames before processing on the server
