import { canvas } from "../Canvas/canvas"
import { N } from "../utils/namhai"
import { stringLetterToDoubleSpan } from "../utils/utilsText"

class CollectionsService {
  constructor() {
    this.currentPage = 0

    this.collectionsInfo = [
      { bg: '#171717', c: '#E5DFDF', flavour: 'IA', name: 'Midjourney', image1: 'collections/noise1.png', image2: 'collections/noise2.png' },
      { bg: '#F0BDBD', c: '#FF4A0B', flavour: 'Typography', name: 'Travis', image1: 'collections/travis1.png', image2: 'collections/travis2.png' },
      { bg: '#131721', c: '#DA2607', flavour: 'ia', name: 'midjourney', image1: 'collections/wrath1.png', image2: 'collections/wrath2.png' },
      { bg: '#171717', c: '#E5DFDF', flavour: 'IA', name: 'Midjourney', image1: 'collections/noise1.png', image2: 'collections/noise2.png' },

    ]
  }
  increaseCounter() {
    this.currentPage++
    if (this.currentPage === this.collectionsInfo.length - 1) this.currentPage = 0
  }

  getBufferImg(media, i) {
    let image = new window.Image()
    image.crossOrigin = 'anonymous'
    image.src = this.collectionsInfo[this.currentPage][`image${+i + 1}`]
    image.onload = () => media.texture.image = image
  }

  getInfo() {
    return this.collectionsInfo[this.currentPage]
  }
}
export const collectionsService = new CollectionsService();

export default class collectionsNext {
  constructor() {
    collectionsService.increaseCounter()
    this.canvas = canvas



    let bB = N.get('.buffer__background')
    bB.style.backgroundColor = collectionsService.getInfo().bg
    this.titleWrapperBuffer = N.get('.buffer__title')

    let navf = N.get('.true__title .nav__title__flavour')
    let navn = N.get('.true__title .nav__title__name')
    let navTitleNameSpans = N.getAll('.true__title .nav__title__name span span')
    let navTitleFlavourSpans = N.getAll('.true__title .nav__title__flavour span span')

    let navnB = N.get('.buffer__title .nav__title__name')
    let navfB = N.get('.buffer__title .nav__title__flavour')
    navnB.innerHTML = collectionsService.getInfo().name
    navfB.innerHTML = collectionsService.getInfo().flavour
    navnB.style.color = collectionsService.getInfo().c
    navfB.style.color = collectionsService.getInfo().c

    stringLetterToDoubleSpan(navfB, 'tooltip__span')
    stringLetterToDoubleSpan(navnB, 'tooltip__span')
    let navTitleFlavourBufferSpans = N.getAll('span span', navfB)
    let navTitleNameBufferSpans = N.getAll('span span', navnB)


    this.tl = new N.TL
    this.tl.from({
      d: 1000,
      el: bB,
      p: {
        o: [0, 1]
      },
      // update: t => {

      // },
      e: 'io5',
    })

    this.tl.from({
      d: 450,
      el: [...navTitleFlavourSpans, ...navTitleNameSpans],
      p: {
        x: [0, -100]
      },
      e: 'o5'
    })

    this.tl.from({
      d: 450,
      el: [...navTitleFlavourBufferSpans, ...navTitleNameBufferSpans],
      p: {
        x: [-100, 0],
      },
      cb: () => {
        this.calculNextState(navf, navn, navfB, navnB)
      },
      e: 'o5',
      delay: 200
    })

    this.canvasAnimation()

  }

  calculNextState(navf, navn, navfB, navnB) {


    N.get('main').style.backgroundColor = collectionsService.getInfo().bg
    navf.innerHTML = navfB.innerHTML
    navn.innerHTML = navnB.innerHTML

    navf.style.color = collectionsService.getInfo().c
    navn.style.color = collectionsService.getInfo().c
    N.O(this.titleWrapperBuffer, 0)
  }

