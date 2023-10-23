import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ElectronService} from "../../services/electronService";
import {Settings, SpecificOptions, specificRequired} from "../../objects/settings";
import {SettingsComponent} from "../../dialogs/settings/settings.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.scss']
})
export class PictureComponent implements OnInit {

  // @ts-ignore
  @ViewChild('picture') picture: ElementRef<HTMLImageElement>;
  settings: Settings = {
    keywords: ["landscape"],
    resolution: "1920x1080",
    interval: 5,
    clock: true,
    specificCategory: SpecificOptions.Random,
    specific: "",
    animation: true,
    ...JSON.parse(localStorage.getItem("settings") ?? '{}')
  }
  lastUpdate = (new Date()).getTime();
  isFullscreen = false
  loop: ReturnType<typeof setTimeout> | undefined = undefined
  time = new Date()
  clockColor = "white"
  link = ""
  mouseMove = false
  mouseMoveTimer: ReturnType<typeof setTimeout> | undefined = undefined
  onMouseMove(){
    if (this.mouseMoveTimer != undefined)
    clearTimeout(this.mouseMoveTimer)
    this.mouseMove = true
    this.mouseMoveTimer = setTimeout(() => this.mouseMove = false, 3000)
  }

  download(){
    const canvas = document.createElement('canvas')
    const resolution = this.figureResolution()
    canvas.width = resolution[0]
    canvas.height = resolution[1]
    const context = canvas.getContext('2d');
    context!!.drawImage(this.picture.nativeElement, 0, 0);
    const link = document.createElement('a');
    link.download = this.settings.keywords.join("-") + '.png';
    link.href = canvas.toDataURL()
    link.click();
  }

  constructor(private electron: ElectronService, private dialog: MatDialog) {
    console.log("settings", this.settings, JSON.parse(localStorage.getItem("settings") ?? '{}'))
  }

  ngOnInit() {
    this.runLoop()
    setInterval(() => {
      this.time = new Date()
    }, 1000)
  }

  openSettings() {
    const dialogRef = this.dialog.open(SettingsComponent, {data: this.settings});
    dialogRef.afterClosed().subscribe(result => {
      if (result &&
        (!specificRequired.includes(result.specificCategory) || result.specific.trim().length != 0)) {
        this.settings = result
        localStorage.setItem("settings", JSON.stringify(this.settings))
        this.electron.ipcRenderer.send("resolution", this.settings.resolution)
        this.refresh()
      }
    });
  }

  figureResolution() {
    return this.settings.resolution.split("x").map(value => parseInt(value))
  }

  resetAnimation() {
    console.log("Reset")
    this.picture.nativeElement.style.animationName = "none"
    setTimeout(() => {
        this.picture.nativeElement.style.animationName = ""
      }, 10)
  }

  setImageLink() {
    let part = SpecificOptions[this.settings.specificCategory].toString().toLowerCase()
    if (this.settings.specificCategory == SpecificOptions.Custom) {
      part = this.settings.specific
    } else if (this.settings.specific && specificRequired.includes(this.settings.specificCategory)) {
      part += "/" + this.settings.specific
    }
    this.link = 'https://source.unsplash.com'
      + ('/' + part
      + '/' + this.settings.resolution
      + '/?' + this.settings.keywords.join(",")).replaceAll(/\/+/g,"/")
      + "&sig=" + ((new Date()).getTime() / 1000)
    console.log(this.link)
  }


  runLoop() {
    this.setImageLink()
    this.loop = setInterval(() => {
      this.setImageLink()
    }, this.settings.interval * 1000)
  }

  refresh() {
    clearInterval(this.loop)
    this.runLoop()
  }

  onFullscreen() {
    this.isFullscreen = !this.isFullscreen
    this.electron.ipcRenderer.send("fullscreen", this.isFullscreen)
  }

  getContrastColor(r: number, g: number, b: number) {
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
  }

  getAverageRgb() {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d');
    context!!.imageSmoothingEnabled = true;
    context!!.drawImage(this.picture.nativeElement, 0, 0, 1, 1);
    return context!!.getImageData(0, 0, 1, 1).data.slice(0, 3);
  }

  changeClockColor() {
    let res = this.getAverageRgb()
    this.clockColor = this.getContrastColor(res[0], res[1], res[2])
    this.resetAnimation()
  }

}
