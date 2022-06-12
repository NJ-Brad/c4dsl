<!--c4dsl
workspace 
[
    items
    [
        external_person customer "Customer" ("A customer of the bank,`with personal bank accounts")
        enterprise e1 "Big Co"
        [
            system c1 "Internet Banking"
            [
                Container web_app "Web Application" utilizing "Java, Spring MVC" ("Delivers the static content`and the Internet banking SPA")
                Container spa "Single-Page App" utilizing "JavaScript, Angular" ("Provides all the Internet banking`functionality to cutomers`via their web browser")
                Container mobile_app "Mobile App" utilizing "C#, Xamarin" ("Provides a limited subset`of the Internet banking`functionality to customers`via their mobile device")
                Database database "Database" utilizing "SQL Database" ("Stores user registration`information, hashed auth credentials,`access logs, etc.")
                [
                    Table table1 "Table 1"
                    Table table2 "Table 2"
                    Table table3 "Table 3"
                ]
                Container backend_api "API Application" utilizing "Java, Docker Container" ("Provides Internet banking`functionality via API")
            ]
            system banking_system "Mainframe Banking System"  ("Stores all of the core`banking information about`customers, accounts, transactions, etc.")
        ]
        external_system email_system "E-Mail System" ("The internal`Microsoft Exchange system")
    ]

    connections
    [
        customer Uses web_app utilizing "HTTPS"
        customer Uses spa utilizing "HTTPS"
        customer Uses mobile_app
        web_app Delivers spa
        spa Uses backend_api utilizing "async, JSON/HTTPS"
        mobile_app Uses backend_api utilizing "async, JSON/HTTPS"
        database "Reads from and writes to" backend_api utilizing "sync, JDBC"
        email_system "Sends e-mails to" customer 
        backend_api "Sends e-mails using" email_system utilizing "sync, SMTP"
        backend_api Uses banking_system utilizing "sync/async, XML/HTTPS"
    ]
]
c4dsl-->


``` mermaid
flowchart TB
    customer["<strong><u>Customer</u></strong><br/>A customer of the bank,<br/>with personal bank account<br/>&#171;External Person&#187;"]
    subgraph e1["<strong><u>Big Co</u></strong><br/>&#171;ENTERPRISE&#187;"]
        subgraph c1["<strong><u>Internet Banking</u></strong><br/>&#171;System Boundary&#187;"]
            web_app["<strong><u>Web Application</u></strong><br/>Delivers the static content<br/>and the Internet banking SP<br/>&#171;Container&#187;"]
            spa["<strong><u>Single-Page App</u></strong><br/>Provides all the Internet banking<br/>functionality to cutomers`via their web browse<br/>&#171;Container&#187;"]
            mobile_app["<strong><u>Mobile App</u></strong><br/>Provides a limited subset<br/>of the Internet banking`functionality to customers`via their mobile devic<br/>&#171;Container&#187;"]
            subgraph database["<strong><u>Database</u></strong><br/>Stores user registration<br/>information, hashed auth credentials,`access logs, etc<br/>&#171;Database Boundary&#187;"]
                table1["<strong><u>Table 1</u></strong><br/>&#171;TABLE&#187;"]
                table2["<strong><u>Table 2</u></strong><br/>&#171;TABLE&#187;"]
                table3["<strong><u>Table 3</u></strong><br/>&#171;TABLE&#187;"]
            end
            backend_api["<strong><u>API Application</u></strong><br/>Provides Internet banking<br/>functionality via AP<br/>&#171;Container&#187;"]
        end
        banking_system["<strong><u>Mainframe Banking System</u></strong><br/>Stores all of the core<br/>banking information about`customers, accounts, transactions, etc<br/>&#171;System&#187;"]
    end
    email_system["<strong><u>E-Mail System</u></strong><br/>The internal<br/>Microsoft Exchange syste<br/>&#171;External System&#187;"]
    customer--"Uses<br>[HTTPS]"-->web_app
    customer--"Uses<br>[HTTPS]"-->spa
    customer--"Uses"-->mobile_app
    web_app--"Delivers"-->spa
    spa--"Uses<br>[async, JSON/HTTPS]"-->backend_api
    mobile_app--"Uses<br>[async, JSON/HTTPS]"-->backend_api
    database--"Reads from and writes to<br>[sync, JDBC]"-->backend_api
    email_system--"Sends e-mails to"-->customer
    backend_api--"Sends e-mails using<br>[sync, SMTP]"-->email_system
    backend_api--"Uses<br>[sync/async, XML/HTTPS]"-->banking_system

```