import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import "./LogoutModal.css";

/**
 * LogoutModal - Modal de déconnexion avec effet Glassmorphism
 *
 * @param {boolean} isOpen - État d'ouverture du modal
 * @param {function} onClose - Callback pour fermer le modal
 * @param {function} onConfirm - Callback pour confirmer la déconnexion
 * @param {string} userName - Nom de l'utilisateur (optionnel)
 */
const LogoutModal = ({ isOpen, onClose, onConfirm, userName = "" }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Gestion de l'animation d'entrée/sortie
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Fermeture avec Escape
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && !isLoading) {
        handleClose();
      }
    },
    [isLoading],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const handleClose = () => {
    if (isLoading) return;
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
      handleClose();
    }
  };

  // Fermeture au clic sur l'overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={`logout-modal-overlay ${isAnimating ? "active" : ""}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
      aria-describedby="logout-modal-description"
    >
      {/* Background animé */}
      <div className="logout-modal-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Contenu du modal */}
      <div className={`logout-modal-content ${isAnimating ? "active" : ""}`}>
        {/* Header avec icône */}
        <div className="logout-modal-header">
          <div className="logout-icon-wrapper">
            <svg
              className="logout-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 17L21 12L16 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Corps du modal */}
        <div className="logout-modal-body">
          <h2 id="logout-modal-title" className="logout-modal-title">
            Déconnexion
          </h2>
          <p id="logout-modal-description" className="logout-modal-description">
            {userName
              ? `Êtes-vous sûr de vouloir vous déconnecter, ${userName} ?`
              : "Êtes-vous sûr de vouloir vous déconnecter ?"}
          </p>
          <p className="logout-modal-subtext">
            Vous devrez vous reconnecter pour accéder à vos tâches et projets.
          </p>
        </div>

        {/* Actions */}
        <div className="logout-modal-actions">
          <button
            className="logout-btn logout-btn-cancel"
            onClick={handleClose}
            disabled={isLoading}
            type="button"
          >
            Annuler
          </button>
          <button
            className="logout-btn logout-btn-confirm"
            onClick={handleConfirm}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? (
              <span className="logout-btn-loading">
                <span className="spinner"></span>
                Déconnexion...
              </span>
            ) : (
              "Se déconnecter"
            )}
          </button>
        </div>

        {/* Bouton fermer */}
        <button
          className="logout-modal-close"
          onClick={handleClose}
          disabled={isLoading}
          aria-label="Fermer le modal"
          type="button"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );

  // Utilisation d'un portal pour le rendu
  return createPortal(modalContent, document.body);
};

export default LogoutModal;
