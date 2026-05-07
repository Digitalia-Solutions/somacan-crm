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

/**
 * FieldRenderer — central dispatcher that renders the right field component
 * based on a field definition object.
 *
 * @param {object} field  - { type, name, label, placeholder, options, fields, hint, required, multiple }
 * @param {*}      value  - current value for this field
 * @param {function} onChange - (newValue) => void
 */
export default function FieldRenderer({ field, value, onChange }) {
  const common = {
    label: field.label,
    hint: field.hint,
    onChange,
  };

  switch (field.type) {
    case 'text':
      return (
        <TextField
          {...common}
          value={value}
          placeholder={field.placeholder}
          required={field.required}
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
          label={field.label}
          value={value}
          onChange={onChange}
        />
      );

    case 'responsive':
      return (
        <ResponsiveField
          label={field.label}
          value={value}
          onChange={onChange}
        />
      );

    default:
      return (
        <TextField
          {...common}
          value={value}
          placeholder={field.placeholder}
          required={field.required}
        />
      );
  }
}
