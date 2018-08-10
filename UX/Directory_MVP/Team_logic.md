# What needs to be done for the _Directory_  MVP:

### Add the Team Management Feature

### As a **user**, I should be able to :
- Request to join or be unassgined from a team.
- See my team (other members, team name, etc...)

### As a **supervisor** I should be able to:
- Add and remove my employees from one of my teams
- Delete any of my teams
- Alter the name of my teams
- Transfer ownership of a team to a different supervisor
  

#
# Team Logic: how I believe it works


### Creating teams and having employees

 - The power to create team is locked behind the supervisor.  
 - Only a supervisor can have his own set of employees.  
 

### how power flows, revoking supervisor rights

- A supervisor hold all the power over his teams and his employees.  
- This power may be revoke by his supervisor, who would inherit both the teams and the employees.

### Ownership transfer

- A transfer of team ownership occurs when a supervisors wishes to give both team and the members of the team to either:  
  - His supervisor.  
  - A supervisor that is also under his supervisor.

### Belonging to a team and becoming a supervisor  
- An employee can only be part of one team at a time and can only belong to a team owned by his supervior.
- An employees can make a request to his supervisor to become a supervisor.  

    

<!-- https://www.draw.io/?lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=Untitled%20Diagram.xml#R3VjJdpswFP0aL9vDYBNnmThOenralZsOSxkeoEZIVIjY7tdXAskgg4c22E3rBYb7NL57r5AY%2BbNs%2FcBRnn5kEZCR50TrkX838ryJ68mrAjYacIIaSDiOashtgAX%2BCRp0NFriCAqroGCMCJzbYMgohVBYGOKcrexiMSN2rzlKoAMsQkS66BccibRGpxOnwd8BTlLTs%2BvoyBKFTwlnJdX9jTw%2Frn51OEOmLV2%2BSFHEVi3In4%2F8GWdM1HfZegZEpdakra53vye6HTcHKk6poHl6RqQEM%2BJqXGJjclHNBlR5d%2BTfrlIsYJGjUEVXknyJpSIjOhxjQmaMMF7V9SME0ziUeCE4e4JWJAinsIxlpDtiPYln4ALWLUjP4AFYBoJvZBEd9SZ1DS0219C0alFnCEpbtI2vNYi0XJJt003K5I3OWn8G%2FZ4MBkSoXDA5o3Yqgx8lM4E3RSX6G1lAzn7dBOVdov%2BrVpa7QGmARZkDf8aFTKkOybGWu8Ul1mliyXtK1cM18I4IJBPCZtpmlDIKB%2BhHBCdUYqEkGWTwVpGLpd9udCDDUaT66tVXo0BnGMH4xn5GMVddxWzXIksxAwhmfF7LybXGC3stFwXLYBIMk8GJncDtetZKoN9nOT8YIIOTvZbrKH0YD25N9VhI9Xr38ywnbANwxHe2o%2Frs%2BHKXaeiVGcwd7%2Bhj3NWH6%2FXpYwB5BHvlUeSInqIGNzhpRX7PMMU0UcNVGxRA2aFFV2J1%2F3vIt0k4YvoBOLq235q%2Be%2BIaOISDry5F0SNFRaEc8DvEbNt4wTBQphijy0L9xZxlR1XyyuQwvaAcpkf3UOaEYDLtHuT%2BT3n7jGFVGfo%2BQxQltbc3rOSauOKIjA5uoS5N6PjKOc5ocCZGjVL%2BOqV3QEDURKo3pbzG%2FxGn456jzvk4dV8Jp584okWsdmIOW1HgRYrzf5nFSc%2Fu%2BXws%2Bp35Q5TAQj8yLlKWMIrIvEF3NoitbMAai6%2Bt%2B2%2BqyFu5Q5ePVI5sG1MPreB3EGKjv%2FugUjAJNT1%2FYCw%2Flu1COjgE6zwgEE9AWJCa2UFGOBAk8LP92edF6d1%2FOLmsSWYckICeXUfv4f8SnukYpIfY099mfdvVgTwjH5svcFWs9ZXTn%2F8C -->