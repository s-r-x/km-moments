import webfont from 'webfontloader';

webfont.load({
  google: {
    families: [ 'Lobster', 'PT Sans' ],
  },
  active: () => __ee__.emit('font_loaded'),
});
