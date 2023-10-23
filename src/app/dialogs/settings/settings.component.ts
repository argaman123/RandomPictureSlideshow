import {Component, inject, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Settings, SpecificOptions, specificRequired} from "../../objects/settings";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipEditedEvent, MatChipInputEvent} from "@angular/material/chips";

export interface Keyword {
  text: string
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {


  keywords: Keyword[]
  width: number
  height: number
  settings: Settings

  constructor(
    public dialogRef: MatDialogRef<SettingsComponent>,
    @Inject(MAT_DIALOG_DATA) settings: Settings,
  ) {
    this.keywords = settings.keywords.map((text) => {
      return {text}
    })
    this.width = parseInt(settings.resolution.split("x")[0])
    this.height = parseInt(settings.resolution.split("x")[1])
    this.settings = JSON.parse(JSON.stringify(settings))
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getSettings(): Settings {
    return {
      ...this.settings,
      keywords: this.keywords.map((keyword) => keyword.text),
      resolution: this.width + "x" + this.height
    }
  }


  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim()
    if (value) {
      this.keywords.push({text: value});
    }
    event.chipInput!.clear();
  }

  remove(keyword: Keyword): void {
    const index = this.keywords.indexOf(keyword);
    if (index >= 0) {
      this.keywords.splice(index, 1);
    }
  }

  edit(keyword: Keyword, event: MatChipEditedEvent) {
    const value = event.value.trim();
    if (!value) {
      this.remove(keyword);
      return;
    }
    const index = this.keywords.indexOf(keyword);
    if (index >= 0) {
      this.keywords[index].text = value;
    }
  }

  protected readonly SpecificOptions = SpecificOptions;
  protected readonly specificRequired = specificRequired;
}//
