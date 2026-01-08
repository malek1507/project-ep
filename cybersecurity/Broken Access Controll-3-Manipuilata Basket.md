## Analyzed the basket manipulation mechanism
Since I already understood how POST requests work from earlier challenges, I inspected the “Add to Basket” functionality to see how the application references each user’s basket. I intercepted the relevant requests to determine whether the basket ID could be modified manually.

---

## Attempted direct IDOR by modifying the BasketId
My first approach was to change the `basketId` field in the intercepted request to access another user’s basket directly.  
However, this resulted in a `401 Unauthorized` error, which indicated that the server correctly enforced access control on single-ID manipulation attempts.

---

## Bypassed access control through multi-basket injection
Using Burp Suite, I modified the intercepted request to include multiple “Add to Basket” operations for different basket IDs inside the same request body.  
Submitting this combined payload caused the server to incorrectly interpret the request and apply one of the unauthorized basket operations successfully, allowing me to manipulate another user’s basket.

---

## Tools used
- Burp Suite (manual request modification)
- Firefox DevTools (initial inspection)

---

## Vulnerability
- Broken Access Control / Logic Flaw  
- Affected component: Basket API  
- Severity: High

---

## Risks
- Unauthorized manipulation of other users’ shopping baskets  
- Fraudulent purchases or item removals  
- Reputational damage

---

## Actions
- Validate each basket operation individually on the server side  
- Reject batched operations that reference multiple different Basket IDs  
- Implement strict authorization checks tied to the authenticated user's basket only
