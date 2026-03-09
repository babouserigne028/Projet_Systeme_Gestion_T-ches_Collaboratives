
from django.db import models
from django.contrib.auth.models import AbstractUser

class Utilisateur(AbstractUser):
	ROLE_CHOICES = [
		('etudiant', 'Etudiant'),
		('professeur', 'Professeur'),
		('administrateur', 'Administrateur'),
	]
	username = None  # On retire le champ username par défaut
	email = models.EmailField(unique=True)
	prenom = models.CharField(max_length=255, default="Inconnu")
	nom = models.CharField(max_length=255)
	telephone = models.CharField(max_length=20, blank=True)
	password = models.CharField(max_length=255)
	role = models.CharField(max_length=20, choices=ROLE_CHOICES)
	matricule = models.CharField(max_length=50, blank=True)
	promotion = models.CharField(max_length=50, blank=True)
	is_active = models.BooleanField(default=False)

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['nom', 'prenom']

	def __str__(self):
		return f"{self.nom} {self.prenom} ({self.role})"


# Table projets
class Projet(models.Model):
	titre = models.CharField(max_length=255)
	description = models.TextField()
	createur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name='projets_crees')
	date_creation = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.titre

# Table collaborateurs (liaison plusieurs-à-plusieurs)
class Collaborateur(models.Model):
	projet = models.ForeignKey(Projet, on_delete=models.CASCADE)
	user = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)

	def __str__(self):
		return f"{self.user.nom} sur {self.projet.titre}"

# Table taches
class Tache(models.Model):
	STATUT_CHOICES = [
		('a_faire', 'A faire'),
		('termine', 'Terminé'),
	]
	titre = models.CharField(max_length=255)
	statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='a_faire')
	projet = models.ForeignKey(Projet, on_delete=models.CASCADE)
	assigne_a = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name='taches_assignees')
	date_echeance = models.DateField()

	def __str__(self):
		return f"{self.titre} ({self.statut})"
