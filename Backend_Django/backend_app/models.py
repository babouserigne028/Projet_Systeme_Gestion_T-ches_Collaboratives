
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
	photo = models.ImageField(upload_to='photos/', blank=True, null=True)
	is_active = models.BooleanField(default=False)

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['nom', 'prenom']

	def __str__(self):
		return f"{self.nom} {self.prenom} ({self.role})"

	def save(self, *args, **kwargs):
		if not self.matricule:
			# Génère automatiquement le matricule
			count = Utilisateur.objects.filter(role=self.role).count()
			self.matricule = f"{self.role.upper()}-{count + 1:03d}"
		super().save(*args, **kwargs)


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
	date_echeance = models.DateTimeField()
	date_completion = models.DateTimeField(null=True, blank=True)

	def __str__(self):
		return f"{self.titre} ({self.statut})"


# Table messages (chat par projet)
class Message(models.Model):
	projet = models.ForeignKey(Projet, on_delete=models.CASCADE, related_name='messages')
	auteur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name='messages_envoyes')
	contenu = models.TextField()
	date_envoi = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['date_envoi']

	def __str__(self):
		return f"{self.auteur.prenom} dans {self.projet.titre}: {self.contenu[:30]}"


# Dernière lecture du chat par utilisateur/projet
class DerniereLecture(models.Model):
	user = models.ForeignKey(Utilisateur, on_delete=models.CASCADE, related_name='dernieres_lectures')
	projet = models.ForeignKey(Projet, on_delete=models.CASCADE, related_name='dernieres_lectures')
	date_lecture = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = ('user', 'projet')

	def __str__(self):
		return f"{self.user.prenom} - {self.projet.titre}"
