import { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function RichTextField({ label, value, onChange, hint }) {
  const [editorError, setEditorError] = useState(false);

  const handleEditorChange = (event, editor) => {
    setEditorError(false);
    onChange(editor.getData());
  };

  const handleEditorError = (error) => {
    console.error('CKEditor error:', error);
    setEditorError(true);
  };

  // If CKEditor fails (SSR, missing dependencies, etc.), show textarea fallback
  if (editorError) {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            {label}
          </label>
        )}
        <div className="mt-2 rounded-xl border border-stone-200 overflow-hidden">
          <textarea
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            rows={5}
            placeholder="HTML content (fallback textarea)"
            className="w-full px-3 py-2 text-sm text-stone-800 bg-white placeholder:text-stone-400 focus:outline-none resize-y"
          />
        </div>
        {hint && <p className="text-xs text-stone-400 mt-1">{hint}</p>}
      </div>
    );
  }

  try {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            {label}
          </label>
        )}
        <div className="mt-2 rounded-xl border border-stone-200 overflow-hidden">
          <CKEditor
            editor={ClassicEditor}
            data={value || ''}
            onChange={handleEditorChange}
            onError={handleEditorError}
            config={{
              toolbar: [
                'heading',
                '|',
                'bold',
                'italic',
                'link',
                'bulletedList',
                'numberedList',
                '|',
                'blockQuote',
                'undo',
                'redo'
              ]
            }}
          />
        </div>
        {hint && <p className="text-xs text-stone-400 mt-1">{hint}</p>}
      </div>
    );
  } catch (error) {
    console.error('Failed to render CKEditor:', error);
    setEditorError(true);
    // Return fallback on error
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            {label}
          </label>
        )}
        <div className="mt-2 rounded-xl border border-stone-200 overflow-hidden">
          <textarea
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            rows={5}
            placeholder="HTML content (fallback textarea)"
            className="w-full px-3 py-2 text-sm text-stone-800 bg-white placeholder:text-stone-400 focus:outline-none resize-y"
          />
        </div>
        {hint && <p className="text-xs text-stone-400 mt-1">{hint}</p>}
      </div>
    );
  }
}
