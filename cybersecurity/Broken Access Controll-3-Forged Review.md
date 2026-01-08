## Analyzed the product review submission process
Since I already understood how feedback submissions worked from the previous challenge, I inspected the review functionality expecting a similar request structure. I monitored the interactions to identify where the application sends the review data to the backend.

---

## Intercepted the review request using Burp Suite
Because DevTools sometimes fails to show certain XHR requests in Juice Shop, I used Burp Suite Community Edition to capture the outgoing `POST /api/Products/:id/Reviews` request. Burp displayed all fields being submitted, including the `author` value.

---

## Modified the author field to forge a review
In the intercepted request, I replaced the legitimate author name with the name of another user. The server did not verify whether the submitted author matched the authenticated user.  
Sending the modified request resulted in a forged review appearing under a different user’s name.

---

## Tools used
- Burp Suite (request interception and modification)
- Firefox DevTools (initial inspection)

---

## Vulnerability
- Broken Access Control / IDOR  
- Affected component: Product Review API  
- Severity: High

---

## Risks
- Fake or fraudulent reviews  
- Manipulation of user identities  
- Reputational damage

---

## Actions
- Enforce server-side validation to ensure the review author matches the authenticated user  
- Remove user-controlled author fields from the request payload  
- Implement strict authorization checks on all review-related endpoints
