import { Ic } from "../../../composants/Icons";

const EditForm = ({ formData, onChange, onSave, onCancel, saving }) => (
  <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-10">
    <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
        <Ic.Edit className="w-6 h-6 text-yellow-600" />
      </div>
      Éditer mon profil
    </h3>
    <p className="text-gray-600 text-sm mb-8 ml-15">
      Mettez à jour vos informations personnelles
    </p>

    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
    >
      {/* Prénom & Nom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-2">
            <Ic.User className="w-4 h-4 text-yellow-600" />
            Prénom
          </label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none text-sm transition-all placeholder:text-gray-400"
            placeholder="Votre prénom"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-2">
            <Ic.User className="w-4 h-4 text-yellow-600" />
            Nom
          </label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none text-sm transition-all placeholder:text-gray-400"
            placeholder="Votre nom"
          />
        </div>
      </div>

      {/* Email & Téléphone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-2">
            <Ic.Mail className="w-4 h-4 text-yellow-600" />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none text-sm transition-all placeholder:text-gray-400"
            placeholder="votre@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-2">
            <Ic.Phone className="w-4 h-4 text-yellow-600" />
            Téléphone
          </label>
          <input
            type="tel"
            name="telephone"
            value={formData.telephone}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none text-sm transition-all placeholder:text-gray-400"
            placeholder="+221 77 XXX XX XX"
          />
        </div>
      </div>

      {/* Matricule & Promotion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-2">
            <Ic.User className="w-4 h-4 text-yellow-600" />
            Matricule
          </label>
          <input
            type="text"
            name="matricule"
            value={formData.matricule}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none text-sm transition-all placeholder:text-gray-400"
            placeholder="ADM001"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-2">
            <Ic.Calendar className="w-4 h-4 text-yellow-600" />
            Promotion
          </label>
          <input
            type="text"
            name="promotion"
            value={formData.promotion}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none text-sm transition-all placeholder:text-gray-400"
            placeholder="2026"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all active:scale-95 text-base"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-bold hover:from-yellow-500 hover:to-amber-500 transition-all hover:shadow-lg active:scale-95 text-base disabled:opacity-50"
        >
          {saving ? "Enregistrement…" : "Enregistrer les modifications"}
        </button>
      </div>
    </form>
  </div>
);

export default EditForm;
