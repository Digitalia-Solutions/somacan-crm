import React from 'react';
import TextField from './fields/TextField';
import TextareaField from './fields/TextareaField';
import RichTextField from './fields/RichTextField';
import ColorPickerField from './fields/ColorPickerField';
import ImagePickerField from './fields/ImagePickerField';
import LinkField from './fields/LinkField';
import SelectField from './fields/SelectField';
import SwitchField from './fields/SwitchField';
import RepeaterField from './fields/RepeaterField';
import ProductSelectorField from './fields/ProductSelectorField';
import CategorySelectorField from './fields/CategorySelectorField';
import IconPickerField from './fields/IconPickerField';
import AnimationControlsField from './fields/AnimationControlsField';
import ResponsiveField from './fields/ResponsiveField';
import { HelpCircle, AlertCircle } from 'lucide-react';

/**
 * Standard Field Wrapper
 */
export function FieldWrapper({ label, hint, required, error, children, className = '', description }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        {label && (
          <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-stone-500 flex items-center gap-1.5">
            {label}
            {required && <span className="text-red-400">*</span>}
          </label>
        )}
        {hint && (
          <div className="group relative">
            <HelpCircle size={14} className="text-stone-300 cursor-help hover:text-stone-600 transition-colors" />
            <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-stone-900 text-white text-[10px] rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 shadow-2xl leading-relaxed">
              {hint}
            </div>
          </div>
        )}
      </div>

      {description && (
        <p className="text-[10px] text-stone-400 -mt-1 leading-relaxed">{description}</p>
      )}
      
      <div className="relative group/field">
        {children}
        <div className="absolute inset-0 rounded-xl pointer-events-none border border-transparent group-focus-within/field:border-stone-900/10 transition-all" />
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 mt-0.5 px-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}

export default function FieldRenderer({ field, value, onChange, error }) {
  const common = {
    label: field.label,
    hint: field.hint,
    description: field.description || field.helpText,
    required: field.required,
    error: error || field.error,
    onChange,
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            {...common}
            value={value}
            placeholder={field.placeholder}
          />
        );

      case 'textarea':
        return (
          <TextareaField
            {...common}
            value={value}
            placeholder={field.placeholder}
            rows={field.rows}
          />
        );

      case 'richtext':
        return <RichTextField {...common} value={value} />;

      case 'color':
        return <ColorPickerField {...common} value={value} />;

      case 'image':
        return <ImagePickerField {...common} value={value} />;

      case 'link':
        return <LinkField {...common} value={value} />;

      case 'select':
        return (
          <SelectField
            {...common}
            value={value}
            options={field.options || []}
          />
        );

      case 'switch':
        return <SwitchField {...common} value={value} />;

      case 'repeater':
        return (
          <RepeaterField
            {...common}
            value={value}
            fields={field.fields || []}
          />
        );

      case 'product-selector':
        return (
          <ProductSelectorField
            {...common}
            value={value}
            multiple={field.multiple}
          />
        );

      case 'category-selector':
        return (
          <CategorySelectorField
            {...common}
            value={value}
            multiple={field.multiple}
          />
        );

      case 'icon':
        return <IconPickerField {...common} value={value} />;

      case 'animation':
        return (
          <AnimationControlsField
            {...common}
            value={value}
          />
        );

      case 'responsive':
        return (
          <ResponsiveField
            {...common}
            value={value}
          />
        );

      default:
        return (
          <TextField
            {...common}
            value={value}
            placeholder={field.placeholder}
          />
        );
    }
  };

  // We wrap the specific field components. 
  // Most components will still handle their own labels for fine-grained control, 
  // but we provide FieldWrapper as a utility they can use.
  return renderField();
}
