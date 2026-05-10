# Flick-exchange v1.1.0

Application de transfert d'argent Bénin ↔ Russie

## 🚀 Déploiement sur GitHub Pages

### Option 1 : GitHub Actions (Automatique)

1. Push ce repo sur GitHub
2. Va dans **Settings** → **Pages** → **Source** : sélectionne **GitHub Actions**
3. À chaque push sur `main`, le site se rebuild automatiquement

### Option 2 : Manuel (gh-pages)

```bash
npm install
npm run build
npm run deploy
```

Puis dans Settings → Pages → Source : sélectionne la branche `gh-pages`.

## 💻 Développement local

```bash
npm install
npm start
```

## 📝 Note importante

Cette version utilise **HashRouter** (au lieu de BrowserRouter) pour être compatible avec GitHub Pages. Les URLs contiendront un `#` :
- `https://ton-username.github.io/flick-exchange/#/`
- `https://ton-username.github.io/flick-exchange/#/login`
- `https://ton-username.github.io/flick-exchange/#/transfer`

## ✅ Fonctionnalités v1.1.0

- Transferts Bénin ↔ Russie
- Détection auto réseau mobile (MTN, Moov, Celtiis)
- PIN de validation
- Destinataires favoris
- Upload de reçu de paiement
- Mode sombre
- Calculatrice publique
- Limites selon vérification d'identité
- Recherche dans l'historique
- Téléchargement de reçu
- Compteur de notifications
- Dashboard admin avec stats par devise
- Vue réduite/développée des transferts admin

## 👑 Compte admin

Créez un compte avec un email contenant "admin" (ex: admin@test.com)
