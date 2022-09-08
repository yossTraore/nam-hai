import Preloader from '../Pages/preloader/preloader';
import Home from '../Pages/Home/home';
import Collections from '../Pages/Collections/collections';
import TransitionHomeCollections from '../animation/TransitionHomeCollections';
import TransitionPreloaderHome from '../animation/TransitionPreloaderHome';
import TransitionCollectionsHome from '../animation/TransitionCollectionsHome';
import Contact from '../Pages/Contact/contact';
import TransitionHomeContact from '../animation/TransitionHomeContact';
import TransitionContactHome from '../animation/TransitionContactHome';
import { N } from '../utils/namhai';

const transitionMap = new Map([
  ['home => collections', TransitionHomeCollections],
  ['collections => home', TransitionCollectionsHome],
  ['preloader => home', TransitionPreloaderHome],
  ['home => contact', TransitionHomeContact],
  ['contact => home', TransitionContactHome]
])

export default class Router {

  constructor() {
    this.pageManager = {
      'home': Home,
      'collections': Collections,
      'contact': Contact
    }

  }

  getPage(route) {
    return this.pageManager[route] || Home
  }

  getRoute() {
    return this.path
  }

  resetPath() {
    window.history.pushState('', 'Nam Hai portfolio', '/')
    this.path = 'preloader'
  }

  async transitionOnChange(url, canvas) {
    const key = this.path + ' => ' + url
    let t = transitionMap.get(key)
    if (t) {
      N.PE.none(document.body)
      await new Promise(s => {
        t = new t({ cb: s, canvas, oldRoute: this.path, route: url })
        t.play()
      })
      N.PE.all(document.body)
    } else {
      canvas.hide(this.path)
      canvas.onChange(url)
    }
  }
}

