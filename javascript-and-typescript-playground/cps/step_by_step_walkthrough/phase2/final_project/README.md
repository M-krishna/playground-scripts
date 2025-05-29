# Validation Library
Build a **Validation Library** where you chain validation rules, accumulate errors, and only proceed if all validations pass.

## Project Overview
You'll create a validation library that:

* Chains multiple validation rules together
* Accumulate all validation errors (doesn't fail fast)
* Only executes success logic if ALL validations pass
* Uses CPS to handle the flow control

## Core Concept
Instead of throwing exceptions or returning early, you'll pass success/failure continuations through your validation chain. Each validator will either:
* Call the success continuation if validation passes
* Call the failure continuation if validation fails
* Accumulate errors without stopping the chain