  play() {
    const fixations = N.getAll('.fixation')
    fixations.forEach(f => {
      f.style.backgroundColor = collectionsService.getInfo().c
    })

    const ressorts = N.getAll('ressort-button')
    ressorts.forEach(r => {
      r.style.color = collectionsService.getInfo().c
      N.get('button', r).style.backgroundColor = collectionsService.getInfo().c
    })
    N.O(this.titleWrapperBuffer, 1)
    this.tl.play()
  }

  canvasAnimation() {
    const d = 500, delay = 1000, e = 'io5', zF = -0.5
    const force = .5
    this.canvas = canvas
    Object.entries(this.canvas.collections.mediasBuffer).forEach(([index, mB]) => {
      collectionsService.getBufferImg(mB, index)
    })
    let mediasBuffer = this.canvas.collections.mediasBuffer
    const mB = mediasBuffer[1], mB2 = mediasBuffer[0]
    let medias = this.canvas.collections.medias

    let m = medias[1]
    let m2 = medias[0]


    this.tl.from({
      d: d / 4,
      e: 'i1',
      update: (t) => {
        [...medias, ...mediasBuffer].forEach(m => {
          m.program.uniforms.force.value = N.Lerp(0, force, t.progE)
        })
      }
    })

    this.tl.from({
      d: d * 2,
      e: 'io3',
      update: t => {
        [...medias, ...mediasBuffer].forEach(m => {
          m.program.uniforms.target.value = m.canvasSize.width * (0.5 - t.progE)
        })
      }
    })
    this.tl.from({
      d: d,
      e: 'i3',
      update: (t) => {
        m.mesh.scale.x = m.bounds.width * (1 - t.progE)
        m.mesh.position.x = (m.boundsPixel.x - m.canvasSizePixel.width / 2) * m.canvasSize.width / m.canvasSizePixel.width + m.bounds.width * (1 - t.progE) / 2

        m.program.uniforms.s.value = [1 / (1 - t.progE), 1]
        m.program.uniforms.t.value = [- t.progE / 2, 0]

        mB.mesh.scale.x = mB.bounds.width * t.progE
        mB.mesh.position.x = (mB.boundsPixel.x - mB.canvasSizePixel.width / 2) * mB.canvasSize.width / mB.canvasSizePixel.width + mB.bounds.width * (2 - t.progE) / 2

        mB.program.uniforms.s.value = [1 / t.progE, 1]
        mB.program.uniforms.t.value = [.5 - t.progE / 2, 0]

      },
    })
    this.tl.from({
      delay: d,
      d: d,
      e: 'o3',
      update: (t) => {
        m2.mesh.scale.x = m2.bounds.width * (1 - t.progE)
        m2.mesh.position.x = (m2.boundsPixel.x - m2.canvasSizePixel.width / 2) * m2.canvasSize.width / m2.canvasSizePixel.width + m2.bounds.width * (1 - t.progE) / 2

        m2.program.uniforms.s.value = [1 / (1 - t.progE), 1]
        m2.program.uniforms.t.value = [-t.progE / 2, 0]
        mB2.mesh.scale.x = mB2.bounds.width * t.progE
        mB2.mesh.position.x = (mB2.boundsPixel.x - mB2.canvasSizePixel.width / 2) * mB2.canvasSize.width / mB2.canvasSizePixel.width + mB2.bounds.width * (2 - t.progE) / 2

        mB2.program.uniforms.s.value = [1 / t.progE, 1]
        mB2.program.uniforms.t.value = [0.5 - t.progE / 2, 0]


        if (t.prog > .7) {
          m2.program.uniforms.force.value = N.map(t.prog, 0.7, 1, force, 0)
          mB2.program.uniforms.force.value = N.map(t.prog, 0.7, 1, force, 0)
        }
      },
      cb: _ => {
        m.texture.image = mB.texture.image
        m2.texture.image = mB2.texture.image
        m.setScale()
        m2.setScale()
        mB.mesh.scale.x = 0
        mB2.mesh.scale.x = 0
      }
    })

  }


}

