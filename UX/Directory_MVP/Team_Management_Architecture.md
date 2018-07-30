# Team Management Architecture

## **Viewing/Managing a Team**

### **Data required**
- All data pertaining to a single team
- List of users that are under your supervision

### **Functionality and UI update requirements**
- Changing french name => requires ID update of OrgTier
- Remove/Adding individuals => requires ID update of OrgTier or refetching of User query

#

## **Deleting a Team**

### **Data required**
- ID of the team to delete

### **Functionality and UI update requirements**
- deletion button => requires a refetch of User query

#

## **Transfer Ownership**

### **Data required**
- ID of the manager
- ID of other users under your supervisors that are themselves supervisors (optional)

### **Functionality and UI update requirements**
- Transfer button => requires a refetch of User query
