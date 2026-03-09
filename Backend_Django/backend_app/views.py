from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Utilisateur
from .serializers import UtilisateurSerializer
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated

class UtilisateurListView(APIView):
    def get(self, request):
        utilisateurs = Utilisateur.objects.all()
        serializer = UtilisateurSerializer(utilisateurs, many=True)
        return Response(serializer.data)
    

class RegisterView(APIView):
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