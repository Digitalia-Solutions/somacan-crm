import { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FieldWrapper } from '../FieldRenderer';

export default function RichTextField({ label, value, onChange, hint, required, error, description }) {
  const [editorError, setEditorError] = useState(false);

  const handleEditorChange = (event, editor) => {
    setEditorError(false);
    onChange(editor.getData());
  };

  const handleEditorError = (error) => {
    console.error('CKEditor error:', error);
    setEditorError(true);
  };

  const commonProps = { label, hint, required, error, description };

  if (editorError) {
    return (
      <FieldWrapper {...commonProps}>
        <textarea
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          rows={10}
          placeholder="Saisissez votre contenu HTML ici..."
          className="w-full h-64 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-stone-900/5 transition-all resize-y"
        />
      </FieldWrapper>
    );
  }

  return (
    <FieldWrapper {...commonProps}>
      <div className="rounded-xl border border-stone-200 overflow-hidden prose-sm max-w-none">
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
              'insertTable',
              'undo',
              'redo'
            ],
            placeholder: 'Commencez à écrire...',
          }}
        />
        <style>
          {`
            .ck-editor__editable_inline {
              min-height: 300px;
              padding: 0 20px !important;
            }
            .ck.ck-editor__main>.ck-editor__editable {
              background: #fafaf9 !important;
              border: none !important;
            }
            .ck.ck-toolbar {
              border: none !important;
              border-bottom: 1px solid #e7e5e4 !important;
              background: #fff !important;
              padding: 4px 8px !important;
            }
          `}
        </style>
      </div>
    </FieldWrapper>
  );
}
