import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/meta'
import { findMode } from './util'
import defaultConfig from './config/default'
import themes from './config/theme'
import events from './config/events'
import loadjs from 'loadjs'

function asyncLoad(resources, name) {
  return new Promise((resolve, reject) => {
    if (loadjs.isDefined(name)) {
      resolve()
    } else {
      loadjs(resources, name, {
        success() {
          resolve()
        },
        error() {
          progress.done()
          reject(new Error('network error'))
        }
      })
    }
  })
}

const DEFAULT_OPTIONS = {
  theme: defaultConfig.theme,
  mode: defaultConfig.mode,
  tabSize: 2
}

export default {

  template: `<div class="V-Codemirror" style="height: 100%; width: 100%">
                <textarea ref="editor"></textarea>
            </div>`,

  name: 'V-Codemirror',

  props: {
    value: String,
    marker: Function,
    theme: String,
    mode: String,
    unseenLines: Array,
    options: Object
  },

  data() {
    return {
      code: this.value,
      themes
    }
  },

  created() {
    this.loadMode()
    this.loadTheme()
  },

  mounted () {
    this.initializeEditor(this.editorOptions)
  },

  beforeDestroy () {
    this.recycleEditor()
  },

  computed: {
    editorOptions() {
      return Object.assign(DEFAULT_OPTIONS, this.options, this.theme)
    }
  },

  watch: {
    value (newVal) {
      if (newVal !== this.editor.getValue()) {
        var scrollInfo = this.editor.getScrollInfo()
        this.editor.setValue(newVal)
        this.value = newVal
        this.editor.scrollTo(scrollInfo.left, scrollInfo.top)
      }
      this.unseenLineMarkers()
    },
    theme(theme) {
      console.log(theme)
    }

  },

  methods: {

    refresh() {
      this.editor.refresh()
    },

    undo() {
      this.editor.undo()
    },

    redo() {
      this.editor.redo()
    },

    updateEditor() {
      this.recycleEditor()
      this.loadMode()
      this.loadTheme()
    },

    recycleEditor() {
      const element = this.editor.doc.cm.getWrapperElement()
      if (element && element.remove) {
        element.remove()
      }
    },

    unseenLineMarkers () {
      if (this.unseenLines !== undefined && this.marker !== undefined) {
        this.unseenLines.forEach(line => {
          var info = this.editor.lineInfo(line)
          this.editor.setGutterMarker(line, 'breakpoints', info.gutterMarkers ? null : this.marker())
        })
      }
    },

    loadTheme() {
      let { theme } = this.editorOptions
      // theme config
      if (theme && theme == 'solarized light') {
        theme = 'solarized'
      }
      if (theme) {
        return asyncLoad('./theme/' + theme + '.css')
      }
    },

    loadMode() {
      let { mode } = this.editorOptions
      const isCustomMode = !!CodeMirror.modes[mode]
      mode = findMode(CodeMirror, mode)

      if ((!mode || mode == 'null') && !isCustomMode) {
        console.warn('CodeMirror language mode: ' + mode + ' configuration error (CodeMirror language mode configuration error，or unsupported language) refer to http://codemirror.net/mode/ for more details.')
      }

      if (mode && mode !== 'null') {
        return asyncLoad('./mode/' + mode + '/' + mode + '.js')
      }
    },

    initializeEditor() {
      this.editor = CodeMirror.fromTextArea(this.$refs.editor, this.editorOptions)
      this.editor.setValue(this.code)

      this.editor.on('change', (cm) => {
        this.code = cm.getValue()
        const value = cm.getValue()
        this.$emit('input', value)
        this.$emit('change', value)
      })

      events.forEach(event => {
        this.editor.on(event, (...args) => {
          this.$emit(event, ...args)
        })
      })

      this.$emit('ready', this.editor)

      this.unseenLineMarkers()

      // prevents funky dynamic rendering
      window.setTimeout(() => {
        this.editor.refresh()
      }, 0)
    }
  }
}
