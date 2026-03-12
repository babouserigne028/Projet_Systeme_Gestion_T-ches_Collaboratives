import shutil
import os
from django.conf import settings
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from backend_app.models import Utilisateur, Projet, Tache, Collaborateur

class Command(BaseCommand):
    help = "Seed la base de données avec des données de test"

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true', help='Supprimer les données existantes avant le seed')

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write("Suppression des données existantes...")
            Tache.objects.all().delete()
            Collaborateur.objects.all().delete()
            Projet.objects.all().delete()
            Utilisateur.objects.filter(is_superuser=False).delete()

            # Nettoyer les photos orphelines
            photos_dir = os.path.join(settings.MEDIA_ROOT, 'photos')
            if os.path.exists(photos_dir):
                shutil.rmtree(photos_dir)
                os.makedirs(photos_dir)
                self.stdout.write("Photos nettoyées.")

        self.stdout.write("Création des utilisateurs...")
        
        # Administrateur
        admin, created = Utilisateur.objects.get_or_create(
            email="serigne.babou@esmt.com",
            defaults={
                "nom": "Babou",
                "prenom": "Serigne Abdoulaye",
                "telephone": "771651137",
                "role": "administrateur",
                "is_active": True,
                "is_staff": True,
                "is_superuser": True,
            }
        )
        if created:
            admin.set_password("passer")
            admin.save()

        # Professeurs
        profs = []
        profs_data = [
            {"email": "fatou.faye@ucad.sn", "nom": "FAYE", "prenom": "Fatou", "telephone": "771234567"},
            {"email": "amadou.diop@ucad.sn", "nom": "DIOP", "prenom": "Amadou", "telephone": "782345678"},
            {"email": "moussa.ndiaye@ucad.sn", "nom": "NDIAYE", "prenom": "Moussa", "telephone": "763456789"},
        ]
        for p in profs_data:
            user, created = Utilisateur.objects.get_or_create(
                email=p["email"],
                defaults={
                    "nom": p["nom"],
                    "prenom": p["prenom"],
                    "telephone": p["telephone"],
                    "role": "professeur",
                    "is_active": True,
                }
            )
            if created:
                user.set_password("Passer123!")
                user.save()
            profs.append(user)

        # Étudiants
        etudiants = []
        etudiants_data = [
            {"email": "awa.ba@ucad.sn", "nom": "BA", "prenom": "Awa", "telephone": "774567890"},
            {"email": "ibrahima.fall@ucad.sn", "nom": "FALL", "prenom": "Ibrahima", "telephone": "785678901"},
            {"email": "mariama.sow@ucad.sn", "nom": "SOW", "prenom": "Mariama", "telephone": "766789012"},
            {"email": "ousmane.dia@ucad.sn", "nom": "DIA", "prenom": "Ousmane", "telephone": "777890123"},
        ]
        for e in etudiants_data:
            user, created = Utilisateur.objects.get_or_create(
                email=e["email"],
                defaults={
                    "nom": e["nom"],
                    "prenom": e["prenom"],
                    "telephone": e["telephone"],
                    "role": "etudiant",
                    "is_active": True,
                }
            )
            if created:
                user.set_password("Passer123!")
                user.save()
            etudiants.append(user)

        self.stdout.write("Création des projets...")
        
        now = timezone.now()
        projets_data = [
            {"titre": "Système IA de recommandation", "description": "Développer un moteur de recommandation", "createur": profs[0]},
            {"titre": "Application mobile santé", "description": "App de suivi médical", "createur": profs[1]},
            {"titre": "Plateforme e-learning", "description": "Système de cours en ligne", "createur": etudiants[0]},
        ]
        
        projets = []
        for pd in projets_data:
            projet, _ = Projet.objects.get_or_create(
                titre=pd["titre"],
                defaults={"description": pd["description"], "createur": pd["createur"]}
            )
            projets.append(projet)

        self.stdout.write("Ajout des collaborateurs...")
        
        # Ajouter des collaborateurs
        collabs = [
            (projets[0], etudiants[0]),
            (projets[0], etudiants[1]),
            (projets[1], etudiants[2]),
            (projets[2], profs[2]),  # superviseur
        ]
        for projet, user in collabs:
            Collaborateur.objects.get_or_create(projet=projet, user=user)

        self.stdout.write("Création des tâches (scénarios prime)...")

        from datetime import datetime

        # ── Dates du mois en cours (mars 2026) pour tester les primes ──
        # Échéances dans le mois courant
        echeance = lambda j: timezone.make_aware(datetime(2026, 3, j, 23, 59, 59))
        complete_avant = lambda j, delta=2: timezone.make_aware(datetime(2026, 3, j - delta, 12, 0, 0))
        complete_apres = lambda j, delta=3: timezone.make_aware(datetime(2026, 3, j + delta, 12, 0, 0))

        taches_data = []

        # ═══════════════════════════════════════════════════════════════
        # PROF FAYE (profs[0]) — 10/10 à temps → 100% → 100 000 XOF
        # ═══════════════════════════════════════════════════════════════
        for i in range(10):
            taches_data.append({
                "titre": f"[FAYE] Tâche {i+1} - Recherche IA",
                "projet": projets[0], "assigne_a": profs[0], "statut": "termine",
                "date_echeance": echeance(10 + i),
                "date_completion": complete_avant(10 + i),  # Complétée AVANT échéance
            })

        # ═══════════════════════════════════════════════════════════════
        # PROF DIOP (profs[1]) — 9/10 à temps → 90% → 30 000 XOF
        # ═══════════════════════════════════════════════════════════════
        for i in range(9):
            taches_data.append({
                "titre": f"[DIOP] Tâche {i+1} - App Santé",
                "projet": projets[1], "assigne_a": profs[1], "statut": "termine",
                "date_echeance": echeance(8 + i),
                "date_completion": complete_avant(8 + i),  # Complétée AVANT échéance
            })
        # 1 tâche complétée EN RETARD
        taches_data.append({
            "titre": "[DIOP] Tâche 10 - App Santé (retard)",
            "projet": projets[1], "assigne_a": profs[1], "statut": "termine",
            "date_echeance": echeance(17),
            "date_completion": complete_apres(17),  # Complétée APRÈS échéance
        })

        # ═══════════════════════════════════════════════════════════════
        # PROF NDIAYE (profs[2]) — 7/10 à temps → 70% → Non éligible
        # ═══════════════════════════════════════════════════════════════
        for i in range(7):
            taches_data.append({
                "titre": f"[NDIAYE] Tâche {i+1} - E-learning",
                "projet": projets[2], "assigne_a": profs[2], "statut": "termine",
                "date_echeance": echeance(5 + i),
                "date_completion": complete_avant(5 + i),  # Complétée AVANT échéance
            })
        # 2 tâches complétées EN RETARD
        for i in range(2):
            taches_data.append({
                "titre": f"[NDIAYE] Tâche {8+i} - E-learning (retard)",
                "projet": projets[2], "assigne_a": profs[2], "statut": "termine",
                "date_echeance": echeance(12 + i),
                "date_completion": complete_apres(12 + i),  # Complétée APRÈS échéance
            })
        # 1 tâche non terminée
        taches_data.append({
            "titre": "[NDIAYE] Tâche 10 - E-learning (en cours)",
            "projet": projets[2], "assigne_a": profs[2], "statut": "a_faire",
            "date_echeance": echeance(25),
            "date_completion": None,
        })

        # ── Quelques tâches pour les étudiants aussi ──
        taches_data.extend([
            {"titre": "Collecte de données", "projet": projets[0], "assigne_a": etudiants[0], "statut": "termine",
             "date_echeance": echeance(20), "date_completion": complete_avant(20)},
            {"titre": "Documentation API", "projet": projets[1], "assigne_a": etudiants[2], "statut": "termine",
             "date_echeance": echeance(15), "date_completion": complete_avant(15)},
            {"titre": "Tests unitaires", "projet": projets[0], "assigne_a": etudiants[1], "statut": "a_faire",
             "date_echeance": echeance(28), "date_completion": None},
            {"titre": "Rédaction contenu", "projet": projets[2], "assigne_a": etudiants[0], "statut": "a_faire",
             "date_echeance": echeance(30), "date_completion": None},
            # Tâche spéciale pour tester le rappel deadline
            {"titre": "Tâche test rappel", "projet": projets[0], "assigne_a": etudiants[0], "statut": "a_faire",
             "date_echeance": echeance(13), "date_completion": None},
              # Tâches pour tester l'envoi automatique
              {"titre": "Rédiger rapport final", "projet": projets[0], "assigne_a": etudiants[0], "statut": "a_faire",
               "date_echeance": echeance(13), "date_completion": None},
              {"titre": "Préparer présentation orale", "projet": projets[1], "assigne_a": profs[1], "statut": "a_faire",
               "date_echeance": echeance(13), "date_completion": None},
              {"titre": "Relire documentation", "projet": projets[2], "assigne_a": etudiants[2], "statut": "a_faire",
               "date_echeance": echeance(13), "date_completion": None},
        ])
        for td in taches_data:
            Tache.objects.get_or_create(
                titre=td["titre"], projet=td["projet"],
                defaults={
                    "assigne_a": td["assigne_a"],
                    "statut": td["statut"],
                    "date_echeance": td["date_echeance"],
                    "date_completion": td.get("date_completion"),
                }
            )

        self.stdout.write(self.style.SUCCESS(
            f"Seed terminé : {len(profs)} profs, {len(etudiants)} étudiants, "
            f"{len(projets)} projets, {len(taches_data)} tâches"
        ))