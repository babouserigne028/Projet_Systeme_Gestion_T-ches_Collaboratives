# README - Test de l'envoi d'email automatique (Admin)

## Objectif

Ce guide explique comment tester l'envoi automatique d'email de rappel des deadlines pour les tâches, via la commande Django et Celery.

---

## 1. Prérequis

- Python ≥ 3.12
- Django installé
- Redis en fonctionnement (pour Celery)
- Serveur SMTP configuré dans `backend_project/settings.py` (ex : Gmail, Mailtrap, etc.)

---

## 2. Configuration SMTP

Dans `backend_project/settings.py`, vérifiez ou ajoutez :

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'  # ou autre
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'votre.email@gmail.com'
EMAIL_HOST_PASSWORD = 'votre_mot_de_passe'
```

---

## 3. Lancer le backend et Celery

1. Activez l'environnement virtuel :
   ```bash
   cd Backend_Django
   source env/bin/activate
   ```
2. Démarrez le serveur Django :
   ```bash
   python manage.py runserver
   ```
3. Démarrez Celery worker et beat :
   ```bash
   celery -A backend_project worker -l info
   celery -A backend_project beat -l info
   ```

---

## 4. Tester la commande manuelle

Vous pouvez tester l'envoi d'email sans attendre le cron en lançant la commande :

```bash
python manage.py rappel_deadlines
```

Cela exécutera le script qui envoie un email de rappel aux utilisateurs ayant une tâche qui expire demain.

---

## 5. Vérification

- Vérifiez la boîte mail de l'utilisateur concerné.
- Consultez les logs Celery/Django pour voir les messages d'envoi.
- En cas d'erreur, vérifiez la configuration SMTP et les permissions.

---

## 6. Dépannage

- Utilisez `EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'` pour afficher les emails dans la console (utile pour tests locaux).
- Vérifiez que Redis est bien lancé.
- Vérifiez que les tâches Celery sont bien enregistrées.

---

## 7. Exemple de résultat

L'utilisateur reçoit un email :

> Bonjour {prenom},
> La tâche suivante expire demain : {titre_tache}
> Merci de la compléter à temps.

---

## 8. Pour aller plus loin

- Personnalisez le template d'email dans `rappel_deadlines.py`.
- Ajoutez des tests unitaires pour valider le fonctionnement.

---

**Contact :** Pour toute question, contactez l'administrateur du projet.
