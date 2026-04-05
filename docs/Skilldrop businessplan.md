+-----------------------------------------------------------------------+
| **SKILLDROP**                                                         |
|                                                                       |
| Business Plan & Entwicklungsroadmap                                   |
|                                                                       |
| Erstellt: April 2026 \| 5h/Woche \| Ziel: Passives Einkommen          |
+-----------------------------------------------------------------------+

**1. Das Konzept**

SkillDrop ist eine Plattform, auf der Menschen ihr Spezialwissen als
kurze wöchentliche \'Drops\' verkaufen --- ohne einen ganzen Kurs
erstellen zu müssen. Abonnenten zahlen CHF 3--8 pro Monat und erhalten
wöchentliche Audio-, Text- oder Video-Snippets zu einem Thema.

**1.1 Das Problem**

-   Jeder Mensch hat Wissen, das andere zahlen würden

-   Aber niemand will einen vollständigen Kurs erstellen

-   Bestehende Plattformen sind zu aufwändig oder zu generisch

**1.2 Die Lösung**

-   5-Minuten-Format: kein Produktionsdruck, keine langen Videos

-   Wöchentliche Drops: einfach, regelmässig, skalierbar

-   Discover-Feed: neue Creator werden automatisch vorgeschlagen

**1.3 Vergleich mit Konkurrenz**

  -----------------------------------------------------------------------
  **Plattform**      **Problem**            **Wie SkillDrop es löst**
  ------------------ ---------------------- -----------------------------
  Substack           Nur Text, keine        Audio/Video + Discover-Feed
                     Discovery              

  Patreon            Zu viel Aufwand für    5-Min-Format, kein Druck
                     Creator                

  YouTube            Kostenlos, kein        Paywall von Anfang an
                     stabiles Einkommen     

  Udemy              Kurs muss komplett     Wöchentliche Drops, kein Kurs
                     fertig sein            nötig
  -----------------------------------------------------------------------

**2. Wie du Geld verdienst**

**2.1 Als Platform-Betreiber (20% von allem)**

Du nimmst automatisch 20% von jeder Transaktion. Stripe verarbeitet
alles im Hintergrund --- du musst nichts manuell tun.

  -------------------------------------------------------------------------
  **Creator**     **Ø             **Ø             **Dein Anteil (20%)**
                  Abonnenten**    Preis/Monat**   
  --------------- --------------- --------------- -------------------------
  10 Creator      50 Abos         CHF 5.00        CHF 500/Monat

  50 Creator      80 Abos         CHF 5.00        CHF 4\'000/Monat

  200 Creator     100 Abos        CHF 6.00        CHF 24\'000/Monat
  -------------------------------------------------------------------------

**2.2 Als Creator (du selbst)**

Da du Webentwicklung, Spring Boot und Deployment kennst, könntest du
selbst ein Creator sein und dev-Tipps verkaufen.

  -----------------------------------------------------------------------
  **Abonnenten**    **Preis**         **Dein Anteil     **Monatlich**
                                      (80%)**           
  ----------------- ----------------- ----------------- -----------------
  20 Abos           CHF 5.00          80%               CHF 80/Monat

  50 Abos           CHF 5.00          80%               CHF 200/Monat

  100 Abos          CHF 6.00          80%               CHF 480/Monat
  -----------------------------------------------------------------------

**2.3 Geldfluss**

So funktioniert eine Zahlung auf der Plattform:

  --------------------------------------------------------------------------
  **Schritt**   **Was passiert**               **Wer bekommt was**
  ------------- ------------------------------ -----------------------------
  1             Abonnent zahlt CHF 5.00/Monat  Stripe verarbeitet Zahlung

  2             Stripe zieht Gebühr ab (\~CHF  Verbleiben \~CHF 4.60
                0.40)                          

  3             80% geht an Creator            Creator bekommt \~CHF 3.68

  4             20% geht an Platform           Du bekommst \~CHF 0.92
  --------------------------------------------------------------------------

