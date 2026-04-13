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
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}
const colors = {
  primary: '#FFB783',
  surface_container_lowest: '#57595C', // Noble Gray
  surface_container_low: '#414346',
  on_surface: '#F0F0F3',
  on_surface_variant: '#E0D7D0'
};
console.log('on_surface on Noble Gray: ' + contrast(hexToRgb(colors.on_surface), hexToRgb(colors.surface_container_lowest)).toFixed(2));
console.log('primary on Noble Gray: ' + contrast(hexToRgb(colors.primary), hexToRgb(colors.surface_container_lowest)).toFixed(2));
console.log('primary on Container Low: ' + contrast(hexToRgb(colors.primary), hexToRgb(colors.surface_container_low)).toFixed(2));
