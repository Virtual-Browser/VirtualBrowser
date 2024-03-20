let testFontEle

function getFontSize(font) {
  testFontEle.style.fontFamily = font
  return testFontEle.offsetWidth + ',' + testFontEle.offsetHeight
}

function createTestEle() {
  const ele = document.createElement('div')
  ele.style.cssText = `
    position: absolute;
    left: -9999px;
    top: -9999px;
  `
  ele.innerHTML = `<span style="font-size:128px">mmmMMMmmmlllmmmLLL₹▁₺ꜽ₸׆ẞॿmmmiiimmmIIImmmwwwmmmWWW</span>`

  document.body.appendChild(ele)

  return ele
}

export function getFontList() {
  var excludedFonts = [
    'Arial',
    'Calibri',
    'Cambria Math',
    'Cambria',
    'Candara',
    'Comic Sans MS',
    'Consolas',
    'Constantia',
    'Corbel',
    'Courier New',
    'Ebrima',
    'Franklin Gothic',
    'Gabriola',
    'Georgia',
    'Impact',
    'Lucida Console',
    'Lucida Sans Unicode',
    'MS Gothic',
    'MS PGothic',
    'MV Boli',
    'Malgun Gothic',
    'Marlett',
    'Microsoft Himalaya',
    'Microsoft JhengHei',
    'Microsoft New Tai Lue',
    'Microsoft PhagsPa',
    'Microsoft Sans Serif',
    'Microsoft YaHei',
    'Microsoft Yi Baiti',
    'MingLiU-ExtB',
    'Mongolian Baiti',
    'PMingLiU-ExtB',
    'Palatino Linotype',
    'Segoe Print',
    'Segoe Script',
    'Segoe UI Symbol',
    'Segoe UI',
    'SimSun',
    'SimSun-ExtB',
    'Trebuchet MS',
    'Sylfaen',
    'Verdana',
    'Webdings',
    'Gadugi',
    'Javanese Text',
    'Microsoft JhengHei UI',
    'Myanmar Text',
    'Sitka Small',
    'Yu Gothic',
    'MS UI Gothic',
    'Microsoft Tai Le',
    'MingLiU_HKSCS-ExtB',
    'Symbol',
    'Segoe UI Emoji',
    'Bahnschrift'
  ]
  var fonts =
    'Sitka Banner;Mshtakan;DIN Condensed;Krungthep;Damascus;NSimSun Regular;Noto Nastaliq Urdu;Fixedsys Regular;Avenir Next Condensed;STIXIntegralsD;Gill Sans;Nirmala UI Semilight;Bangla Sangam MN;PT Serif Caption;Lao Sangam MN;STIXIntegralsUp;Leelawadee UI Semilight;Hiragino Sans;Tamil MN;Apple Chancery;STIXSizeTwoSym;Modern;Futura;Bodoni Ornaments;Big Caslon;Helvetica Neue;Roman Regular;Diwan Kufi;Symbol Regular;Tahoma;Rockwell;Roman;Microsoft JhengHei UI Light;Nadeem;Corsiva Hebrew;NSimsun;Chalkboard;Brush Script MT;Myanmar MN;Zapfino;Kohinoor Bangla;MingLiu_HKSCS-ExtB Regular;Charter;Trattatello;STIXVariants;Mongolia Baiti Regular;Bangla MN;Hoefler Text;Telugu MN;Segoe UI Light;HoloLens MDL2 Assets Regular;Impact Regular;Songti SC;Kefa;Herculanum;Malgun Gothic Semilight;Lucida Grande;Wingdings;Raanana;Al Tarikh;Hiragino Sans GB;Microsoft JhengHei Light;Al Bayan;MS Sans Serif Regular;American Typewriter;HoloLens MDL2 Assets;AppleGothic;Oriya Sangam MN;Beirut;Segoe UI Historic;sinhala Sangam MN;Apple Color Emoji;Telugu Sangam MN;Skia;New Peninim MT;Gujarati Sangam MN;MS Gothic Regular;Wingdings Regular;Script;Myanmar Tet;Bradley Hand;Menlo;Gabriola Regular;Tamil Sangam MN;PT Serif;BlinkMacSystemFont;Microsoft Himalaya Regular;Segoe UI Emoji Regular;Andale Mono;Sylfaen Regular;Apple Symbols;Segoe UI Historic Regular;MingLiu-ExtB Regular;Zapf Dingbats;Yu Gothic Medium;Luminari;STSong;Cochin;Caurier Regular;Comic Sans;Script Regular;Palatino;STIXSizeFiveSym;STIXSizeThreeSym;Avenir Next;Yu Gothic Light;Nimarla UI;Sitka Heading;Baghdad;Thonburi;Yu Gothic UI Light;Diwan Thuluth;Lao MN;Heiti Sc;Khmer MN;PT Sans Caption;Sana;Microsoft Sans Serif Regular;Oriya MN;Gurmukhi MN;Segoe UI Black;GB18030 Bitmap;SimSun Regular;PingFang HK;Modern Regular;MS Sans Serif;Calibri Light;Monaco;MV Boli Regular;Chalkboard SE;Waseem;Copperplate;ITF Devanagari;MS Serif;Songti TC;Segoe UI Semibold;Chalkduster;Comic Sans MS Bold;AppleMyungjo;Farisi;Microsoft PhangsPa;STIXIntegralsUpD;Noteworthy;Savoye LET;KufiStandardGK;Snell Roundhand;Kokonor;Sitka Display;Gurmukhi Sangam MN;Phosphate;Fixedsys;Didot;Geneva;Sathu;Lucida Sans Unicode Regular;PT Mono;InaiMathi;Devanagari MT;Leelawadee UI;Geeza Pro;Javanese Text Regular;Segoe UI Symbol Regular;Sukhumvit Set;DIN Alternate;System Bold;SimSun-ExtB Regular;DecoType Naskh;Yu Gothic UI Semibold;Kohinoor Telugu;Avenir;MS UI Gothic Regular;Segoe MDL2 Assets;Lucida Console Regular;STIXSizeFourSym;Papyrus;STIXSizeOneSym;Myanmar Sangam MN;Small Fonts;Terminal;Baskerville;Muna;Gujarati MT;Mishafi Gold;Franklin Gothic Medium;Optima;Apple Braille;Kannada MN;PT Sans;System;Segoe UI Semilight;Small Fonts Regular;MS Serif Regular;SignPainter;STIXIntegralsUpSm;Helvetica;Nirmala UI;Apple SD Gothic Neo;Euphemia UCAS;Segoe MDL2 Assets Regular'.split(
      ';'
    )

  var baseFonts = ['default', 'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy']
  fonts = fonts.filter(font => !excludedFonts.includes(font))

  testFontEle = createTestEle()

  var baseFontSize = {}
  for (var i = 0; i < baseFonts.length; i++) {
    var size = getFontSize(baseFonts[i])
    if (!baseFontSize[size]) baseFontSize[size] = ''
    if (baseFontSize[size] !== '') baseFontSize[size] += ', '

    baseFontSize[size] += baseFonts[i]
  }

  var allFontSize = {}
  var count = 0
  for (var j = 0; j < fonts.length; j++) {
    size = getFontSize(fonts[j])
    if (!baseFontSize[size]) {
      allFontSize[size] || (allFontSize[size] = '')
      allFontSize[size] !== '' && (allFontSize[size] += ', ')
      allFontSize[size] += fonts[j]
      count++
    }
  }

  return Object.values(allFontSize)
}
