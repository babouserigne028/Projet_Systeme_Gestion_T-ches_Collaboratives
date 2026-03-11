from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Utilisateur, Tache, Projet, Collaborateur, Message, DerniereLecture
from .serializers import UtilisateurSerializer, ProjetSerializer, TacheSerializer, CollaborateurSerializer, MessageSerializer
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import models
from django.db.models import Count, Q, F
from collections import defaultdict
from datetime import date, timedelta

class UtilisateurListView(APIView):
    def get(self, request):
        utilisateurs = Utilisateur.objects.all()
        serializer = UtilisateurSerializer(utilisateurs, many=True)
        return Response(serializer.data)


class UtilisateurDetailView(APIView):
    """GET: Détail utilisateur | PATCH: Modifier | DELETE: Supprimer"""

    def get_user(self, user_id):
        try:
            return Utilisateur.objects.get(id=user_id)
        except Utilisateur.DoesNotExist:
            return None

    def get(self, request, user_id):
        user = self.get_user(user_id)
        if not user:
            return Response({"error": "Utilisateur non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        serializer = UtilisateurSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, user_id):
        user = self.get_user(user_id)
        if not user:
            return Response({"error": "Utilisateur non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        serializer = UtilisateurSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id):
        user = self.get_user(user_id)
        if not user:
            return Response({"error": "Utilisateur non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return Response({"message": "Utilisateur supprimé avec succès"}, status=status.HTTP_204_NO_CONTENT)


class AdminCreateUserView(APIView):
    """POST: Créer un utilisateur directement actif (admin)"""

    def post(self, request):
        data = request.data.copy()
        data['is_active'] = True
        serializer = UtilisateurSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class RegisterView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = UtilisateurSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Compte créé avec succès, en attente de validation."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code != 200:
            return Response({
                "error": "Email ou mot de passe incorrect, ou compte inactif."
            }, status=response.status_code)
        try:
            user = Utilisateur.objects.get(email=request.data.get('email'))
            response.data['role'] = user.role
            response.data['message'] = f"Bienvenue {user.nom} ({user.role}) !"
        except Utilisateur.DoesNotExist:
            response.data['role'] = None
            response.data['message'] = "Utilisateur non trouvé."
        return response


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UtilisateurSerializer(request.user)
        return Response(serializer.data)


class UploadPhotoView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request):
        user = request.user
        photo = request.FILES.get('photo')
        if not photo:
            return Response({'error': 'Aucune photo fournie'}, status=status.HTTP_400_BAD_REQUEST)
        # Supprimer l'ancienne photo si elle existe
        if user.photo:
            user.photo.delete(save=False)
        user.photo = photo
        user.save()
        serializer = UtilisateurSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request):
        user = request.user
        if user.photo:
            user.photo.delete(save=False)
            user.photo = None
            user.save()
        serializer = UtilisateurSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CheckEmailView(APIView):
    """
    Vue pour vérifier si un email existe déjà dans la base de données
    POST: { "email": "user@example.com" }
    Retour: { "exists": true/false, "available": false/true }
    """
    def post(self, request):
        email = request.data.get('email', '').strip()
        
        if not email:
            return Response(
                {"error": "L'email est requis."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        email_exists = Utilisateur.objects.filter(email=email).exists()
        
        return Response({
            "email": email,
            "exists": email_exists,
            "available": not email_exists
        }, status=status.HTTP_200_OK)
    
class UserCountView(APIView):
    def get(self, request):
        total = Utilisateur.objects.count()
        non_valide = Utilisateur.objects.filter(is_active=False).count()
        by_role = {
            'etudiants': Utilisateur.objects.filter(role='etudiant', is_active=True).count(),
            'professeurs': Utilisateur.objects.filter(role='professeur', is_active=True).count(),
            'administrateurs': Utilisateur.objects.filter(role='administrateur').count(),
        }
        return Response({
            "total": total,
            "Non_validé": non_valide,
            "par_role": by_role
        }, status=status.HTTP_200_OK)
    
class UsersAwaitingValidationView(APIView):
    def get(self, request):
        utilisateurs = Utilisateur.objects.filter(is_active=False)
        serializer = UtilisateurSerializer(utilisateurs, many=True)
        return Response({
            "utilisateurs": serializer.data
        }, status=status.HTTP_200_OK)


class UpdateUserStatusView(APIView):
    #permission_classes = [IsAuthenticated]
    
    def patch(self, request, user_id):
        try:
            user = Utilisateur.objects.get(id=user_id)
        except Utilisateur.DoesNotExist:
            return Response(
                {"error": "Utilisateur non trouvé."}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Récupère le nouveau statut du corps de la requête
        new_status = request.data.get('is_active')
        
        if new_status is None:
            return Response(
                {"error": "Le champ 'is_active' est requis."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.is_active = new_status
        user.save()
        
        return Response({
            "message": f"Statut de {user.nom} ({user.email}) modifié.",
            "utilisateur": UtilisateurSerializer(user).data
        }, status=status.HTTP_200_OK)
    


class EligibleProfessorsForPrimeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def calculer_prime(self, pourcentage):
        """Calcule la prime basée sur le pourcentage de completion"""
        if pourcentage == 100:
            return 100000
        elif pourcentage >= 90:
            return 30000
        else:
            return 0
    
    def post(self, request):
        mois = request.data.get('mois')
        annee = request.data.get('annee')
        
        if not mois or not annee:
            return Response(
                {"error": "Paramètres 'mois' et 'annee' requis."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            mois = int(mois)
            annee = int(annee)
        except ValueError:
            return Response(
                {"error": "Les paramètres doivent être des nombres."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Professeurs actifs
        professeurs = Utilisateur.objects.filter(
            role='professeur', 
            is_active=True
        )
        
        professeurs_eligibles = []
        professeurs_non_eligibles = []
        pourcentages = []
        cumul_primes = 0
        
        for prof in professeurs:
            # Total des tâches assignées ce mois
            taches_totales = Tache.objects.filter(
                assigne_a=prof,
                date_echeance__month=mois,
                date_echeance__year=annee
            ).count()
            
            # Tâches terminées AVANT l'échéance ce mois
            taches_a_temps = Tache.objects.filter(
                assigne_a=prof,
                statut='termine',
                date_echeance__month=mois,
                date_echeance__year=annee,
                date_completion__lte=models.F('date_echeance')  # Marquée avant l'échéance
            ).count()
            
            # Calcul du pourcentage
            if taches_totales > 0:
                pourcentage = (taches_a_temps / taches_totales) * 100
                pourcentages.append(pourcentage)
            else:
                pourcentage = 0
            
            # Calcul de la prime
            prime = self.calculer_prime(pourcentage)
            cumul_primes += prime
            
            prof_data = {
                'id': prof.id,
                'nom': prof.nom,
                'prenom': prof.prenom,
                'email': prof.email,
                'taches_totales': taches_totales,
                'taches_a_temps': taches_a_temps,
                'pourcentage': round(pourcentage, 2),
                'prime': prime
            }
            
            # Éligible si au moins 90% des tâches complétées dans les délais
            if pourcentage >= 90:
                professeurs_eligibles.append(prof_data)
            else:
                professeurs_non_eligibles.append(prof_data)
        
        # Calcul du pourcentage moyen
        pourcentage_moyen = sum(pourcentages) / len(pourcentages) if pourcentages else 0
        
        return Response({
            "mois": mois,
            "annee": annee,
            "nombre_eligibles": len(professeurs_eligibles),
            "nombre_non_eligibles": len(professeurs_non_eligibles),
            "pourcentage_moyen": round(pourcentage_moyen, 2),
            "cumul_total_primes": cumul_primes,
            "professeurs_eligibles": professeurs_eligibles,
            "professeurs_non_eligibles": professeurs_non_eligibles
        }, status=status.HTTP_200_OK)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# VUES POUR GESTION DES PROJETS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class ProjetListCreateView(APIView):
    """GET: Lister tous les projets | POST: Créer un nouveau projet"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        projets = Projet.objects.all()
        serializer = ProjetSerializer(projets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        data = request.data.copy()
        data['createur'] = request.user.id
        serializer = ProjetSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjetDetailView(APIView):
    """GET: Détail projet | PATCH: Modifier | DELETE: Supprimer"""
    permission_classes = [IsAuthenticated]
    
    def get_projet(self, projet_id):
        try:
            return Projet.objects.get(id=projet_id)
        except Projet.DoesNotExist:
            return None
    
    def get(self, request, projet_id):
        projet = self.get_projet(projet_id)
        if not projet:
            return Response({"error": "Projet non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProjetSerializer(projet)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request, projet_id):
        projet = self.get_projet(projet_id)
        if not projet:
            return Response({"error": "Projet non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ProjetSerializer(projet, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, projet_id):
        projet = self.get_projet(projet_id)
        if not projet:
            return Response({"error": "Projet non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        
        projet.delete()
        return Response({"message": "Projet supprimé avec succès"}, status=status.HTTP_204_NO_CONTENT)


class CollaborateurAddView(APIView):
    """POST: Ajouter un collaborateur à un projet"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, projet_id):
        try:
            projet = Projet.objects.get(id=projet_id)
        except Projet.DoesNotExist:
            return Response({"error": "Projet non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({"error": "user_id requis"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = Utilisateur.objects.get(id=user_id)
        except Utilisateur.DoesNotExist:
            return Response({"error": "Utilisateur non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        
        # Vérifier si déjà collaborateur
        if Collaborateur.objects.filter(projet=projet, user=user).exists():
            return Response({"error": "Utilisateur est déjà collaborateur"}, status=status.HTTP_400_BAD_REQUEST)
        
        collab = Collaborateur.objects.create(projet=projet, user=user)
        serializer = CollaborateurSerializer(collab)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CollaborateurRemoveView(APIView):
    """DELETE: Retirer un collaborateur d'un projet"""
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, projet_id, collaborateur_id):
        try:
            collab = Collaborateur.objects.get(id=collaborateur_id, projet_id=projet_id)
        except Collaborateur.DoesNotExist:
            return Response({"error": "Collaborateur non trouvé"}, status=status.HTTP_404_NOT_FOUND)
        
        collab.delete()
        return Response({"message": "Collaborateur retiré avec succès"}, status=status.HTTP_204_NO_CONTENT)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# VUES POUR GESTION DES TÂCHES
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TacheListCreateView(APIView):
    """GET: Lister toutes les tâches | POST: Créer une nouvelle tâche"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Filtrer par projet si projet_id fourni
        projet_id = request.query_params.get('projet_id')
        if projet_id:
            taches = Tache.objects.filter(projet_id=projet_id)
        else:
            taches = Tache.objects.all()
        
        serializer = TacheSerializer(taches, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = TacheSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TacheDetailView(APIView):
    """GET: Détail tâche | PATCH: Modifier | DELETE: Supprimer"""
    permission_classes = [IsAuthenticated]
    
    def get_tache(self, tache_id):
        try:
            return Tache.objects.get(id=tache_id)
        except Tache.DoesNotExist:
            return None
    
    def get(self, request, tache_id):
        tache = self.get_tache(tache_id)
        if not tache:
            return Response({"error": "Tâche non trouvée"}, status=status.HTTP_404_NOT_FOUND)
        serializer = TacheSerializer(tache)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request, tache_id):
        tache = self.get_tache(tache_id)
        if not tache:
            return Response({"error": "Tâche non trouvée"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = TacheSerializer(tache, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, tache_id):
        tache = self.get_tache(tache_id)
        if not tache:
            return Response({"error": "Tâche non trouvée"}, status=status.HTTP_404_NOT_FOUND)
        
        tache.delete()
        return Response({"message": "Tâche supprimée avec succès"}, status=status.HTTP_204_NO_CONTENT)


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# VUES POUR LE CHAT PAR PROJET
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class MessageListCreateView(APIView):
    """GET: Messages d'un projet | POST: Envoyer un message"""
    permission_classes = [IsAuthenticated]

    def get(self, request, projet_id):
        try:
            projet = Projet.objects.get(id=projet_id)
        except Projet.DoesNotExist:
            return Response({"error": "Projet non trouvé"}, status=status.HTTP_404_NOT_FOUND)

        messages = Message.objects.filter(projet=projet)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, projet_id):
        try:
            projet = Projet.objects.get(id=projet_id)
        except Projet.DoesNotExist:
            return Response({"error": "Projet non trouvé"}, status=status.HTTP_404_NOT_FOUND)

        contenu = request.data.get('contenu', '').strip()
        if not contenu:
            return Response({"error": "Le message ne peut pas être vide"}, status=status.HTTP_400_BAD_REQUEST)

        message = Message.objects.create(
            projet=projet,
            auteur=request.user,
            contenu=contenu
        )
        serializer = MessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UnreadMessagesCountView(APIView):
    """GET: Nombre de messages non lus par projet pour l'utilisateur connecté"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        mes_projets = Projet.objects.filter(
            models.Q(createur=user) | models.Q(collaborateur__user=user)
        ).distinct()

        result = {}
        for projet in mes_projets:
            derniere = DerniereLecture.objects.filter(user=user, projet=projet).first()
            if derniere:
                count = Message.objects.filter(projet=projet, date_envoi__gt=derniere.date_lecture).exclude(auteur=user).count()
            else:
                count = Message.objects.filter(projet=projet).exclude(auteur=user).count()
            if count > 0:
                result[str(projet.id)] = count

        return Response(result, status=status.HTTP_200_OK)


class MarkChatReadView(APIView):
    """POST: Marquer le chat d'un projet comme lu"""
    permission_classes = [IsAuthenticated]

    def post(self, request, projet_id):
        try:
            projet = Projet.objects.get(id=projet_id)
        except Projet.DoesNotExist:
            return Response({"error": "Projet non trouvé"}, status=status.HTTP_404_NOT_FOUND)

        DerniereLecture.objects.update_or_create(
            user=request.user, projet=projet,
            defaults={}
        )
        return Response({"status": "ok"}, status=status.HTTP_200_OK)


class ProfesseurDashboardView(APIView):
    """GET: Statistiques du dashboard pour le professeur connecté"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Projets du prof (créateur ou collaborateur)
        mes_projets = Projet.objects.filter(
            Q(createur=user) | Q(collaborateur__user=user)
        ).distinct()

        total_projets = mes_projets.count()

        # Tâches assignées au prof
        mes_taches = Tache.objects.filter(assigne_a=user)
        total_taches = mes_taches.count()
        taches_terminees = mes_taches.filter(statut='termine').count()
        taches_a_faire = mes_taches.filter(statut='a_faire').count()

        # Tâches en retard (à faire + échéance passée)
        from django.utils import timezone
        now = timezone.now()
        taches_en_retard = mes_taches.filter(statut='a_faire', date_echeance__lt=now).count()

        # Taux de complétion
        taux_completion = round((taches_terminees / total_taches * 100), 1) if total_taches > 0 else 0

        # Projets terminés (toutes tâches done)
        projets_termines = 0
        for p in mes_projets:
            nb_t = Tache.objects.filter(projet=p).count()
            nb_done = Tache.objects.filter(projet=p, statut='termine').count()
            if nb_t > 0 and nb_t == nb_done:
                projets_termines += 1

        # Tâches récentes (5 dernières à faire avec échéance la plus proche)
        taches_urgentes = TacheSerializer(
            mes_taches.filter(statut='a_faire').order_by('date_echeance')[:5],
            many=True
        ).data

        # Projets récents
        projets_recents = ProjetSerializer(mes_projets.order_by('-date_creation')[:4], many=True).data

        return Response({
            'total_projets': total_projets,
            'projets_termines': projets_termines,
            'projets_en_cours': total_projets - projets_termines,
            'total_taches': total_taches,
            'taches_terminees': taches_terminees,
            'taches_a_faire': taches_a_faire,
            'taches_en_retard': taches_en_retard,
            'taux_completion': taux_completion,
            'taches_urgentes': taches_urgentes,
            'projets_recents': projets_recents,
        }, status=status.HTTP_200_OK)


class EtudiantDashboardView(APIView):
    """GET: Statistiques du dashboard pour l'étudiant connecté"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Projets de l'étudiant (créateur ou collaborateur)
        mes_projets = Projet.objects.filter(
            Q(createur=user) | Q(collaborateur__user=user)
        ).distinct()

        total_projets = mes_projets.count()

        # Tâches assignées à l'étudiant
        mes_taches = Tache.objects.filter(assigne_a=user)
        total_taches = mes_taches.count()
        taches_terminees = mes_taches.filter(statut='termine').count()
        taches_a_faire = mes_taches.filter(statut='a_faire').count()

        # Tâches en retard
        from django.utils import timezone
        now = timezone.now()
        taches_en_retard = mes_taches.filter(statut='a_faire', date_echeance__lt=now).count()

        # Taux de complétion
        taux_completion = round((taches_terminees / total_taches * 100), 1) if total_taches > 0 else 0

        # Projets terminés
        projets_termines = 0
        for p in mes_projets:
            nb_t = Tache.objects.filter(projet=p).count()
            nb_done = Tache.objects.filter(projet=p, statut='termine').count()
            if nb_t > 0 and nb_t == nb_done:
                projets_termines += 1

        # Tâches urgentes
        taches_urgentes = TacheSerializer(
            mes_taches.filter(statut='a_faire').order_by('date_echeance')[:5],
            many=True
        ).data

        # Projets récents
        projets_recents = ProjetSerializer(mes_projets.order_by('-date_creation')[:4], many=True).data

        return Response({
            'total_projets': total_projets,
            'projets_termines': projets_termines,
            'projets_en_cours': total_projets - projets_termines,
            'total_taches': total_taches,
            'taches_terminees': taches_terminees,
            'taches_a_faire': taches_a_faire,
            'taches_en_retard': taches_en_retard,
            'taux_completion': taux_completion,
            'taches_urgentes': taches_urgentes,
            'projets_recents': projets_recents,
        }, status=status.HTTP_200_OK)


class StatistiquesProfsView(APIView):
    """GET: Statistiques globales des professeurs pour la page Statistiques admin"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        annee = int(request.query_params.get('annee', date.today().year))

        professeurs = Utilisateur.objects.filter(role='professeur', is_active=True)

        teachers_data = []
        scores = []
        total_taches = 0
        total_completees = 0
        eligibles = 0

        for prof in professeurs:
            t_total = Tache.objects.filter(
                assigne_a=prof,
                date_echeance__year=annee
            ).count()

            t_done = Tache.objects.filter(
                assigne_a=prof,
                statut='termine',
                date_echeance__year=annee
            ).count()

            projets_count = Projet.objects.filter(
                Q(tache__assigne_a=prof) | Q(collaborateur__user=prof) | Q(createur=prof)
            ).distinct().count()

            score = round((t_done / t_total * 100), 1) if t_total > 0 else 0
            scores.append(score)

            prime = 100000 if score == 100 else (30000 if score >= 90 else 0)
            prime_eligible = score >= 80
            if prime_eligible:
                eligibles += 1

            total_taches += t_total
            total_completees += t_done

            mensuel = []
            for m in range(1, 13):
                done = Tache.objects.filter(
                    assigne_a=prof, statut='termine',
                    date_echeance__month=m, date_echeance__year=annee
                ).count()
                mensuel.append({'mois': m, 'completees': done})

            teachers_data.append({
                'id': prof.id,
                'nom': prof.nom,
                'prenom': prof.prenom,
                'email': prof.email,
                'taches_totales': t_total,
                'taches_completees': t_done,
                'projets': projets_count,
                'score': score,
                'prime_eligible': prime_eligible,
                'prime_montant': prime,
                'mensuel': mensuel
            })

        # Taux de complétion mensuel global
        taux_mensuel = []
        for m in range(1, 13):
            total = Tache.objects.filter(
                date_echeance__month=m, date_echeance__year=annee
            ).count()
            done = Tache.objects.filter(
                statut='termine',
                date_echeance__month=m, date_echeance__year=annee
            ).count()
            taux = round((done / total * 100), 1) if total > 0 else 0
            taux_mensuel.append({'mois': m, 'taux': taux})

        # Activité récente (12 dernières semaines)
        today = date.today()
        activite_recente = []
        for i in range(12, 0, -1):
            start = today - timedelta(weeks=i)
            end = start + timedelta(days=7)
            taches_count = Tache.objects.filter(
                date_echeance__date__gte=start,
                date_echeance__date__lt=end
            ).count()
            validees_count = Tache.objects.filter(
                date_completion__date__gte=start,
                date_completion__date__lt=end,
                statut='termine'
            ).count()
            activite_recente.append({
                'semaine': f'S-{i}',
                'taches': taches_count,
                'validees': validees_count
            })

        score_moyen = round(sum(scores) / len(scores), 1) if scores else 0
        taux_global = round(
            (total_completees / total_taches * 100), 1
        ) if total_taches > 0 else 0

        return Response({
            'professeurs': sorted(teachers_data, key=lambda x: x['score'], reverse=True),
            'taux_mensuel': taux_mensuel,
            'activite_recente': activite_recente,
            'resume': {
                'total_taches': total_taches,
                'taches_completees': total_completees,
                'taux_completion': taux_global,
                'score_moyen': score_moyen,
                'eligibles_prime': eligibles,
                'total_profs': professeurs.count()
            }
        }, status=status.HTTP_200_OK)
