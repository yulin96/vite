export class CanvasAnimation {
  private option: {
    urlPrefix: string
    suffix: string
    MaxL: number
    el: string
    dpr: number
    poster?: boolean
    posterUrl?: string
    loop?: boolean
    replayLoopTo?: number
    replayLoopFrom?: number
    frame: number
    gap?: number
  }
  private imgArr: HTMLImageElement[] = []
  private canvas: HTMLCanvasElement
  private xtc: CanvasRenderingContext2D
  private CW: number = 0
  private CH: number = 0
  private timer: number | any
  private frameIndex = 0
  private framePlaying = false
  public gap = 0
  private canPlay = true

  constructor(option: CanvasAnimation['option']) {
    this.option = option
    this.canvas = document.getElementById(this.option.el) as HTMLCanvasElement
    this.xtc = this.canvas.getContext('2d')!
    this.CreateImgList()
    this.gap = this.option.gap || this.gap
  }

  private CreateImgList() {
    for (let i = 1; i < this.option.MaxL + 1; i++) {
      const img = new Image()
      img.onload = () => {
        this.imgArr[i - 1] = img
        if (i === 1) {
          this.CW = img.width * this.option.dpr
          this.CH = img.height * this.option.dpr
          this.canvas.width = this.CW
          this.canvas.height = this.CH
          this.canvas.style.pointerEvents = 'none'
          this.OnReady()
        }
      }
      img.src = this.option.urlPrefix + i + this.option.suffix
      img.onerror = (e) => {
        console.log(e)
      }
    }
  }

  private OnReady() {
    this.xtc.clearRect(0, 0, this.CW, this.CH)
    this.xtc.save()
    const ia = new Image()
    ia.onload = () => {
      this.xtc.drawImage(ia, 0, 0, this.CW, this.CH)
    }
    if (this.option.poster) ia.src = this.option.posterUrl!
    else this.xtc.drawImage(this.imgArr[0], 0, 0, this.CW, this.CH)
  }

  public play() {
    if (this.framePlaying) {
      return
    }

    const IntervalFun = () => {
      this.frameIndex++
      this.xtc.clearRect(0, 0, this.CW, this.CH)
      if (this.frameIndex < this.imgArr.length - 1 && this.imgArr[this.frameIndex] == undefined) {
        const img = new Image()
        img.onload = () => {
          this.imgArr[this.frameIndex] = img
        }
        img.src = this.option.urlPrefix + this.frameIndex + this.option.suffix
      } else if (this.imgArr[this.frameIndex]) {
        this.xtc.drawImage(this.imgArr[this.frameIndex], 0, 0, this.CW, this.CH)
      } else {
        this.frameIndex = 0
      }
      let RLT = 0
      if (this.option.replayLoopTo) {
        RLT = this.option.replayLoopTo
      } else {
        RLT = this.imgArr.length - 1
      }
      if (this.option.loop && this.frameIndex == RLT) {
        clearInterval(this.timer)
        if (this.option.replayLoopFrom) {
          this.frameIndex = this.option.replayLoopFrom
        } else {
          this.frameIndex = 0
        }
        this.framePlaying = false
        this.play()
      } else if (this.frameIndex == RLT) {
        clearInterval(this.timer)
        this.framePlaying = false
        this.frameIndex = 0
      }
    }

    this.timer = setInterval(() => {
      if (this.canPlay) IntervalFun()
      if (this.frameIndex + 2 >= this.option.MaxL) {
        if (!this.canPlay) return
        this.canPlay = false
        setTimeout(() => {
          this.canPlay = true
        }, this.gap)
      }
    }, 1000 / this.option.frame)
    return this
  }

  public paused() {
    clearInterval(this.timer)
  }

  public frameI() {
    return this.frameIndex
  }
}

// new CanvasAnimation({
//   urlPrefix: 'https://oss.eventnet.cn/H5/zz/cibipat/x/1/',
//   suffix: '.png',
//   MaxL: 44,
//   el: 'bottomCanvas',
//   dpr: 1,
//   poster: true,
//   posterUrl: 'https://oss.eventnet.cn/H5/zz/cibipat/x/1/0.png',
//   loop: true,
//   frame: 32,
//   gap: 0,
// }).play()
