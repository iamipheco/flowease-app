// src/components/time/EditSessionModal.jsx
import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

const EditSessionModal = ({ isOpen, onClose, session, onSubmit, isLoading }) => {
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (session) setDescription(session.description || "");
  }, [session]);

  const handleSave = () => {
    if (!session) return;
    onSubmit({ id: session._id, data: { description } });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Panel className="bg-dark-bg2 rounded-lg max-w-md w-full p-6 space-y-4 relative">
          <Dialog.Title className="text-lg font-bold text-dark-text flex justify-between items-center">
            Edit Session
            <button onClick={onClose}>
              <X className="w-5 h-5 text-dark-muted hover:text-dark-text" />
            </button>
          </Dialog.Title>
          <textarea
            className="w-full p-2 rounded border border-dark-border bg-dark-bg3 text-dark-text"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-3 py-1 rounded bg-dark-bg3 text-dark-text hover:bg-dark-border">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 rounded bg-primary text-white flex items-center gap-1 hover:bg-primary/90"
              disabled={isLoading}
            >
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditSessionModal;