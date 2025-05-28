# Pipeline processor
Think of this like an assembly line where data flows through multiple stages. Each stage transforms the data in some way before passing it to the next stage.

**Chain multiple transformations:** You have a series of functions that each modify the data:
* Stage 1: might validate input
* Stage 2: might normalize the data
* Stage 3: might enrich it with additional info
* Stage 4: might format the output

The data flows from one transformation to the next in sequence.

**Early Exit Conditions:** This is the key part - at any stage, you might want to stop the pipeline entirely based on some condition:
* If validation fails, don't continue processing
* If data is missing required field, exit early
* If some business rule isn't met, halt the pipeline
* Or maybe you found what you were looking for and don't need further processing

**The CPS Challenge:** In regular programming, you might use exceptions or return special values to exit early. But in CPS you need to:
* Pass the data through continuations from stage to stage
* Each transformation needs both a "continue" and "exit early" condition
* Handle both successful transformations and early exits properly
* Chain everything together so data flows smoothly through the pipeline

Think about a pipeline where each stage can either:
* Transform the data and pass it to the next stage.
* Decide to exit early (with either success or failure)

Your pipeline processor would cooridate all of this, managing the flow and handling early exists gracefully.

## Problem statement
Build a pipeline processor that handles user registration through multiple validation and transformation steps. The pipeline should process user data through these stages:
1. **Input validation:** Check if required fields (email, password, username) are present.
2. **Email Format Check:** Validate email format using a simple regex
3. **Password strength:** Ensure password meets minimum requirements (length, etc.)
4. **Username availability:** Simulate checking if username is already taken
5. **Data sanitization:** Clean and Normalize the user data
6. **Account creation:** Simulate creating the user account

### Early Exit Conditions
* Stop if any required field is missing
* Stop if email format is invalid
* Stop if password is too weak
* Stop if username is already taken
* Continue only if all validations pass

### Expected Behavior
* If everything succeeds: return the processed user object.
* If any stage fails: return an error object with details about which stage failed and why
* Each stage should be a separate transformation function.
* This pipeline should handle both success and failure paths clearly.

### Sample Input
```
{
  email: "user@example.com",
  password: "mypassword123",
  username: "cooluser",
  firstName: "John",
  lastName: "Doe"
}
```

Your pipeline processor should orchestrate these transformations in CPS style, with each stage having the ability to either continue to the next stage or exit early with an appropriate message.