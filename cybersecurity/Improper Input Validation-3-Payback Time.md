## Analyzed the product purchase logic
I examined how the application calculates total prices during checkout. Since item prices are always positive, I considered whether manipulating the quantity value could affect the final cost. I inspected the purchase request in DevTools and then intercepted it using Burp Suite to see how the backend handled quantity input.

---

## Tested the effect of negative input values
Based on basic logic—positive quantity increases cost, so negative quantity might reduce it—I attempted to modify the quantity field to a negative number. This would test whether the server validated quantity as non-negative input.

---

## Exploited improper input validation by setting a negative quantity
Using Burp Suite, I intercepted the checkout request and changed the quantity of the most expensive product to `-20`.  
The server failed to validate the input and processed the negative value as legitimate, resulting in a negative total price, effectively crediting my account instead of charging it.  
This allowed me to proceed with the purchase while gaining money.

---

## Tools used
- Burp Suite (request interception and modification)
- Firefox DevTools (initial inspection)

---

## Vulnerability
- Improper Input Validation  
- Affected component: Checkout / Pricing logic  
- Severity: High

---

## Risks
- Financial loss due to manipulated transactions  
- Fraudulent purchases  
- Reputational damage

---

## Actions
- Validate quantity server-side to ensure it is always a positive integer  
- Reject or sanitize negative or zero values before processing  
- Implement business logic checks to ensure final prices cannot be negative
