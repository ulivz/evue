/*!
 * V-Codemirror v1.0.0
 * (c) 2016-2017 ulivz <Luke Chen>
 * Released under the MIT License.
 */
import VCodemirror from './src/V-Codemirror.js'
import THEME from './src/config/theme.json'
import Codemirror from 'codemirror'
import {findMode} from './src/util'

function install(Vue) {
	Vue.component(VCodemirror.name, VCodemirror)
}

const findModeByMIME = Codemirror.findModeByMIME
const findModeByExtension = Codemirror.findModeByExtension
const findModeByFileName = Codemirror.findModeByFileName
const findModeByName = Codemirror.findModeByName

export {
	install as default,
	VCodemirror,
	THEME,
	findMode,
	findModeByMIME,
	findModeByExtension,
	findModeByFileName,
	findModeByName
}