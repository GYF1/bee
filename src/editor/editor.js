import './editor.css';

import { generateClickerModalHTML } from '../common/templates';
import utility from '../common/utility';

let selection = document.getSelection();

class Editor {
  constructor(config) {
    var divModal = document.createElement('div');
    divModal.className = 'bee-backdrop';
    divModal.innerHTML = generateClickerModalHTML(config);
    document.body.appendChild(divModal);

    this.modal = divModal;

    this.config = config;
    this.editor = this.modal.querySelector('div#bee-editor-content');

    this.pluginManager = window.beeji.PluginManager;
    this.initPlugins(config.plugins);
  }

  initPlugins(plugins) {
    let pluginsLength = plugins.length;
    let defaultMenuItemWidth = 100 / pluginsLength;
    var docfrag = document.createDocumentFragment();

    plugins.forEach((pluginKey) => {
      var plugin = this.pluginManager.getPlugin(pluginKey);
      if (!plugin) {
        console.log(`${pluginKey} is not existed.`);
        return;
      }

      let liElement;
      liElement = pluginsLength <= 6 ? this._pluginToLiElement(plugin, defaultMenuItemWidth) : this._pluginToLiElement(plugin);
      docfrag.appendChild(liElement);

      if (plugin.svg) this._insertSvgSymbol(plugin.svg);
      if (plugin.eventSelector && plugin.eventType && plugin.eventCallback) this._listenPluginEvent(docfrag, plugin);
      if (plugin.stylesheet) this._insertStylesheet(plugin.stylesheet);
      if (plugin.plugins) this.generateSubPlugins(plugin.plugins);
    });

    var footMenuList = this.modal.querySelector('ul.bee-modal-footer-menu');
    footMenuList.appendChild(docfrag);

    if (pluginsLength > 6) {
      footMenuList.style.width = (window.innerWidth - 80) + 'px';
      this.modal.querySelector('.bee-modal-footer').classList.toggle('show-more-button');
    }
  }

  generateSubPlugins(plugins) {
    let docfrag = document.createDocumentFragment();
    plugins.forEach((pluginLine) => {
      let ulElement = document.createElement('ul');
      ulElement.className = 'sub-menu';
      console.log(pluginLine);
      let defaultMenuItemWidth = 100 / pluginLine.length;
      pluginLine.forEach((pluginKey) => {
        var plugin = this.pluginManager.getPlugin(pluginKey);
        if (!plugin) {
          console.log(`${pluginKey} is not existed.`);
          return;
        }

        ulElement.appendChild(this._pluginToLiElement(plugin, defaultMenuItemWidth));
        if (plugin.svg)  this._insertSvgSymbol(plugin.svg)
        if (plugin.eventSelector && plugin.eventType && plugin.eventCallback) this._listenPluginEvent(ulElement, plugin);
        if (plugin.stylesheet) this._insertStylesheet(plugin.stylesheet);
      });

      docfrag.appendChild(ulElement);

    });

    var footMenuList = this.modal.querySelector('.bee-modal-footer');
    footMenuList.appendChild(docfrag);
  }

  _insertStylesheet(stylesheet) {
    let style = document.createElement('style');
    style.appendChild(document.createTextNode(stylesheet));
    document.head.appendChild(style);
  }

  _listenPluginEvent(docfrag, plugin) {
    let target = docfrag.querySelector(plugin.eventSelector);
    target.addEventListener(plugin.eventType, plugin.eventCallback(this));
  }

  _insertSvgSymbol(svg) {
    var svgSprite = document.body.querySelector('.svg-sprite symbol');
    svgSprite.insertAdjacentHTML('beforebegin', svg);
  }

  _pluginToLiElement(plugin, width) {
    var li = document.createElement('li');
    console.log('plugin.className::', plugin.className);
    li.className = plugin.className + ' menu-item';
    if (width) li.style.width = width + '%';

    if (plugin.icon) {
      li.innerHTML = `
          <svg class="icon ${plugin.icon}"><use xlink:href="#${plugin.icon}"></use></svg>
        `;
    } else if (plugin.template) {
      li.innerHTML = plugin.template;
    }

    return li;
  }

  addEventListener() {
    this.modal.querySelector('div.bee-modal').addEventListener('click', (event) => {
      utility.stopPropagation(event);
    });

    this.modal.querySelector('button.bee-btn-cancel').addEventListener('click', (event) => {
      utility.stopPropagation(event);
      utility.destroy(this.modal);
    });

    this.modal.querySelector('button.bee-btn-ok').addEventListener('click', (event) => {
      utility.stopPropagation(event);
      let modifiedHTML = this.editor.innerHTML;
      this.config.okCallback(modifiedHTML, this.config.index);
      utility.destroy(this.modal);
    });

    this.modal.querySelector('div#bee-editor-content').addEventListener('blur', () => {
      if (selection.getRangeAt && selection.rangeCount) {
        this.setRange(selection.getRangeAt(0));
      }
    }, true);


    //this.modal.querySelector('li.handwriting').addEventListener('click', () => {
    //  var classNameStr = this.className;
    //  if (classNameStr.indexOf('active') === -1) {
    //    this.className = classNameStr + ' active';
    //    this.openHandWritingPanel();
    //  } else {
    //    this.className = classNameStr.replace(/\bactive\b/,'');
    //    this.removeHandWritingPanel();
    //  }
    //});
  }

  focus(focusStart) {
    if (!focusStart) this.setRange();
    this.editor.focus();
    return this;
  }

  setRange(range) {
    range = range || this._range;
    if (!range) {
      range = this.getRange();
      range.collapse(false); // set to end
    }
    try {
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (e) {/* IE throws error sometimes*/}
    return this;
  }

  getRange() {
    var editor = this.editor, range = selection.rangeCount && selection.getRangeAt(0);
    if (!range) range = document.createRange();
    if (!utility.containsNode(editor, range.commonAncestorContainer)) {
      range.selectNodeContents(editor);
      range.collapse(false);
    }
    return range;
  }
}

export default Editor;