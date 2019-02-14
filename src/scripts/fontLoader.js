import webfont from 'webfontloader';

webfont.load({
  google: {
    families: [ 'Lobster:400:cyrillic', 'PT Sans:400:cyrillic' ],
  },
  active: () => __ee__.emit('font_loaded'),
});
