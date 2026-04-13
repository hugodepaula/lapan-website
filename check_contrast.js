function luminance(r, g, b) {
  var a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(rgb1, rgb2) {
  var l1 = luminance(rgb1[0], rgb1[1], rgb1[2]) + 0.05;
  var l2 = luminance(rgb2[0], rgb2[1], rgb2[2]) + 0.05;
  return Math.max(l1, l2) / Math.min(l1, l2);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}

const colors = {
  primary: '#FFB783',
  primary_container: '#F38A2E',
  on_primary: '#4F2500',
  surface: '#494C53',
  surface_container_lowest: '#73777F',
  surface_container_low: '#5C6067',
  surface_container_high: '#3A3D42',
  surface_container_highest: '#2D3034',
  on_surface: '#F0F0F3',
  on_surface_variant: '#E0D7D0',
  secondary: '#B5C8DF',
  tertiary: '#86CFFF',
  outline_variant: '#564337'
};

const bgColors = [
  'surface_container_lowest',
  'surface_container_low',
  'surface_container_high',
  'surface_container_highest',
  'surface',
  'primary_container'
];

const textColors = [
  'on_surface',
  'on_surface_variant',
  'primary',
  'on_primary'
];

for (const bg of bgColors) {
  for (const text of textColors) {
    const ratio = contrast(hexToRgb(colors[bg]), hexToRgb(colors[text]));
    console.log(`${text} on ${bg}: ${ratio.toFixed(2)}`);
  }
}
