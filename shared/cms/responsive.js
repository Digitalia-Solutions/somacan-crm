export const CMS_DEVICES = ['desktop', 'tablet', 'mobile'];

export const DEFAULT_DEVICE_RESPONSIVE = {
  visible: true,
  padding: '',
  margin: '',
  alignment: 'inherit',
  width: 'auto',
  typography: {
    fontSize: '',
    lineHeight: '',
    letterSpacing: '',
  },
};

export function createResponsiveValue(overrides = {}) {
  return CMS_DEVICES.reduce((acc, device) => {
    const value = overrides[device] || {};
    acc[device] = {
      ...DEFAULT_DEVICE_RESPONSIVE,
      ...value,
      typography: {
        ...DEFAULT_DEVICE_RESPONSIVE.typography,
        ...(value.typography || {}),
      },
    };
    return acc;
  }, {});
}

export function normalizeResponsiveValue(value) {
  return createResponsiveValue(value || {});
}

export function getResponsiveDeviceValue(responsive, device) {
  return normalizeResponsiveValue(responsive)[device];
}
