import { useRef, useState } from 'react';
import { uploadAdminImage } from '../../lib/api';
import MediaPicker from '../../components/admin/MediaPicker';

export default function ImagePickerField({ label, value, onChange, hint, altValue, onAltChange }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const fileInputRef = useRef(null);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const result = await uploadAdminImage(file);
      const url = result?.url || result?.path || result;
      onChange(url);
    } catch (err) {
      setError("Erreur lors de l'upload: " + (err.message || 'inconnue'));
    } finally {
      setLoading(false);
      // reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-stone-700">{label}</label>
      )}

      {/* Image preview */}
      {value && (
        <div className="relative w-full h-36 rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
          <img
            src={value}
            alt="Aperçu"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-white/80 hover:bg-white text-stone-600 rounded-full w-6 h-6 flex items-center justify-center text-xs border border-stone-200 transition"
            title="Supprimer"
          >
            ✕
          </button>
        </div>
      )}

      {/* URL input */}
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
        className="border border-stone-200 rounded-xl bg-stone-50 px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#033a22]/30 focus:border-[#033a22] transition"
      />

      {/* Upload button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="text-sm px-4 py-2 rounded-xl bg-[#033a22] text-white hover:bg-[#033a22]/90 disabled:opacity-60 disabled:cursor-not-allowed transition font-medium"
        >
          {loading ? 'Upload en cours...' : 'Choisir un fichier'}
        </button>
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className="text-sm px-4 py-2 rounded-xl bg-stone-200 text-stone-800 hover:bg-stone-300 transition font-medium"
        >
          Bibliothèque
        </button>
        {loading && (
          <div className="w-4 h-4 border-2 border-[#033a22] border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && <p className="text-xs text-stone-400">{hint}</p>}

      <MediaPicker
        open={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(media) => {
          onChange(media.url);
          if (onAltChange) onAltChange(media.altText || '');
        }}
        currentUrl={value}
      />
    </div>
  );
}
