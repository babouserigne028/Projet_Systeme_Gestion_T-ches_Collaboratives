const ConfirmDialog = ({ msg, onConfirm, onCancel, danger }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-sm p-6 space-y-4">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto
        ${danger ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}
      >
        {danger ? (
          <Ic.Trash className="w-6 h-6" />
        ) : (
          <Ic.Lock className="w-6 h-6" />
        )}
      </div>
      <p className="text-sm text-gray-700 text-center font-medium">{msg}</p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600
          hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Annuler
        </button>
        <button
          onClick={onConfirm}
          className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-colors cursor-pointer text-white
            ${danger ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"}`}
        >
          Confirmer
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;