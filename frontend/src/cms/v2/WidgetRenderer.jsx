import React from 'react';
import { getWidgetDef } from './WidgetRegistry.jsx';

/**
 * WidgetRenderer
 * 
 * The main component used to render a single widget.
 * It fetches the renderer from the WidgetRegistry.
 */
export default function WidgetRenderer({ widget }) {
  if (!widget || !widget.type) {
    return null;
  }

  const definition = getWidgetDef(widget.type);
  if (!definition?.renderer) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[WidgetRenderer] No renderer found for type: ${widget.type}`);
    }
    return null;
  }

  const Renderer = definition.renderer;
  
  // Each widget renderer is responsible for its own Shell wrapping 
  // (currently handled inside WidgetRegistry's individual renderers)
  return <Renderer widget={widget} />;
}

/**
 * WidgetTreeRenderer
 * 
 * Renders a flat array of widgets.
 */
export function WidgetTreeRenderer({ widgets = [] }) {
  if (!Array.isArray(widgets)) return null;
  
  return (
    <>
      {widgets.map((widget) => (
        <WidgetRenderer key={widget.id || Math.random()} widget={widget} />
      ))}
    </>
  );
}
