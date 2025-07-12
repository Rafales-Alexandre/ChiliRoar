# 🐛 Debug Twitter - Étapes Détaillées

## 📊 Analyse des Logs Actuels

```
Auth state changed: SIGNED_OUT undefined
Session details: null
Utilisateur déconnecté
Auth state changed: INITIAL_SESSION undefined
Session details: null
```

**Diagnostic** : La session n'est pas créée par Supabase après l'autorisation Twitter.

## 🔍 Vérifications Supabase

### 1. Configuration Auth Settings

Dans **Authentication > Settings** :
- ✅ **Site URL** : `https://votre-app.vercel.app`
- ✅ **Redirect URLs** : `https://votre-app.vercel.app/auth/callback`
- ❌ **Disable signup** : **DOIT ÊTRE DÉSACTIVÉ**
- ❌ **Enable email confirmations** : **DOIT ÊTRE DÉSACTIVÉ**

### 2. Configuration Twitter Provider

Dans **Authentication > Providers > Twitter** :
- ✅ **Twitter enabled** : **ACTIVÉ**
- ✅ **Client ID** : Votre Twitter API Key
- ✅ **Client Secret** : Votre Twitter API Secret
- ❌ **Confirm email** : **DÉSACTIVÉ**
- ✅ **Allow unverified email sign-ins** : **ACTIVÉ**

### 3. Vérifications Supplémentaires

**Authentication > Users** :
- Vérifiez si des utilisateurs Twitter sont créés
- Regardez les tentatives d'authentification

**Authentication > Logs** :
- Filtrez par "auth" pour voir les erreurs
- Cherchez les erreurs liées à Twitter

## 🧪 Tests de Diagnostic

### Test 1: Vérifier la Configuration

```javascript
// À exécuter dans la console du navigateur
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Current URL:', window.location.href);
```

### Test 2: Test Manuel d'Authentification

```javascript
// Dans la console du navigateur
const supabase = window.supabase; // Si disponible
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'twitter',
  options: {
    redirectTo: window.location.origin + '/auth/callback'
  }
});
console.log('Test auth:', { data, error });
```

## 🔧 Solutions Possibles

### Solution 1: Vérifier RLS (Row Level Security)

Dans **Database > Authentication > Policies** :
- Vérifiez que les politiques `profiles` permettent INSERT
- Désactivez temporairement RLS pour tester

### Solution 2: Configuration Twitter Developer

Dans **Twitter Developer Portal** :
- **App permissions** : "Read" minimum
- **OAuth 2.0** : Activé
- **Callback URL** : `https://wwozpiufrohpkbuprapd.supabase.co/auth/v1/callback`
- **Website URL** : `https://votre-app.vercel.app`

### Solution 3: Test avec Scopes Différents

Modifier les scopes dans `AuthContext.tsx` :

```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'twitter',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
    scopes: 'users.read tweet.read', // Scopes minimaux
  }
});
```

## 📋 Checklist de Vérification

- [ ] Site URL correct dans Supabase
- [ ] Redirect URLs correct dans Supabase
- [ ] "Disable signup" désactivé
- [ ] "Confirm email" désactivé pour Twitter
- [ ] Callback URL correct dans Twitter Developer
- [ ] OAuth 2.0 activé dans Twitter
- [ ] Pas d'erreurs dans les logs Supabase
- [ ] Variables d'environnement correctes

## 🚨 Actions Immédiates

1. **Vérifiez "Disable signup"** dans Supabase Auth Settings
2. **Regardez les logs Supabase** pour les erreurs
3. **Testez avec des scopes minimaux**
4. **Vérifiez les politiques RLS**

## 📞 Prochaine Étape

Si le problème persiste, nous devrons :
1. Examiner les logs Supabase détaillés
2. Tester avec un autre provider (Google) pour isoler le problème
3. Vérifier la configuration réseau/CORS 