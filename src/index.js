/**
 * Vue-CodeMirror
 * @author Surmon.me
 */

window.CodeMirror = require('codemirror/lib/codemirror.js')
var CmComponent = require('./EVUE.vue')
CmComponent = CmComponent.default || CmComponent

var Codemirror = {
  CodeMirror: CodeMirror,
  codemirror: CmComponent,
  install: function(Vue) {
    Vue.component(CmComponent.name, CmComponent)
  }
}

module.exports = Codemirror
