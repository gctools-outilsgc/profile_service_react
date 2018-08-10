# Architecture Reform for Profile's Backend

## **Current Issues in the Frontend**

### 1- The returned objects of the mutations are not returning unique IDs

- `modifyOrgTier` does not return the `orgId`, which disallows ID based updates in the apollo client.
- `modifyProfile` returns `gcID`, which is not identified in the apollo cache as the ID nor is it an unique identifier to `ProfileType` objects.

### 2- As a supervisor, it is impossible for me to manage my teams because that power lies solely on the user

- Team membership is not something attached to the `OrgTierType` object, but to the user's `org` attribute. 
- To modify an attribute of a `ProfileType`, the mutation `ModifyProfile` requires the access token of the user associate with the profile, which is only available if you login on that user's OpenID account.

## **What Needs to Change**

### - Mutations need to be added to allow supervisors to manage their teams and the allocation of their employees.

### - All mutations must return an ID attribute that can be made unique inside apollo through cache configurations or with a special string when assigning IDs.

## **Proposed Solutions**

###  Change the `modifyOrgTier` object to return the ID of the `OrgTierType` that was changed.

###  Create a new mutation that takes 3 arguments:
- The ID of the profile to be changed => `employeeId`
- the ID of the supervisor of the profile => `supervisorId`
- The information that wishes to be changed => `ModifyProfileInput`

The mutation simply requires that the ID listed on the `supervisor ` attribute of the `ModifyProfileInput` is the same as the one passed as an argument. The **authentification token** asserts that you are the supervisor and that you are logged in.

