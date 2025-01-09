<h2>Sistem automat de ventilatie a serelor</h2>

<p>În ultimele decenii, tehnologiile IoT (Internet of Things) au revoluționat multiple domenii, inclusiv agricultura. Automatizarea serelor este o aplicație esențială a IoT, contribuind la monitorizarea și controlul condițiilor de mediu pentru creșterea eficienței și productivității agricole. Acest proiect propune dezvoltarea unui sistem de ventilație "inteligent" pentru solarii, care monitorizează și reglează temperatura și umiditatea în timp real.</p>

<p>Sistemul utilizează o combinație de hardware (ESP8266, DHT11, releu, servomotor și motor DC) și software (server cloud cu Java Spring Boot și aplicație mobilă cu React Native). Comunicarea între componentele sistemului este asigurată prin protocoale HTTP și WebSocket.</p>

<h3>Cum functioneaza</h3>
<p>Deci, sistemul a fost gandit pentru controlul ventilatiei dintr-o sera, pe timpul verii. Proiectul consta in 3 parti, partea hardware, partea de server cloud, si partea de client / aplicatie mobile. Din aplicatia mobile, poti seta si monitoriza temperatura din interiorul serei. Modul de functionare e in felul urmator: in serverul cloud facut in Java Spring Boot, este creat un server WebSocket, care permite conectarea si transmiterea datelor in timp real. Placuta Arduino si Clientul sunt conectate la Server-ul Cloud. Placuta Arduino, dupa conectarea la server, incepe sa trimita mesaje cu valorile de pe senzor-ul DHT11, odata la 0.2 secunde. Deoarece aplicatia mobile este conectata la server, aceasta primeste odata la 0.2 secunde datele. Prin intermediul aplicatie, poti sa setezi o temperatura dorita, si un threshold, in jurul caruia sa jongleze temeratura. Daca temperatura trece peste temperatura dorita, se deschide geamul, cu ajutorul servemotorului. Daca temperatura trece peste temperatura dorita, plus threshold, atunci se va porni ventilatorul. Acesta din urma se va opri, cand temperatura ajunge sub temperatura dorita, minus threshold. Mai e si posibilitatea de a testa ventilatorul, sa vezi daca functioneaza ok, tot din aplicatie. Pentru primirea comenzilor din aplicatia, se face cu ajutorul HTTP-ului, aplicatia trimite comanda catre server, i-ar server-ul trimite catre placuta Arduino.</p>

<h3>Partea Hardware</h3>

<img src="https://github.com/user-attachments/assets/535cedbf-f1ae-4b49-b12c-efd07a3fdb4e" width="60%" height="60%">
<img src="https://github.com/user-attachments/assets/202080a5-b690-4e0b-8647-5451e09af809" width="60%" height="60%">

LED-ul albastru indica ca este conectata la Server.

<h3>Aplicatie Mobile</h3>
<img src="https://github.com/user-attachments/assets/5194ec3f-58dd-4914-9f86-261db87d9e76" width="30%" height="30%">
<img src="https://github.com/user-attachments/assets/dd451693-485f-4094-8d1f-6548b047537b" width="30%" height="30%">
<img src="https://github.com/user-attachments/assets/e8ee778f-ec01-4180-ba88-884de7bc66f9" width="30%" height="30%">
<img src="https://github.com/user-attachments/assets/ac96718e-54a0-4aa5-964d-b3833d5ab4a0" width="30%" height="30%">
<img src="https://github.com/user-attachments/assets/a719b89e-d0fb-42ce-a23c-038757cbb098" width="30%" height="30%">
