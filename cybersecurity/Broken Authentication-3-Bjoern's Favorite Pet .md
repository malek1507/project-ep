## Analyzed user information and attempted to gather clues
I initially tried to solve the challenge by checking product reviews and searching through different items to see if Bjoern had left any personal information that could help answer his security question. After several attempts, none of the product pages contained useful data.

---

## Searched for hints using the built-in search feature
Since manual inspection didn’t reveal anything, I used the application’s search bar to look for clues related to Bjoern. Searching his name led me to a hint page containing a video demonstration of him logging into the site.

---

## Identified the answer from the login video
After watching the video closely, I noticed that during his login process, the name of his pet was visible: “Zaya.”  
This matched the expected answer for his account’s security question.

---

## Used the security question to reset the password
I accessed the password reset feature, entered his email, and provided “Zaya” as the correct answer. The application accepted it, allowing me to reset Bjoern’s password and log into his account.

---

## Tools used
- Built-in search feature
- Browser video playback

---

## Vulnerability
- Broken Authentication / Weak Security Questions  
- Affected component: Account recovery via security questions  
- Severity: High

---

## Risks
- Unauthorized account takeover  
- Exposure of personal information  
- Reputational damage

---

## Actions
- Avoid using easily guessable or publicly visible security questions  
- Replace security questions with stronger identity verification methods
