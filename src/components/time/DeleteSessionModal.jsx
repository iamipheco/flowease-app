import { Trash2 } from "lucide-react";

const DeleteSessionModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-dark-bg2 rounded-xl p-6 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 className="w-5 h-5 text-error" />
          <h3 className="text-lg font-semibold text-dark-text">
            Delete Session
          </h3>
        </div>

        <p className="text-sm text-dark-muted mb-6">
          Are you sure you want to delete this session?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md bg-dark-bg3 text-dark-text"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm rounded-md bg-error text-white disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSessionModal;