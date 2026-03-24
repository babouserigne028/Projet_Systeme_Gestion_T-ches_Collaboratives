import os
import shutil
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.conf import settings
from datetime import datetime
from django.db import transaction
# Assurez-vous d'importer vos modèles ici
# from your_app.models import Utilisateur, Projet, Collaborateur, Tache

class Command(BaseCommand):
    help = "Seed la base de données avec des données de test"

    def add_arguments(self, parser):
        parser.add_argument('--clair', action='store_true', help='Supprimer les données existantes')

    @transaction.atomic
    def handle(self, *args, **options):
        if options['clair']:
            self._nettoyer_base_de_donnees()

        # 1. Création des acteurs
        admin = self._creer_administrateur()
        professeurs = self._creer_utilisateurs_par_role("professeur")
        etudiants = self._creer_utilisateurs_par_role("étudiant")

        # 2. Création de la structure
        projets = self._creer_projets(professeurs, etudiants)
        self._ajouter_collaborateurs(projets, professeurs, etudiants)

        # 3. Génération des scénarios de tâches
        nb_taches = self._generer_scenarios_taches(projets, professeurs, etudiants)

        self.stdout.write(self.style.SUCCESS(
            f"Seed terminé : {len(professeurs)} professeurs, {len(etudiants)} étudiants, "
            f"{len(projets)} projets, {nb_taches} tâches."
        ))

    def _nettoyer_base_de_donnees(self):
        self.stdout.write("Suppression des données...")
        # Tache, Collaborateur, Projet à importer selon vos modèles
        # Utilisateur.objects.filter(is_superuser=False).delete()
        photos_dir = os.path.join(settings.MEDIA_ROOT, 'photos')
        if os.path.exists(photos_dir):
            shutil.rmtree(photos_dir)
            os.makedirs(photos_dir)

    def _creer_administrateur(self):
        admin, cree = Utilisateur.objects.get_or_create(
            email="serigne.babou@esmt.com",
            defaults={
                "nom": "Babou", "prénom": "Serigne Abdoulaye", "rôle": "administrateur",
                "is_staff": True, "is_superuser": True
            }
        )
        if cree:
            admin.set_password("passer")
            admin.save()
        return admin

    def _creer_utilisateurs_par_role(self, role):
        utilisateurs = []
        donnees = {
            "professeur": [
                {"email": "fatou.faye@ucad.sn", "nom": "FAYE", "prénom": "Fatou"},
                {"email": "amadou.diop@ucad.sn", "nom": "DIOP", "prénom": "Amadou"},
                {"email": "moussa.ndiaye@ucad.sn", "nom": "NDIAYE", "prénom": "Moussa"},
            ],
            "étudiant": [
                {"email": "awa.ba@ucad.sn", "nom": "BA", "prénom": "Awa"},
                {"email": "ibrahima.fall@ucad.sn", "nom": "FALL", "prénom": "Ibrahima"},
                {"email": "mariama.sow@ucad.sn", "nom": "SOW", "prénom": "Mariama"},
            ]
        }
        for d in donnees.get(role, []):
            u, cree = Utilisateur.objects.get_or_create(
                email=d["email"],
                defaults={"nom": d["nom"], "prénom": d["prénom"], "rôle": role, "is_active": True}
            )
            if cree:
                u.set_password("Passer123 !")
                u.save()
            utilisateurs.append(u)
        return utilisateurs

    def _creer_projets(self, professeurs, etudiants):
        donnees_projets = [
            {"titre": "Système IA", "desc": "Moteur recommandation", "auteur": professeurs[0]},
            {"titre": "App Santé", "desc": "Suivi médical", "auteur": professeurs[1]},
            {"titre": "E-learning", "desc": "Cours en ligne", "auteur": etudiants[0]},
        ]
        projets = []
        for dp in donnees_projets:
            p, _ = Projet.objects.get_or_create(
                titre=dp["titre"], defaults={"description": dp["desc"], "createur": dp["auteur"]}
            )
            projets.append(p)
        return projets

    def _ajouter_collaborateurs(self, projets, professeurs, etudiants):
        collabs = [(projets[0], etudiants[0]), (projets[1], etudiants[2]), (projets[2], professeurs[2])]
        for p, u in collabs:
            Collaborateur.objects.get_or_create(projet=p, utilisateur=u)

    def _generer_scenarios_taches(self, projets, professeurs, etudiants):
        echeance = lambda j: timezone.make_aware(datetime(2026, 3, j, 23, 59))
        complet = lambda j, d: timezone.make_aware(datetime(2026, 3, j+d, 12, 0))
        
        taches_infos = []
        # Simulation Prof Faye (100% à temps)
        for i in range(10):
            taches_infos.append({"t": f"Tâche {i}", "p": projets[0], "u": professeurs[0], "ec": echeance(10+i), "cp": complet(10+i, -2)})
        
        # Simulation Prof Diop (Retards)
        taches_infos.append({"t": "Retard Diop", "p": projets[1], "u": professeurs[1], "ec": echeance(17), "cp": complet(17, 3)})

        for ti in taches_infos:
            Tache.objects.get_or_create(
                titre=ti["t"], projet=ti["p"],
                defaults={"assigne_a": ti["u"], "statut": "terminer", "date_echeance": ti["ec"], "date_completion": ti["cp"]}
            )
        return len(taches_infos)