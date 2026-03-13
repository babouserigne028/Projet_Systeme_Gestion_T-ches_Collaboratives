from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta, datetime
from django.contrib.auth.hashers import make_password

from .models import Utilisateur, Projet, Tache, Collaborateur, Message, DerniereLecture

# HELPERS

def make_user(email, role, nom="Test", prenom="User", is_active=True, password="pass1234"):
    user = Utilisateur(
        email=email,
        nom=nom,
        prenom=prenom,
        role=role,
        is_active=is_active,
        password=make_password(password),
    )
    user.save()
    return user


def make_projet(createur, titre="Projet Test", description="Description test"):
    return Projet.objects.create(titre=titre, description=description, createur=createur)


def make_tache(projet, assigne_a, titre="Tâche Test", statut="a_faire", jours=7):
    return Tache.objects.create(
        titre=titre,
        statut=statut,
        projet=projet,
        assigne_a=assigne_a,
        date_echeance=timezone.now() + timedelta(days=jours),
    )

# TESTS AUTHENTIFICATION

class RegisterViewTest(APITestCase):
    url = "/api/register/"

    def test_register_success(self):
        data = {
            "email": "etudiant@test.com",
            "nom": "Diallo",
            "prenom": "Mamadou",
            "password": "motdepasse123",
            "role": "etudiant",
        }
        response = self.client.post(self.url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("message", response.data)
        user = Utilisateur.objects.get(email="etudiant@test.com")
        self.assertFalse(user.is_active)

    def test_register_email_duplique(self):
        make_user("etudiant@test.com", "etudiant")
        data = {
            "email": "etudiant@test.com",
            "nom": "Autre",
            "prenom": "User",
            "password": "motdepasse123",
            "role": "etudiant",
        }
        response = self.client.post(self.url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_champs_manquants(self):
        response = self.client.post(self.url, {"email": "x@test.com"}, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_role_invalide(self):
        data = {
            "email": "bad@test.com",
            "nom": "Bad",
            "prenom": "Role",
            "password": "pass",
            "role": "superadmin",
        }
        response = self.client.post(self.url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginViewTest(APITestCase):
    url = "/api/login/"

    def setUp(self):
        self.user = make_user("prof@test.com", "professeur", password="secret123")

    def test_login_success(self):
        response = self.client.post(self.url, {"email": "prof@test.com", "password": "secret123"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["role"], "professeur")

    def test_login_mauvais_mot_de_passe(self):
        response = self.client.post(self.url, {"email": "prof@test.com", "password": "mauvais"})
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

    def test_login_compte_inactif(self):
        make_user("inactif@test.com", "etudiant", is_active=False, password="secret")
        response = self.client.post(self.url, {"email": "inactif@test.com", "password": "secret"})
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)

    def test_login_email_inexistant(self):
        response = self.client.post(self.url, {"email": "inconnu@test.com", "password": "pass"})
        self.assertNotEqual(response.status_code, status.HTTP_200_OK)


class TokenRefreshTest(APITestCase):
    def test_refresh_token(self):
        user = make_user("refresh@test.com", "etudiant", password="pass1234")
        login = self.client.post("/api/login/", {"email": "refresh@test.com", "password": "pass1234"})
        refresh_token = login.data["refresh"]
        response = self.client.post("/api/token/refresh/", {"refresh": refresh_token})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)


class CurrentUserViewTest(APITestCase):
    def setUp(self):
        self.user = make_user("me@test.com", "etudiant")
        self.client.force_authenticate(user=self.user)

    def test_get_current_user(self):
        response = self.client.get("/api/me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "me@test.com")

    def test_non_authentifie(self):
        self.client.force_authenticate(user=None)
        response = self.client.get("/api/me/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CheckEmailViewTest(APITestCase):
    url = "/api/check-email/"

    def setUp(self):
        make_user("existing@test.com", "etudiant")

    def test_email_existant(self):
        response = self.client.post(self.url, {"email": "existing@test.com"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["exists"])
        self.assertFalse(response.data["available"])

    def test_email_disponible(self):
        response = self.client.post(self.url, {"email": "nouveau@test.com"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["exists"])
        self.assertTrue(response.data["available"])

    def test_email_manquant(self):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# TESTS GESTION UTILISATEURS

class UtilisateurListViewTest(APITestCase):
    def setUp(self):
        make_user("u1@test.com", "etudiant")
        make_user("u2@test.com", "professeur")

    def test_list_utilisateurs(self):
        response = self.client.get("/api/utilisateurs/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 2)


class UtilisateurDetailViewTest(APITestCase):
    def setUp(self):
        self.user = make_user("detail@test.com", "etudiant")

    def test_get_utilisateur(self):
        response = self.client.get(f"/api/utilisateurs/{self.user.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "detail@test.com")

    def test_get_utilisateur_inexistant(self):
        response = self.client.get("/api/utilisateurs/99999/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patch_utilisateur(self):
        response = self.client.patch(
            f"/api/utilisateurs/{self.user.id}/",
            {"nom": "NouveauNom"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["nom"], "NouveauNom")

    def test_patch_utilisateur_inexistant(self):
        response = self.client.patch("/api/utilisateurs/99999/", {"nom": "X"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_utilisateur(self):
        response = self.client.delete(f"/api/utilisateurs/{self.user.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Utilisateur.objects.filter(id=self.user.id).exists())

    def test_delete_utilisateur_inexistant(self):
        response = self.client.delete("/api/utilisateurs/99999/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class AdminCreateUserViewTest(APITestCase):
    url = "/api/utilisateurs/create/"

    def test_admin_cree_utilisateur_actif(self):
        data = {
            "email": "nouveau@test.com",
            "nom": "Nouveau",
            "prenom": "User",
            "password": "pass1234",
            "role": "etudiant",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = Utilisateur.objects.get(email="nouveau@test.com")
        self.assertTrue(user.is_active)

    def test_admin_cree_utilisateur_invalide(self):
        response = self.client.post(self.url, {"email": "mauvais"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserCountViewTest(APITestCase):
    def setUp(self):
        make_user("etud1@test.com", "etudiant")
        make_user("prof1@test.com", "professeur")
        make_user("admin1@test.com", "administrateur")
        make_user("inactif@test.com", "etudiant", is_active=False)

    def test_user_count(self):
        response = self.client.get("/api/utilisateurs/count/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("total", response.data)
        self.assertIn("Non_validé", response.data)
        self.assertIn("par_role", response.data)
        self.assertGreaterEqual(response.data["total"], 4)
        self.assertGreaterEqual(response.data["Non_validé"], 1)


class UsersAwaitingValidationViewTest(APITestCase):
    def setUp(self):
        make_user("actif@test.com", "etudiant", is_active=True)
        make_user("attente1@test.com", "etudiant", is_active=False)
        make_user("attente2@test.com", "professeur", is_active=False)

    def test_awaiting_validation(self):
        response = self.client.get("/api/utilisateurs/awaitingValidation/count/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("utilisateurs", response.data)
        emails = [u["email"] for u in response.data["utilisateurs"]]
        self.assertIn("attente1@test.com", emails)
        self.assertIn("attente2@test.com", emails)
        self.assertNotIn("actif@test.com", emails)


class UpdateUserStatusViewTest(APITestCase):
    def setUp(self):
        self.admin = make_user("admin@test.com", "administrateur")
        self.client.force_authenticate(user=self.admin)
        self.target = make_user("cible@test.com", "etudiant", is_active=False)

    def test_activer_utilisateur(self):
        response = self.client.patch(
            f"/api/utilisateurs/{self.target.id}/status/",
            {"is_active": True},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.target.refresh_from_db()
        self.assertTrue(self.target.is_active)

    def test_desactiver_utilisateur(self):
        self.target.is_active = True
        self.target.save()
        response = self.client.patch(
            f"/api/utilisateurs/{self.target.id}/status/",
            {"is_active": False},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.target.refresh_from_db()
        self.assertFalse(self.target.is_active)

    def test_champ_is_active_manquant(self):
        response = self.client.patch(
            f"/api/utilisateurs/{self.target.id}/status/",
            {},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_utilisateur_inexistant(self):
        response = self.client.patch(
            "/api/utilisateurs/99999/status/",
            {"is_active": True},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_non_authentifie(self):
        self.client.force_authenticate(user=None)
        response = self.client.patch(
            f"/api/utilisateurs/{self.target.id}/status/",
            {"is_active": True},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

# TESTS PROJETS

class ProjetListCreateViewTest(APITestCase):
    def setUp(self):
        self.admin = make_user("admin@test.com", "administrateur")
        self.prof = make_user("prof@test.com", "professeur")
        self.etud = make_user("etud@test.com", "etudiant")
        self.projet_admin = make_projet(self.admin, titre="Projet Admin")
        self.projet_etud = make_projet(self.etud, titre="Projet Etudiant")

    def test_admin_voit_tous_les_projets(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/projets/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titres = [p["titre"] for p in response.data]
        self.assertIn("Projet Admin", titres)
        self.assertIn("Projet Etudiant", titres)

    def test_etudiant_voit_seulement_ses_projets(self):
        self.client.force_authenticate(user=self.etud)
        response = self.client.get("/api/projets/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titres = [p["titre"] for p in response.data]
        self.assertIn("Projet Etudiant", titres)
        self.assertNotIn("Projet Admin", titres)

    def test_prof_voit_projets_crees_et_supervises(self):
        # Ajouter prof comme collaborateur du projet étudiant
        Collaborateur.objects.create(projet=self.projet_etud, user=self.prof)
        self.client.force_authenticate(user=self.prof)
        response = self.client.get("/api/projets/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titres = [p["titre"] for p in response.data]
        self.assertIn("Projet Etudiant", titres)

    def test_creer_projet(self):
        self.client.force_authenticate(user=self.etud)
        data = {"titre": "Nouveau Projet", "description": "Desc", "createur": self.etud.id}
        response = self.client.post("/api/projets/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["titre"], "Nouveau Projet")

    def test_creer_projet_sans_titre(self):
        self.client.force_authenticate(user=self.etud)
        response = self.client.post("/api/projets/", {"description": "Desc"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_non_authentifie(self):
        response = self.client.get("/api/projets/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ProjetDetailViewTest(APITestCase):
    def setUp(self):
        self.admin = make_user("admin@test.com", "administrateur")
        self.createur = make_user("createur@test.com", "etudiant")
        self.autre = make_user("autre@test.com", "etudiant")
        self.projet = make_projet(self.createur)

    def test_get_projet(self):
        self.client.force_authenticate(user=self.createur)
        response = self.client.get(f"/api/projets/{self.projet.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["titre"], self.projet.titre)

    def test_get_projet_inexistant(self):
        self.client.force_authenticate(user=self.createur)
        response = self.client.get("/api/projets/99999/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patch_projet_par_createur(self):
        self.client.force_authenticate(user=self.createur)
        response = self.client.patch(
            f"/api/projets/{self.projet.id}/",
            {"titre": "Titre Modifié"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["titre"], "Titre Modifié")

    def test_patch_projet_par_admin(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch(
            f"/api/projets/{self.projet.id}/",
            {"titre": "Modif Admin"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_projet_par_non_createur(self):
        self.client.force_authenticate(user=self.autre)
        response = self.client.patch(
            f"/api/projets/{self.projet.id}/",
            {"titre": "Interdit"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_projet_par_createur(self):
        self.client.force_authenticate(user=self.createur)
        response = self.client.delete(f"/api/projets/{self.projet.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Projet.objects.filter(id=self.projet.id).exists())

    def test_delete_projet_par_non_createur(self):
        self.client.force_authenticate(user=self.autre)
        response = self.client.delete(f"/api/projets/{self.projet.id}/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_projet_inexistant(self):
        self.client.force_authenticate(user=self.createur)
        response = self.client.delete("/api/projets/99999/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

# TESTS COLLABORATEURS

class CollaborateurAddViewTest(APITestCase):
    def setUp(self):
        self.admin = make_user("admin@test.com", "administrateur")
        self.createur = make_user("createur@test.com", "etudiant")
        self.prof = make_user("prof@test.com", "professeur")
        self.autre_etud = make_user("autre@test.com", "etudiant")
        self.projet = make_projet(self.createur)

    def test_ajouter_collaborateur(self):
        self.client.force_authenticate(user=self.createur)
        response = self.client.post(
            f"/api/projets/{self.projet.id}/collaborateurs/",
            {"user_id": self.prof.id},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Collaborateur.objects.filter(projet=self.projet, user=self.prof).exists())

    def test_ajouter_collaborateur_deja_present(self):
        Collaborateur.objects.create(projet=self.projet, user=self.prof)
        self.client.force_authenticate(user=self.createur)
        response = self.client.post(
            f"/api/projets/{self.projet.id}/collaborateurs/",
            {"user_id": self.prof.id},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_ajouter_admin_comme_collaborateur(self):
        self.client.force_authenticate(user=self.createur)
        response = self.client.post(
            f"/api/projets/{self.projet.id}/collaborateurs/",
            {"user_id": self.admin.id},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_ajouter_collaborateur_par_non_createur(self):
        self.client.force_authenticate(user=self.autre_etud)
        response = self.client.post(
            f"/api/projets/{self.projet.id}/collaborateurs/",
            {"user_id": self.prof.id},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_ajouter_collaborateur_user_inexistant(self):
        self.client.force_authenticate(user=self.createur)
        response = self.client.post(
            f"/api/projets/{self.projet.id}/collaborateurs/",
            {"user_id": 99999},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_ajouter_collaborateur_sans_user_id(self):
        self.client.force_authenticate(user=self.createur)
        response = self.client.post(
            f"/api/projets/{self.projet.id}/collaborateurs/",
            {},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_projet_inexistant(self):
        self.client.force_authenticate(user=self.createur)
        response = self.client.post(
            "/api/projets/99999/collaborateurs/",
            {"user_id": self.prof.id},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CollaborateurRemoveViewTest(APITestCase):
    def setUp(self):
        self.createur = make_user("createur@test.com", "etudiant")
        self.prof = make_user("prof@test.com", "professeur")
        self.autre = make_user("autre@test.com", "etudiant")
        self.projet = make_projet(self.createur)
        self.collab = Collaborateur.objects.create(projet=self.projet, user=self.prof)

    def test_retirer_collaborateur_par_createur(self):
        self.client.force_authenticate(user=self.createur)
        response = self.client.delete(
            f"/api/projets/{self.projet.id}/collaborateurs/{self.collab.id}/"
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Collaborateur.objects.filter(id=self.collab.id).exists())

    def test_retirer_collaborateur_par_non_createur(self):
        self.client.force_authenticate(user=self.autre)
        response = self.client.delete(
            f"/api/projets/{self.projet.id}/collaborateurs/{self.collab.id}/"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retirer_collaborateur_inexistant(self):
        self.client.force_authenticate(user=self.createur)
        response = self.client.delete(
            f"/api/projets/{self.projet.id}/collaborateurs/99999/"
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


# TESTS TÂCHES

class TacheListCreateViewTest(APITestCase):
    def setUp(self):
        self.admin = make_user("admin@test.com", "administrateur")
        self.etud = make_user("etud@test.com", "etudiant")
        self.autre = make_user("autre@test.com", "etudiant")
        self.projet = make_projet(self.etud)
        self.tache = make_tache(self.projet, self.etud, titre="Ma tâche")

    def test_admin_voit_toutes_les_taches(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/taches/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_etudiant_voit_ses_taches(self):
        self.client.force_authenticate(user=self.etud)
        response = self.client.get("/api/taches/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        titres = [t["titre"] for t in response.data]
        self.assertIn("Ma tâche", titres)

    def test_filter_par_projet_id(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(f"/api/taches/?projet_id={self.projet.id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_creer_tache(self):
        self.client.force_authenticate(user=self.etud)
        data = {
            "titre": "Nouvelle tâche",
            "projet": self.projet.id,
            "assigne_a": self.etud.id,
            "date_echeance": (timezone.now() + timedelta(days=5)).isoformat(),
        }
        response = self.client.post("/api/taches/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["titre"], "Nouvelle tâche")

    def test_creer_tache_par_non_createur(self):
        self.client.force_authenticate(user=self.autre)
        data = {
            "titre": "Tâche interdite",
            "projet": self.projet.id,
            "assigne_a": self.autre.id,
            "date_echeance": (timezone.now() + timedelta(days=5)).isoformat(),
        }
        response = self.client.post("/api/taches/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_creer_tache_prof_sur_projet_etudiant(self):
        prof = make_user("prof2@test.com", "professeur")
        self.client.force_authenticate(user=self.etud)
        data = {
            "titre": "Tâche assignée au prof",
            "projet": self.projet.id,
            "assigne_a": prof.id,
            "date_echeance": (timezone.now() + timedelta(days=5)).isoformat(),
        }
        response = self.client.post("/api/taches/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_non_authentifie(self):
        response = self.client.get("/api/taches/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TacheDetailViewTest(APITestCase):
    def setUp(self):
        self.admin = make_user("admin@test.com", "administrateur")
        self.createur = make_user("createur@test.com", "etudiant")
        self.assigne = make_user("assigne@test.com", "etudiant")
        self.autre = make_user("autre@test.com", "etudiant")
        self.projet = make_projet(self.createur)
        self.tache = make_tache(self.projet, self.assigne)

    def test_get_tache(self):
        self.client.force_authenticate(user=self.createur)
        response = self.client.get(f"/api/taches/{self.tache.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["titre"], self.tache.titre)

    def test_get_tache_inexistante(self):
        self.client.force_authenticate(user=self.createur)
        response = self.client.get("/api/taches/99999/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patch_tache_par_assigne(self):
        self.client.force_authenticate(user=self.assigne)
        response = self.client.patch(
            f"/api/taches/{self.tache.id}/",
            {"statut": "termine", "date_completion": timezone.now().isoformat()},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["statut"], "termine")

    def test_patch_tache_par_createur_projet(self):
        self.client.force_authenticate(user=self.createur)
        response = self.client.patch(
            f"/api/taches/{self.tache.id}/",
            {"titre": "Titre Modifié"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_tache_par_non_autorise(self):
        self.client.force_authenticate(user=self.autre)
        response = self.client.patch(
            f"/api/taches/{self.tache.id}/",
            {"titre": "Interdit"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_tache_par_createur(self):
        self.client.force_authenticate(user=self.createur)
        response = self.client.delete(f"/api/taches/{self.tache.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Tache.objects.filter(id=self.tache.id).exists())

    def test_delete_tache_par_non_createur(self):
        self.client.force_authenticate(user=self.autre)
        response = self.client.delete(f"/api/taches/{self.tache.id}/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_tache_par_admin(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(f"/api/taches/{self.tache.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


# TESTS MESSAGES / CHAT

class MessageListCreateViewTest(APITestCase):
    def setUp(self):
        self.user = make_user("user@test.com", "etudiant")
        self.autre = make_user("autre@test.com", "etudiant")
        self.projet = make_projet(self.user)
        Message.objects.create(projet=self.projet, auteur=self.user, contenu="Bonjour!")

    def test_get_messages(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"/api/projets/{self.projet.id}/messages/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["contenu"], "Bonjour!")

    def test_get_messages_projet_inexistant(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/projets/99999/messages/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_envoyer_message(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            f"/api/projets/{self.projet.id}/messages/",
            {"contenu": "Nouveau message"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["contenu"], "Nouveau message")

    def test_envoyer_message_vide(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            f"/api/projets/{self.projet.id}/messages/",
            {"contenu": "   "},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_envoyer_message_projet_inexistant(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            "/api/projets/99999/messages/",
            {"contenu": "Test"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_non_authentifie(self):
        response = self.client.get(f"/api/projets/{self.projet.id}/messages/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class MarkChatReadViewTest(APITestCase):
    def setUp(self):
        self.user = make_user("user@test.com", "etudiant")
        self.projet = make_projet(self.user)

    def test_mark_as_read(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(f"/api/projets/{self.projet.id}/messages/read/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "ok")
        self.assertTrue(DerniereLecture.objects.filter(user=self.user, projet=self.projet).exists())

    def test_mark_as_read_deuxieme_fois(self):
        self.client.force_authenticate(user=self.user)
        self.client.post(f"/api/projets/{self.projet.id}/messages/read/")
        response = self.client.post(f"/api/projets/{self.projet.id}/messages/read/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(DerniereLecture.objects.filter(user=self.user, projet=self.projet).count(), 1)

    def test_mark_as_read_projet_inexistant(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post("/api/projets/99999/messages/read/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class UnreadMessagesCountViewTest(APITestCase):
    def setUp(self):
        self.user1 = make_user("user1@test.com", "etudiant")
        self.user2 = make_user("user2@test.com", "etudiant")
        self.projet = make_projet(self.user1)
        # user2 envoie un message dans le projet de user1
        Message.objects.create(projet=self.projet, auteur=self.user2, contenu="Salut!")

    def test_messages_non_lus(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.get("/api/messages/unread/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Le projet doit apparaître avec au moins 1 message non lu
        self.assertIn(str(self.projet.id), response.data)
        self.assertGreaterEqual(response.data[str(self.projet.id)], 1)

    def test_messages_non_lus_apres_lecture(self):
        self.client.force_authenticate(user=self.user1)
        # Marquer comme lu
        self.client.post(f"/api/projets/{self.projet.id}/messages/read/")
        response = self.client.get("/api/messages/unread/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Plus de messages non lus
        self.assertNotIn(str(self.projet.id), response.data)

    def test_non_authentifie(self):
        response = self.client.get("/api/messages/unread/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


# TESTS DASHBOARDS

class ProfesseurDashboardViewTest(APITestCase):
    def setUp(self):
        self.prof = make_user("prof@test.com", "professeur")
        self.projet = make_projet(self.prof, titre="Projet Prof")
        self.tache_a_faire = make_tache(self.projet, self.prof, titre="Tâche A Faire")
        tache_terminee = make_tache(self.projet, self.prof, titre="Tâche Terminée", statut="termine")

    def test_dashboard_structure(self):
        self.client.force_authenticate(user=self.prof)
        response = self.client.get("/api/professeur/dashboard/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_keys = [
            "total_projets", "projets_termines", "projets_en_cours",
            "total_taches", "taches_terminees", "taches_a_faire",
            "taches_en_retard", "taux_completion", "taches_urgentes", "projets_recents",
        ]
        for key in expected_keys:
            self.assertIn(key, response.data)

    def test_dashboard_valeurs(self):
        self.client.force_authenticate(user=self.prof)
        response = self.client.get("/api/professeur/dashboard/")
        self.assertEqual(response.data["total_projets"], 1)
        self.assertEqual(response.data["total_taches"], 2)
        self.assertEqual(response.data["taches_terminees"], 1)
        self.assertEqual(response.data["taches_a_faire"], 1)

    def test_dashboard_non_authentifie(self):
        response = self.client.get("/api/professeur/dashboard/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class EtudiantDashboardViewTest(APITestCase):
    def setUp(self):
        self.etud = make_user("etud@test.com", "etudiant")
        self.projet = make_projet(self.etud, titre="Projet Etud")
        make_tache(self.projet, self.etud, titre="Tâche 1")
        make_tache(self.projet, self.etud, titre="Tâche 2", statut="termine")

    def test_dashboard_structure(self):
        self.client.force_authenticate(user=self.etud)
        response = self.client.get("/api/etudiant/dashboard/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_keys = [
            "total_projets", "projets_termines", "projets_en_cours",
            "total_taches", "taches_terminees", "taches_a_faire",
            "taches_en_retard", "taux_completion",
        ]
        for key in expected_keys:
            self.assertIn(key, response.data)

    def test_dashboard_valeurs(self):
        self.client.force_authenticate(user=self.etud)
        response = self.client.get("/api/etudiant/dashboard/")
        self.assertEqual(response.data["total_projets"], 1)
        self.assertEqual(response.data["total_taches"], 2)
        self.assertEqual(response.data["taches_terminees"], 1)

    def test_taux_completion(self):
        self.client.force_authenticate(user=self.etud)
        response = self.client.get("/api/etudiant/dashboard/")
        self.assertEqual(response.data["taux_completion"], 50.0)

    def test_dashboard_non_authentifie(self):
        response = self.client.get("/api/etudiant/dashboard/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

# TESTS STATISTIQUES PROFESSEURS

class StatistiquesProfsViewTest(APITestCase):
    def setUp(self):
        self.admin = make_user("admin@test.com", "administrateur")
        self.prof = make_user("prof@test.com", "professeur")

    def test_admin_voit_tous_les_profs(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/statistiques/professeurs/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("professeurs", response.data)
        self.assertIn("resume", response.data)
        self.assertIn("taux_mensuel", response.data)
        self.assertIn("activite_recente", response.data)

    def test_prof_voit_seulement_ses_stats(self):
        self.client.force_authenticate(user=self.prof)
        response = self.client.get("/api/statistiques/professeurs/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        profs = response.data["professeurs"]
        for p in profs:
            self.assertEqual(p["id"], self.prof.id)

    def test_avec_filtre_mois_annee(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get("/api/statistiques/professeurs/?mois=3&annee=2026")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_non_authentifie(self):
        response = self.client.get("/api/statistiques/professeurs/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


# TESTS PRIME PROFESSEURS

class EligibleProfessorsForPrimeViewTest(APITestCase):
    url = "/api/professeurs/eligible-for-prime/"

    def setUp(self):
        self.admin = make_user("admin@test.com", "administrateur")
        self.prof = make_user("prof@test.com", "professeur")
        self.client.force_authenticate(user=self.admin)

    def test_calcul_prime_valide(self):
        response = self.client.post(self.url, {"mois": 3, "annee": 2026}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("professeurs_eligibles", response.data)
        self.assertIn("professeurs_non_eligibles", response.data)
        self.assertIn("nombre_eligibles", response.data)
        self.assertIn("cumul_total_primes", response.data)

    def test_parametres_manquants(self):
        response = self.client.post(self.url, {"mois": 3}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_parametres_invalides(self):
        response = self.client.post(self.url, {"mois": "abc", "annee": "xyz"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_prof_eligible_a_100_pourcent(self):
        projet = make_projet(self.prof)
        echeance = datetime(2026, 3, 15, 12, 0, 0)
        tache = Tache.objects.create(
            titre="Tâche parfaite",
            statut="termine",
            projet=projet,
            assigne_a=self.prof,
            date_echeance=echeance,
            date_completion=datetime(2026, 3, 10, 12, 0, 0),
        )
        response = self.client.post(self.url, {"mois": 3, "annee": 2026}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        eligibles = response.data["professeurs_eligibles"]
        ids = [p["id"] for p in eligibles]
        self.assertIn(self.prof.id, ids)
        for p in eligibles:
            if p["id"] == self.prof.id:
                self.assertEqual(p["prime"], 100000)

    def test_prof_non_eligible(self):
        projet = make_projet(self.prof)
        echeance = datetime(2026, 3, 15, 12, 0, 0)
        # Tâche non terminée
        Tache.objects.create(
            titre="Tâche non faite",
            statut="a_faire",
            projet=projet,
            assigne_a=self.prof,
            date_echeance=echeance,
        )
        response = self.client.post(self.url, {"mois": 3, "annee": 2026}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        non_eligibles = response.data["professeurs_non_eligibles"]
        ids = [p["id"] for p in non_eligibles]
        self.assertIn(self.prof.id, ids)
        for p in non_eligibles:
            if p["id"] == self.prof.id:
                self.assertEqual(p["prime"], 0)

    def test_non_authentifie(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(self.url, {"mois": 3, "annee": 2026}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


# TESTS MODÈLES

class UtilisateurModelTest(TestCase):
    def test_matricule_auto_genere(self):
        user = make_user("u@test.com", "etudiant")
        self.assertTrue(user.matricule.startswith("ETUDIANT-"))

    def test_matricule_unique_par_role(self):
        u1 = make_user("a@test.com", "etudiant")
        u2 = make_user("b@test.com", "etudiant")
        self.assertNotEqual(u1.matricule, u2.matricule)

    def test_str_representation(self):
        user = make_user("u@test.com", "professeur", nom="Diallo", prenom="Awa")
        self.assertIn("Diallo", str(user))
        self.assertIn("professeur", str(user))

    def test_is_active_defaut_false(self):
        user = Utilisateur(
            email="new@test.com",
            nom="X",
            prenom="Y",
            role="etudiant",
            password=make_password("pass"),
        )
        user.save()
        self.assertFalse(user.is_active)


class ProjetModelTest(TestCase):
    def test_str_representation(self):
        user = make_user("u@test.com", "etudiant")
        projet = make_projet(user, titre="Mon Projet")
        self.assertEqual(str(projet), "Mon Projet")


class TacheModelTest(TestCase):
    def test_str_representation(self):
        user = make_user("u@test.com", "etudiant")
        projet = make_projet(user)
        tache = make_tache(projet, user, titre="Ma Tâche")
        self.assertIn("Ma Tâche", str(tache))
        self.assertIn("a_faire", str(tache))


class CollaborateurModelTest(TestCase):
    def test_str_representation(self):
        user = make_user("u@test.com", "etudiant", nom="Sall")
        projet = make_projet(user, titre="ProjetX")
        collab = Collaborateur.objects.create(projet=projet, user=user)
        self.assertIn("Sall", str(collab))
        self.assertIn("ProjetX", str(collab))


class DerniereLectureModelTest(TestCase):
    def test_unique_together(self):
        user = make_user("u@test.com", "etudiant")
        projet = make_projet(user)
        DerniereLecture.objects.create(user=user, projet=projet)
        with self.assertRaises(Exception):
            DerniereLecture.objects.create(user=user, projet=projet)
