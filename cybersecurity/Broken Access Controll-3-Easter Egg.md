## Analyzed the access logs and file handling behavior
I inspected the available logs (FTP access logs) to identify references to hidden or restricted files. During the review, I noticed an entry pointing to an easter egg file that appeared to have restricted access or was protected by extension validation.

---

## Applied zero-byte injection
Using the zero-byte (`%00`) technique, I appended `%2500.md` to the filename.  
This allowed me to trick the server into interpreting only the `.md` extension while bypassing the internal security check on the original file.  
The resulting request successfully returned the hidden easter egg file, which contained the hint for the nested easter egg challenge.

---

## Tools used
- Firefox DevTools (Network tab)
- Manual request tampering (Burp Suite)

---

## Vulnerability
- Zero-byte injection / Broken access control  
- Affected component: File access / backend validation  
- Severity: High

---

## Risks
- Unauthorized access to restricted files  
- Data leak  
- Reputational damage

---

## Actions
- Implement strict server-side file extension validation  
- Sanitize and canonicalize file paths before processing
