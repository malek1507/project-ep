## Analyzed the CAPTCHA protection mechanism
I examined how the application enforced CAPTCHA validation during sensitive actions. The goal was to determine whether the CAPTCHA was properly enforced on the server side or only validated client-side.

---

## Intercepted the CAPTCHA-related POST request
Using Burp Suite, I intercepted the POST request associated with the CAPTCHA-protected action. I analyzed the request parameters and observed that the CAPTCHA token was not uniquely validated per request.

---

## Bypassed CAPTCHA using request replay
I sent the intercepted POST request to Burp Suite Repeater and resent the same request more than 10 times within 20 seconds.  
The server accepted all repeated requests without enforcing CAPTCHA revalidation or rate limiting, successfully bypassing the anti-automation control.

---

## Tools used
- Burp Suite (Interceptor and Repeater)

---

## Vulnerability
- Broken Anti-Automation / CAPTCHA Bypass  
- Affected component: CAPTCHA validation and request handling  
- Severity: High

---

## Risks
- Automated abuse of application functionality  
- Brute-force or spam attacks  
- Increased risk of account takeover or service disruption

---

## Actions
- Enforce server-side CAPTCHA validation for every sensitive request  
- Invalidate CAPTCHA tokens after a single use  
- Implement rate limiting and request throttling mechanisms
