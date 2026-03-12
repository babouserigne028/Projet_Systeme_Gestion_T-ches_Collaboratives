from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from backend_app.models import Tache
from django.core.mail import send_mail
from django.conf import settings

class Command(BaseCommand):
    help = "Envoie des rappels pour les tâches dont la date limite est demain"

    def handle(self, *args, **kwargs):
        demain = timezone.now().date() + timedelta(days=1)
        from datetime import datetime
        start = datetime.combine(demain, datetime.min.time())
        end = datetime.combine(demain, datetime.max.time())

        taches = Tache.objects.filter(
            date_echeance__gte=start,
            date_echeance__lte=end,
            assigne_a__isnull=False,
            statut='a_faire'
        ).select_related('assigne_a', 'projet')

        if not taches.exists():
            self.stdout.write('Aucune tâche à rappeler.')
            return

        for tache in taches:
            user = tache.assigne_a
            sujet = f'⚠️ Rappel : Tâche "{tache.titre}" expire demain !'
            message = f"""
Bonjour {user.prenom},

La tâche suivante expire demain :

  → Projet  : {tache.projet.titre}
  → Tâche   : {tache.titre}
  → Date limite: {tache.date_echeance.strftime('%d/%m/%Y %H:%M')}

Merci de la compléter à temps.

Cordialement,
Gestion des Tâches
            """

            # En DEV : afficher le mail au lieu d'envoyer
            self.stdout.write(f'FAKE EMAIL: {user.email}\nSujet: {sujet}\n{message}\n')

            # En PROD : décommente pour envoyer
            # send_mail(sujet, message, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=True)

        self.stdout.write(f'\n✅ {taches.count()} rappel(s) généré(s).')