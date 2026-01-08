## Analyzed the FTP directory for exposed backup files
Already familiar with the FTP directory from earlier challenges, I inspected the file listing and found a file named `coupons_2013.md.bak`. Since `.bak` files are commonly used as developer or system backups, I assumed this file might contain sensitive sales information.

---

## Attempted direct access to the backup file
I tried to access the file directly via the browser, but the server returned a `401 Unauthorized` error. This indicated that direct access to backup files was restricted, likely due to extension filtering or path protection.

---

## Tested null-byte injection to bypass extension validation
Knowing that null-byte (`%00`) injection can bypass file-type restrictions, I attempted to append `%00` to the filename. This attempt resulted in a `400 Bad Request`, meaning the server rejected the raw null-byte sequence.

---

## Bypassed validation using URL-encoded null-byte with an allowed extension
After researching proper URL encoding, I learned that the null byte must be encoded as `%2500` to be interpreted correctly.  
By requesting the file as `coupons_2013.md.bak%2500.md`, the server accepted the `.md` extension while ignoring the `.bak` portion of the filename.  
This bypass successfully revealed the forgotten sales backup file.

---

## Tools used
- Firefox DevTools (URL inspection and testing)
- Manual URL encoding manipulation

---

## Vulnerability
- Sensitive Data Exposure / Improper Input Validation  
- Affected component: File access and backup handling  
- Severity: High

---

## Risks
- Leakage of historical sales or coupon data  
- Exposure of sensitive business information  
- Reputational damage

---

## Actions
- Block access to `.bak` and internal backup files on production servers  
- Enforce strict path sanitization and proper extension validation  
- Remove outdated or unnecessary backup files from publicly accessible directories
