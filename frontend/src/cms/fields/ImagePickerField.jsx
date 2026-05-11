import { useRef, useState } from 'react';
import { Image, Upload, Trash2, Library, Loader2, Link as LinkIcon, X } from 'lucide-react';
import { uploadAdminImage } from '../../lib/api';
import MediaPicker from '../../components/admin/MediaPicker';
import { FieldWrapper } from '../FieldRenderer';
import Button from '../../components/ui/Button';

export default function ImagePickerField({ label, value, onChange, hint, required, error, description }) {
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [isUrlEdit, setIsUrlEdit] = useState(false);
  const fileInputRef = useRef(null);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const result = await uploadAdminImage(file);
      const url = result?.url || result?.path || result;
      onChange(url);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  return (
    <FieldWrapper label={label} hint={hint} required={required} error={error} description={description}>
      <div className="grid gap-3">
        {value ? (
          <div className="relative group/img rounded-2xl border border-stone-200 bg-stone-50 overflow-hidden aspect-video">
            <img
              src={value}
              alt="Aperçu"
              className="w-full h-full object-cover transition-transform group-hover/img:scale-105"
            />
            <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button size="xs" variant="secondary" onClick={() => setShowPicker(true)} icon={Library}>Changer</Button>
              <Button size="xs" variant="danger" onClick={() => onChange('')} icon={Trash2}>Retirer</Button>
            </div>
            <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-mono text-stone-600 truncate border border-stone-200">
              {value}
            </div>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center py-10 rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 hover:bg-stone-100/50 hover:border-stone-300 transition-all cursor-pointer group"
          >
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-stone-300 group-hover:text-stone-900 shadow-sm transition-all mb-3">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
            </div>
            <p className="text-xs font-bold text-stone-900">Cliquez pour uploader</p>
            <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-widest">JPG, PNG, WEBP (Max 5MB)</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          {!value && (
            <Button 
              size="xs" 
              variant="secondary" 
              onClick={() => setShowPicker(true)} 
              icon={Library}
              className="flex-1 h-10"
            >
              Médiathèque
            </Button>
          )}
          
          {isUrlEdit ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                autoFocus
                type="text"
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                onBlur={() => !value && setIsUrlEdit(false)}
                placeholder="https://..."
                className="flex-1 h-10 border border-stone-900/10 rounded-xl bg-stone-50 px-3 text-xs outline-none focus:ring-2 focus:ring-stone-900/5 transition-all"
              />
              <button onClick={() => setIsUrlEdit(false)} className="p-2 text-stone-400 hover:text-stone-900"><X size={14}/></button>
            </div>
          ) : (
            <Button 
              size="xs" 
              variant="outline" 
              onClick={() => setIsUrlEdit(true)} 
              icon={LinkIcon}
              className={`h-10 ${value ? 'w-full' : 'flex-1'}`}
            >
              Lien externe
            </Button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <MediaPicker
        open={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(media) => {
          onChange(media.url);
        }}
        currentUrl={value}
      />
    </FieldWrapper>
  );
}
