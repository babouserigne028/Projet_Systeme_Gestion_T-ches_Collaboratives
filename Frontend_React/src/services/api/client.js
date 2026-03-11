import { API_URL, buildApiUrl } from "../../config/api";

/**
 * Client HTTP centralisé pour tous les appels API
 * Gère automatiquement les headers, le token et les erreurs
 */
class ApiClient {
  constructor(baseURL = API_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Méthode générique pour faire une requête HTTP
   * @param {string} endpoint - L'URL relative (ex: /api/employe)
   * @param {object} options - Options fetch (method, body, headers, etc.)
   * @returns {Promise} - Les données JSON de la réponse
   */
  async request(endpoint, options = {}) {
    const token = sessionStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const fullUrl = buildApiUrl(endpoint);
    try {
      const res = await fetch(fullUrl, {
        ...options,
        headers,
      });
      if (!res.ok) {
        let errorData = {};
        try {
          errorData = await res.json();
        } catch (e) {
          errorData = { detail: res.statusText };
        }

        if (
          res.status === 401 &&
          (endpoint === "/api/login" || endpoint === "/api/login/")
        ) {
          // Pour le login, on retourne le message du serveur
          const error = new Error(
            errorData.detail || "Email ou Mot de Passe Incorrecte",
          );
          error.response = { data: errorData, status: res.status };
          throw error;
        }
        if (res.status === 401) {
          // Tentative de refresh du token si possible
          const refresh = localStorage.getItem("refresh");
          if (refresh) {
            try {
              const refreshRes = await fetch(
                `${this.baseURL}/api/token/refresh/`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ refresh }),
                },
              );
              if (refreshRes.ok) {
                const { access } = await refreshRes.json();
                sessionStorage.setItem("token", access);
                return this.request(endpoint, options);
              }
            } catch (refreshErr) {
              // Erreur lors du refresh, on continue la gestion classique
            }
          }
          // Token invalide ou expiré, suppression et redirection
          sessionStorage.removeItem("token");
          localStorage.removeItem("refresh");
          window.location.href = "/";
          throw new Error("Session expirée, veuillez vous reconnecter");
        }
        const error = new Error(
          errorData.detail || `HTTP ${res.status}: ${res.statusText}`,
        );
        error.response = { data: errorData, status: res.status };
        throw error;
      }

      if (res.status === 204) {
        return null;
      }
      const data = await res.json();
      return data;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Requête GET
   * @param {string} endpoint
   * @returns {Promise}
   */
  get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  /**
   * Requête POST
   * @param {string} endpoint
   * @param {object} data - Les données à envoyer
   * @returns {Promise}
   */
  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Requête
   * PUT
   * @param {string} endpoint
   * @param {object} data - Les données à envoyer
   * @returns {Promise}
   */
  put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Requête PATCH
   * @param {string} endpoint
   * @param {object} data - Les données à envoyer
   * @returns {Promise}
   */
  patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  /**
   * Requête DELETE
   * @param {string} endpoint
   * @returns {Promise}
   */
  delete(endpoint, data) {
    return this.request(endpoint, {
      method: "DELETE",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Requête upload (multipart/form-data)
   * @param {string} endpoint
   * @param {FormData} formData
   * @param {string} method
   * @returns {Promise}
   */
  upload(endpoint, formData, method = "PATCH") {
    const token = sessionStorage.getItem("token");
    const headers = {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const fullUrl = buildApiUrl(endpoint);
    return fetch(fullUrl, {
      method,
      headers,
      body: formData,
    }).then(async (res) => {
      if (!res.ok) {
        let errorData = {};
        try {
          errorData = await res.json();
        } catch {
          errorData = { detail: res.statusText };
        }
        throw new Error(errorData.detail || `HTTP ${res.status}`);
      }
      return res.json();
    });
  }
}

export default new ApiClient();
