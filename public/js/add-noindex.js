const { href } = window.location;
if (!/hack-it-up\.ru/.test(href)) {
  const meta = document.createElement('meta');
  meta.name = 'robots';
  meta.content = 'noindex';
  document.getElementsByTagName('head')[0].appendChild(meta);
}
