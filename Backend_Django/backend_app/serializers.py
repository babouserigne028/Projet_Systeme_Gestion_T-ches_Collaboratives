from rest_framework import serializers
from .models import Utilisateur, Projet, Tache, Collaborateur, Message
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import make_password

class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ['id', 'email', 'nom', 'prenom', 'password', 'role', 'telephone', 'matricule', 'promotion', 'photo', 'is_active', 'date_joined']
        extra_kwargs = {
            'password': {'write_only': True},
            'date_joined': {'read_only': True}
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Serializers pour Projets & Tâches
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class CollaborateurSerializer(serializers.ModelSerializer):
    user = UtilisateurSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Collaborateur
        fields = ['id', 'user', 'user_id', 'projet']
    

class ProjetLightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projet
        fields = ['id', 'titre']

class TacheSerializer(serializers.ModelSerializer):
    assigne_a_details = UtilisateurSerializer(source='assigne_a', read_only=True)
    projet_details = ProjetLightSerializer(source='projet', read_only=True)
    
    class Meta:
        model = Tache
        fields = ['id', 'titre', 'statut', 'projet', 'projet_details', 'assigne_a', 'assigne_a_details', 'date_echeance', 'date_completion']


class MessageSerializer(serializers.ModelSerializer):
    auteur_details = UtilisateurSerializer(source='auteur', read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'projet', 'auteur', 'auteur_details', 'contenu', 'date_envoi']
        read_only_fields = ['auteur', 'date_envoi']


class ProjetSerializer(serializers.ModelSerializer):
    createur_details = UtilisateurSerializer(source='createur', read_only=True)
    collaborateurs = CollaborateurSerializer(source='collaborateur_set', many=True, read_only=True)
    taches = TacheSerializer(source='tache_set', many=True, read_only=True)
    nombre_taches = serializers.SerializerMethodField()
    nombre_taches_terminees = serializers.SerializerMethodField()
    
    class Meta:
        model = Projet
        fields = ['id', 'titre', 'description', 'createur', 'createur_details', 'date_creation', 'collaborateurs', 'taches', 'nombre_taches', 'nombre_taches_terminees']
    
    def get_nombre_taches(self, obj):
        return obj.tache_set.count()
    
    def get_nombre_taches_terminees(self, obj):
        return obj.tache_set.filter(statut='termine').count()