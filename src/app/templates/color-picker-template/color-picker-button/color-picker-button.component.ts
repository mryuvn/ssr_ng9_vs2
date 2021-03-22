import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import invert, { RGB, RgbArray, HexColor, BlackWhite } from 'invert-color';
import { hexToRgba, rgbaToHex, rgbaToArray, isValidHex, isValidRgba } from 'hex-and-rgba';

@Component({
  selector: 'app-color-picker-button',
  templateUrl: './color-picker-button.component.html',
  styleUrls: ['./color-picker-button.component.scss']
})
export class ColorPickerButtonComponent implements OnInit {

  @Input() color: string;

  @Output() emitData = new EventEmitter();

  invert: string;
  invertBL: string;

  constructor(
    private cpService: ColorPickerService
  ) { }

  ngOnInit(): void {
    if (this.color) {
      this.invert = invert(this.color);
      this.invertBL = invert(this.color, true);
    }
  }

  selectColor(color) {
    // const hsva = this.cpService.stringToHsva(color);
    // const rgba = this.cpService.hsvaToRgba(hsva);
    // const cmyk = this.cpService.rgbaToCmyk(rgba);

    if (isValidHex(color)) {
      var hexValue = color;
      var rgbaValue = hexToRgba(color).toString();
    } else {
      var hexValue = rgbaToHex(rgbaToArray(color));
      var rgbaValue = color;
    }
    this.invert = invert(hexValue.slice(0, 7));
    this.invertBL = invert(hexValue.slice(0, 7), true);
    var defaultBorder = hexToRgba(this.invertBL + '33').toString();
    const data = {
      value: hexValue,
      rgba: rgbaValue,
      invert: this.invert,
      invertBL: this.invertBL,
      defaultBorder: defaultBorder
    }
    this.emitData.emit(data);
  }

}
