import { svgSpriteContainer } from './common/templates';
import Editor from './editor/editor.js';

import PluginManager from './plugins-manager';
import BackgroundText from './plugins/basic-background-text';
import UnorderedList from './plugins/basic-unordered-list';
import OrderedList from './plugins/basic-ordered-list';
import IndentDecrease from './plugins/basic-indent-decrease';
import IndentIncrease from './plugins/basic-indent-increase';
import Bold from './plugins/basic-bold';
import Italic from './plugins/basic-italic';
import Strikethrough from './plugins/basic-strikethrough';
import Underline from './plugins/basic-underline';
import ParagraphCenter from './plugins/basic-paragraph-center';
import ParagraphLeft from './plugins/basic-paragraph-left';
import ParagraphRight from './plugins/basic-paragraph-right';
import InsertImage from './plugins/insert-image';
import Font from './plugins/combine-font';
//import CustomizeSub from './plugins/custom-sub';

let beeji = {
  version: '0.0.1'
};

const init = {
  clickMode: (config) => {
    let divs = document.getElementsByClassName(config.className);
    for (let i = 0, len = divs.length; i < len; i++) {
      divs[i].addEventListener('click', function() {
        config.content = this.innerHTML;
        config.index = i;
        let objBee = new Editor(config);
        objBee.addEventListener();
        objBee.focus();
      });
    }
  },
  jsInvokeMode: (config) => {
    let objBee = new Editor(config);
    objBee.addEventListener();
    objBee.focus();
  }
};

window.beeji = beeji;

beeji.PluginManager = PluginManager();
beeji.PluginManager.addPlugin('unorderedlist', UnorderedList);
beeji.PluginManager.addPlugin('orderedlist', OrderedList);
beeji.PluginManager.addPlugin('insertimage', InsertImage);
beeji.PluginManager.addPlugin('indentdecrease', IndentDecrease);
beeji.PluginManager.addPlugin('indentincrease', IndentIncrease);
beeji.PluginManager.addPlugin('bold', Bold);
beeji.PluginManager.addPlugin('italic', Italic);
beeji.PluginManager.addPlugin('strikethrough', Strikethrough);
beeji.PluginManager.addPlugin('underline', Underline);
beeji.PluginManager.addPlugin('paragraphcenter', ParagraphCenter);
beeji.PluginManager.addPlugin('paragraphleft', ParagraphLeft);
beeji.PluginManager.addPlugin('paragraphright', ParagraphRight);
beeji.PluginManager.addPlugin('font', Font);
beeji.PluginManager.addPlugin('backgroundtext', BackgroundText);
//beeji.PluginManager.addPlugin('customizesub', CustomizeSub);

beeji.fly = function(initParams) {
  switch (initParams.mode) {
    case 'click-content' :
      init.clickMode(initParams);
      break;
    case 'javascript-invoke' :
      init.jsInvokeMode(initParams);
      break;
  }
};

// insert svg sprite
var frag = document.createElement('div');
frag.className = 'svg-sprite';
frag.innerHTML = svgSpriteContainer;
document.body.insertBefore(frag, document.body.childNodes[0]);