**2.4 Zusätzliche Einnahmen (später)**

-   Boost-Feature: Creator zahlen CHF 10--20 für mehr Sichtbarkeit im
    Feed

-   Bundle-Abos: 3 Creator für CHF 12 statt CHF 15 --- mehr Abonnenten,
    mehr Umsatz

-   Premium-Creator-Badge: Einmalige Gebühr für verifizierten Status

**3. Wann kommen die ersten CHF?**

  ------------------------------------------------------------------------
  **Zeitpunkt**   **Meilenstein**                **Realistische
                                                 Einnahmen**
  --------------- ------------------------------ -------------------------
  Woche 8         App ist live auf Coolify       CHF 0 (noch keine
                                                 Creator)

  Woche 9         Erste 3--5 Creator online      CHF 0--50/Monat

  Woche 10        Erste Abonnenten               CHF 50--100/Monat

  Monat 3         10--20 Creator aktiv           CHF 100--500/Monat

  Monat 6         50+ Creator, Boost-Feature     CHF 500--2\'000/Monat
                  live                           

  Monat 12        200+ Creator                   CHF 2\'000--10\'000/Monat
  ------------------------------------------------------------------------

**4. Entwicklungsplan (5h/Woche)**

**Phase 1 --- Fundament (Woche 1--4)**

Ziel: Grundgerüst steht und läuft lokal. Benutzer können sich
registrieren und ein Abo abschliessen.

  -------------------------------------------------------------------------
  **Woche**   **Aufgabe**            **Zeit**   **Details**
  ----------- ---------------------- ---------- ---------------------------
  Woche 1     Spring Boot Setup      5h         User, Creator, Subscriber
                                                Entities, DB-Schema, MySQL

  Woche 2     JWT Authentifizierung  5h         Copy-paste von LinkHub +
                                                anpassen, SecurityConfig

  Woche 3     Stripe Integration     5h         Stripe Account, Abo-Logik,
                                                Webhook lokal testen

  Woche 4     React Frontend Basis   5h         Login, Registrierung,
                                                Creator-Profil, Abo-Button
  -------------------------------------------------------------------------

**Phase 2 --- MVP (Woche 5--10)**

Ziel: Erste echte Creator onboarden, erste CHF verdienen.

  -------------------------------------------------------------------------
  **Woche**   **Aufgabe**            **Zeit**   **Details**
  ----------- ---------------------- ---------- ---------------------------
  Woche 5     Drop-Upload            5h         Text + Audio Upload,
                                                Cloudflare R2 einrichten

  Woche 6     Subscriber-Feed        5h         Nur sichtbar nach Zahlung,
                                                JWT-geschützt

  Woche 7     Discover-Page          5h         Neue Creator entdecken,
                                                Suche, Kategorien

  Woche 8     Deployment             5h         Coolify, Domain, SSL,
                                                Staging + Production

  Woche 9     Creator Onboarding     5h         3--5 Freunde/Bekannte als
                                                erste Creator gewinnen

  Woche 10    Bugfixes & Feedback    5h         Feedback sammeln, erste
                                                Abonnenten gewinnen
  -------------------------------------------------------------------------

**Phase 3 --- Wachstum (Woche 11--20)**

Ziel: Stabile monatliche Einnahmen, mehr Creator, mehr Features.

  -----------------------------------------------------------------------
  **Wochen**    **Aufgabe**            **Details**
  ------------- ---------------------- ----------------------------------
  11--13        Marketing              Creator auf LinkedIn, TikTok,
                                       Instagram promoten

  14--15        Boost-Feature          Creator zahlen CHF 10--20 für mehr
                                       Sichtbarkeit

  16--17        Bundle-Abos            3 Creator günstiger im Paket
                                       kaufen

  18--20        Creator Dashboard      Analytics, Auszahlungsübersicht,
                                       Statistiken
  -----------------------------------------------------------------------

