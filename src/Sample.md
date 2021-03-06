```mermaid
C4Component
    Person_Ext(customer, "Customer", "A customer of the bank,`with personal bank accounts")
    Enterprise_Boundary(e1, "Big Co") {
        System_Boundary(c1, "Internet Banking") {
            Container(web_app, "Web Application", "Delivers the static content`and the Internet banking SPA", "Java, Spring MVC")
            Container(spa, "Single-Page App", "Provides all the Internet banking`functionality to cutomers`via their web browser", "JavaScript, Angular")
            Container(mobile_app, "Mobile App", "Provides a limited subset`of the Internet banking`functionality to customers`via their mobile device", "C#, Xamarin")
            ComponentDb(database, "Database", "Stores user registration`information, hashed auth credentials,`access logs, etc.", "SQL Database")
            Container(backend_api, "API Application", "Provides Internet banking`functionality via API", "Java, Docker Container")
        }
        System(banking_system, "Mainframe Banking System", "Stores all of the core`banking information about`customers, accounts, transactions, etc.")
    }
    System_Ext(email_system, "E-Mail System", "The internal`Microsoft Exchange system")
    Rel(customer, web_app, "Uses", "HTTPS")
    Rel(customer, spa, "Uses", "HTTPS")
    Rel(customer, mobile_app, "Uses")
    Rel(web_app, spa, "Delivers")
    Rel(spa, backend_api, "Uses", "async, JSON/HTTPS")
    Rel(mobile_app, backend_api, "Uses", "async, JSON/HTTPS")
    Rel(database, backend_api, "Reads from and writes to", "sync, JDBC")
    Rel(email_system, customer, "Sends e-mails to")
    Rel(backend_api, email_system, "Sends e-mails using", "sync, SMTP")
    Rel(backend_api, banking_system, "Uses", "sync/async, XML/HTTPS")

```