**5. Tech Stack**

Da du Spring Boot + React + Coolify bereits von LinkHub kennst, ist der
Stack fast identisch.

  ---------------------------------------------------------------------------
  **Bereich**         **Technologie**    **Warum**
  ------------------- ------------------ ------------------------------------
  Backend             Spring Boot (Java) Kennst du bereits, JWT Auth
                                         wiederverwendbar

  Frontend            React + Vite +     Kennst du bereits von LinkHub
                      TypeScript         

  Datenbank           MySQL              Kennst du bereits, Coolify managed
                                         DB

  Authentifizierung   JWT + Spring       1:1 von LinkHub übernehmen
                      Security           

  Zahlungen           Stripe API         Standard, gut dokumentiert, \~1
                                         Woche lernen

  File Storage        Cloudflare R2      Günstig, S3-kompatibel, einfach
                                         einzurichten

  Email               Resend API         Kennst du bereits von LinkHub

  Deployment          Coolify (VPS)      Hast du bereits laufen, Staging +
                                         Production
  ---------------------------------------------------------------------------

**5.1 Neu dazulernen**

-   Stripe API --- ca. 1 Woche Einarbeitung, sehr gut dokumentiert

-   Cloudflare R2 --- ca. 2--3 Stunden, S3-kompatible API

-   Kein Framework-Wechsel notwendig --- alles baut auf deinem
    bestehenden Wissen auf

**6. Datenbank-Schema**

Minimales Schema für das MVP --- erweiterbar nach Bedarf.

**Tabellen-Übersicht**

  -------------------------------------------------------------------------
  **Tabelle**        **Wichtigste Felder**      **Beschreibung**
  ------------------ -------------------------- ---------------------------
  users              id, email, password, role, Alle Benutzer (Creator +
                     createdAt                  Subscriber)

  creator_profiles   id, userId, bio, category, Creator-spezifische Daten
                     pricePerMonth              

  drops              id, creatorId, title,      Inhalte (Text/Audio/Video)
                     type, fileUrl, publishedAt 

  subscriptions      id, subscriberId,          Aktive Abos
                     creatorId, stripeSubId,    
                     status                     

  payments           id, subscriptionId,        Zahlungshistorie
                     amount, platformFee,       
                     creatorPayout              
  -------------------------------------------------------------------------

**7. Risiken & Lösungen**

  ---------------------------------------------------------------------------------
  **Risiko**             **Wahrscheinlichkeit**   **Lösung**
  ---------------------- ------------------------ ---------------------------------
  Zu wenige Creator am   Hoch                     Selbst als erster Creator starten
  Anfang                                          

  Creator wechseln zu    Mittel                   Bessere Discovery +
  Substack                                        Community-Aspekt

  Stripe-Gebühren        Niedrig                  Erst ab CHF 2\'000/Monat relevant
  fressen Marge                                   

  Zu wenig Zeit für      Mittel                   LinkHub-Code wiederverwenden, MVP
  Entwicklung                                     klein halten

  Rechtliches (MwSt,     Niedrig                  MwSt erst ab CHF 100k Umsatz,
  AGB)                                            AGB-Template nutzen
  ---------------------------------------------------------------------------------

**8. Die 3 wichtigsten Erfolgsfaktoren**

  ----------------------------------------------------------------------------
  **\#**   **Faktor**             **Was das bedeutet**
  -------- ---------------------- --------------------------------------------
  1        Nicht perfekt, sondern Version 1 darf hässlich sein --- Feedback
           schnell live           ist wichtiger als Perfektion

  2        Creator sind dein      Je besser die Creator, desto mehr Abonnenten
           Produkt                --- Creator zuerst gewinnen

  3        LinkHub-Code           JWT, Deployment, Spring Boot --- fast alles
           wiederverwenden        ist schon gebaut
  ----------------------------------------------------------------------------

*SkillDrop --- Passives Einkommen durch Wissen \| April 2026*