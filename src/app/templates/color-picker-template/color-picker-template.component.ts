import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';

import invert, { RGB, RgbArray, HexColor, BlackWhite } from 'invert-color';
import { hexToRgba, rgbaToHex, rgbaToArray, isValidHex, isValidRgba } from 'hex-and-rgba';

@Component({
  selector: 'app-color-picker-template',
  templateUrl: './color-picker-template.component.html',
  styleUrls: ['./color-picker-template.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ColorPickerTemplateComponent implements OnInit, OnDestroy {

  @Input() lang: string;
  @Input() colorPreview: boolean;
  @Input() selectedColor: any;
  @Input() custom: any;

  @Output() emitData = new EventEmitter();

  subscription: Subscription;

  langsData: any = [
    {
      lang: 'vi',
      backgroundColor: 'Màu nền',
      textColor: 'Màu chữ',
      linkColor: 'Màu liên kết',
      highlightColor: 'Màu chữ nổi bật',
      colors: [
        {
          value: 'white',
          name: 'Trắng'
        }, {
          value: 'black',
          name: 'Đen'
        }, {
          value: 'blue-grey',
          name: 'Xanh Xám'
        }, {
          value: 'blue',
          name: 'Xanh'
        }, {
          value: 'light-blue',
          name: 'Xanh sáng'
        }, {
          value: 'indigo',
          name: 'Xanh đậm'
        }, {
          value: 'red',
          name: 'Đỏ'
        }, {
          value: 'purple',
          name: 'Tím'
        }, {
          value: 'deep-purple',
          name: 'Tím đậm'
        }, {
          value: 'pink',
          name: 'Hồng'
        }, {
          value: 'orange',
          name: 'Cam'
        }, {
          value: 'deep-orange',
          name: 'Cam đậm'
        }, {
          value: 'green',
          name: 'Xanh lá'
        }, {
          value: 'light-green',
          name: 'Xanh lợt'
        }, {
          value: 'yellow',
          name: 'Vàng'
        }, {
          value: 'lime',
          name: 'Vôi'
        }, {
          value: 'amber',
          name: 'Hổ phách'
        }, {
          value: 'brown',
          name: 'Nâu'
        }, {
          value: 'grey',
          name: 'Xám'
        }, {
          value: 'cyan',
          name: 'Lục lam'
        }, {
          value: 'teal',
          name: 'Mòng két'
        }, {
          value: 'custom',
          name: 'Tùy chọn'
        }, {
          value: 'dark',
          name: 'Tối'
        }
      ]
    },
    {
      lang: 'en',
      backgroundColor: 'Background color',
      textColor: 'Text color',
      linkColor: 'Link color',
      highlightColor: 'Highlight color',
      colors: []
    }
  ];
  data: any;

  standardColors: any = [
    {
      title: 'White',
      value: 'white',
      extensions: [
        {
          code: 50,
          value: '#fff'
        }, {
          code: 100,
          value: '#fefefe'
        }, {
          code: 200,
          value: '#fdfdfd'
        }, {
          code: 300,
          value: '#fcfcfc'
        }, {
          code: 400,
          value: '#fbfbfb'
        }, {
          code: 500,
          value: '#fafafa'
        }, {
          code: 600,
          value: '#f9f9f9'
        }, {
          code: 700,
          value: '#f7f7f7'
        }, {
          code: 800,
          value: '#f5f5f5'
        }, {
          code: 900,
          value: '#f3f3f3'
        }, {
          code: 'A100',
          value: '#f0f0f0'
        }, {
          code: 'A200',
          value: '#e9e9e9'
        }, {
          code: 'A400',
          value: '#e7e7e7'
        }, {
          code: 'A700',
          value: '#e5e5e5'
        }
      ]
    },
    {
      title: 'Black',
      value: 'black',
      extensions: [
        {
          code: 50,
          value: '#999'
        }, {
          code: 100,
          value: '#888'
        }, {
          code: 200,
          value: '#777'
        }, {
          code: 300,
          value: '#666'
        }, {
          code: 400,
          value: '#555'
        }, {
          code: 500,
          value: '#444'
        }, {
          code: 600,
          value: '#333'
        }, {
          code: 700,
          value: '#222'
        }, {
          code: 800,
          value: '#111'
        }, {
          code: 900,
          value: '#000'
        }, {
          code: 'A100',
          value: '#797979'
        }, {
          code: 'A200',
          value: '#686868'
        }, {
          code: 'A400',
          value: '#343434'
        }, {
          code: 'A700',
          value: '#1a1a1a'
        }
      ]
    },
    {
      title: 'Blue Grey',
      value: 'blue-grey',
      extensions: [
        {
          code: 50,
          value: '#eceff1'
        }, {
          code: 100,
          value: '#cfd8dc'
        }, {
          code: 200,
          value: '#b0bec5'
        }, {
          code: 300,
          value: '#90a4ae'
        }, {
          code: 400,
          value: '#78909c'
        }, {
          code: 500,
          value: '#607d8b'
        }, {
          code: 600,
          value: '#546e7a'
        }, {
          code: 700,
          value: '#455a64'
        }, {
          code: 800,
          value: '#37474f'
        }, {
          code: 900,
          value: '#263238'
        }, {
          code: 'A100',
          value: '#8499A3'
        }, {
          code: 'A200',
          value: '#526771'
        }, {
          code: 'A400',
          value: '#323743'
        }, {
          code: 'A700',
          value: '#1e2129'
        }
      ]
    },
    {
      title: 'Blue',
      value: 'blue',
      extensions: [
        {
          code: 50,
          value: '#e3f2fd'
        },
        {
          code: 100,
          value: '#bbdefb'
        },
        {
          code: 200,
          value: '#90caf9'
        },
        {
          code: 300,
          value: '#64b5f6'
        },
        {
          code: 400,
          value: '#42a5f5'
        },
        {
          code: 500,
          value: '#2196f3'
        },
        {
          code: 600,
          value: '#1e88e5'
        },
        {
          code: 700,
          value: '#1976d2'
        },
        {
          code: 800,
          value: '#1565c0'
        },
        {
          code: 900,
          value: '#0d47a1'
        },
        {
          code: 1000,
          value: '#002C86'
        },
        {
          code: 'A100',
          value: '#82b1ff'
        },
        {
          code: 'A200',
          value: '#448aff'
        },
        {
          code: 'A400',
          value: '#2979ff'
        },
        {
          code: 'A700',
          value: '#2962ff'
        }
      ]
    },
    {
      title: 'Light Blue',
      value: 'light-blue',
      extensions: [
        {
          code: 50,
          value: '#e1f5fe'
        }, {
          code: 100,
          value: '#b3e5fc'
        }, {
          code: 200,
          value: '#81d4fa'
        }, {
          code: 300,
          value: '#4fc3f7'
        }, {
          code: 400,
          value: '#29b6f6'
        }, {
          code: 500,
          value: '#03a9f4'
        }, {
          code: 600,
          value: '#039be5'
        }, {
          code: 700,
          value: '#0288d1'
        }, {
          code: 800,
          value: '#0277bd'
        }, {
          code: 900,
          value: '#01579b'
        }, {
          code: 1000,
          value: '#004880'
        }, {
          code: 'A100',
          value: '#80d8ff'
        }, {
          code: 'A200',
          value: '#40c4ff'
        }, {
          code: 'A400',
          value: '#00b0ff'
        }, {
          code: 'A700',
          value: '#0091ea'
        }
      ]
    },
    {
      title: 'Indigo',
      value: 'indigo',
      extensions: [
        {
          code: 50,
          value: '#e8eaf6'
        },
        {
          code: 100,
          value: '#c5cae9'
        },
        {
          code: 200,
          value: '#9fa8da'
        },
        {
          code: 300,
          value: '#7986cb'
        },
        {
          code: 400,
          value: '#5c6bc0'
        },
        {
          code: 500,
          value: '#3f51b5'
        },
        {
          code: 600,
          value: '#3949ab'
        },
        {
          code: 700,
          value: '#303f9f'
        },
        {
          code: 800,
          value: '#283593'
        },
        {
          code: 900,
          value: '#1a237e'
        },
        {
          code: 1000,
          value: '#040D68'
        },
        {
          code: 'A100',
          value: '#8c9eff'
        },
        {
          code: 'A200',
          value: '#536dfe'
        },
        {
          code: 'A400',
          value: '#3d5afe'
        },
        {
          code: 'A700',
          value: '#304ffe'
        }
      ]
    },
    {
      title: 'Purple',
      value: 'purple',
      extensions: [
        {
          code: 50,
          value: '#f3e5f5'
        }, {
          code: 100,
          value: '#e1bee7'
        }, {
          code: 200,
          value: '#ce93d8'
        }, {
          code: 300,
          value: '#ba68c8'
        }, {
          code: 400,
          value: '#ab47bc'
        }, {
          code: 500,
          value: '#9c27b0'
        }, {
          code: 600,
          value: '#8e24aa'
        }, {
          code: 700,
          value: '#7b1fa2'
        }, {
          code: 800,
          value: '#6a1b9a'
        }, {
          code: 900,
          value: '#4a148c'
        }, {
          code: 1000,
          value: '#380a70'
        }, {
          code: 'A100',
          value: '#ea80fc'
        }, {
          code: 'A200',
          value: '#e040fb'
        }, {
          code: 'A400',
          value: '#d500f9'
        }, {
          code: 'A700',
          value: '#aa00ff'
        }
      ]
    },
    {
      title: 'Deep Purple',
      value: 'deep-purple',
      extensions: [
        {
          code: 50,
          value: '#ede7f6'
        },
        {
          code: 100,
          value: '#d1c4e9'
        },
        {
          code: 200,
          value: '#b39ddb'
        },
        {
          code: 300,
          value: '#9575cd'
        },
        {
          code: 400,
          value: '#7e57c2'
        },
        {
          code: 500,
          value: '#673ab7'
        },
        {
          code: 600,
          value: '#5e35b1'
        },
        {
          code: 700,
          value: '#512da8'
        },
        {
          code: 800,
          value: '#4527a0'
        },
        {
          code: 900,
          value: '#311b92'
        },
        {
          code: 1000,
          value: '#19037A'
        },
        {
          code: 'A100',
          value: '#b388ff'
        },
        {
          code: 'A200',
          value: '#7c4dff'
        },
        {
          code: 'A400',
          value: '#651fff'
        },
        {
          code: 'A700',
          value: '#6200ea'
        }
      ]
    },
    {
      title: 'Green',
      value: 'green',
      extensions: [
        {
          code: 50,
          value: '#e8f5e9'
        },
        {
          code: 100,
          value: '#c8e6c9'
        },
        {
          code: 200,
          value: '#a5d6a7'
        },
        {
          code: 300,
          value: '#81c784'
        },
        {
          code: 400,
          value: '#66bb6a'
        },
        {
          code: 500,
          value: '#4caf50'
        },
        {
          code: 600,
          value: '#43a047'
        },
        {
          code: 700,
          value: '#388e3c'
        },
        {
          code: 800,
          value: '#2e7d32'
        },
        {
          code: 900,
          value: '#1b5e20'
        },
        {
          code: 1000,
          value: '#0D5012'
        },
        {
          code: 'A100',
          value: '#b9f6ca'
        },
        {
          code: 'A200',
          value: '#69f0ae'
        },
        {
          code: 'A400',
          value: '#00e676'
        },
        {
          code: 'A700',
          value: '#00c853'
        }
      ]
    },
    {
      title: 'Light Green',
      value: 'light-green',
      extensions: [
        {
          code: 50,
          value: '#f1f8e9'
        },
        {
          code: 100,
          value: '#dcedc8'
        },
        {
          code: 200,
          value: '#c5e1a5'
        },
        {
          code: 300,
          value: '#aed581'
        },
        {
          code: 400,
          value: '#9ccc65'
        },
        {
          code: 500,
          value: '#8bc34a'
        },
        {
          code: 600,
          value: '#7cb342'
        },
        {
          code: 700,
          value: '#689f38'
        },
        {
          code: 800,
          value: '#558b2f'
        },
        {
          code: 900,
          value: '#33691e'
        },
        {
          code: 1000,
          value: '#23590e'
        },
        {
          code: 'A100',
          value: '#ccff90'
        },
        {
          code: 'A200',
          value: '#b2ff59'
        },
        {
          code: 'A400',
          value: '#76ff03'
        },
        {
          code: 'A700',
          value: '#64dd17'
        }
      ]
    },
    {
      title: 'Red',
      value: 'red',
      extensions: [
        {
          code: 50,
          value: '#ffebee'
        }, {
          code: 100,
          value: '#ffcdd2'
        }, {
          code: 200,
          value: '#ef9a9a'
        }, {
          code: 300,
          value: '#e57373'
        }, {
          code: 400,
          value: '#ef5350'
        },
        {
          code: 500,
          value: '#f44336'
        }, {
          code: 600,
          value: '#e53935'
        }, {
          code: 700,
          value: '#d32f2f'
        }, {
          code: 800,
          value: '#c62828'
        }, {
          code: 900,
          value: '#b71c1c'
        }, {
          code: 1000,
          value: '#9f1010'
        }, {
          code: 'A100',
          value: '#ff8a80'
        }, {
          code: 'A200',
          value: '#ff5252'
        }, {
          code: 'A400',
          value: '#ff1744'
        }, {
          code: 'A700',
          value: '#d50000'
        }
      ]
    },
    {
      title: 'Pink',
      value: 'pink',
      extensions: [
        {
          code: 50,
          value: '#fce4ec'
        }, {
          code: 100,
          value: '#f8bbd0'
        }, {
          code: 200,
          value: '#f48fb1'
        }, {
          code: 300,
          value: '#f06292'
        }, {
          code: 400,
          value: '#ec407a'
        }, {
          code: 500,
          value: '#e91e63'
        }, {
          code: 600,
          value: '#d81b60'
        }, {
          code: 700,
          value: '#c2185b'
        }, {
          code: 800,
          value: '#ad1457'
        }, {
          code: 900,
          value: '#880e4f'
        }, {
          code: 1000,
          value: '#6a1241'
        }, {
          code: 'A100',
          value: '#ff80ab'
        }, {
          code: 'A200',
          value: '#ff4081'
        }, {
          code: 'A400',
          value: '#f50057'
        }, {
          code: 'A700',
          value: '#c51162'
        }
      ]
    },
    {
      title: 'Orange',
      value: 'orange',
      extensions: [
        {
          code: 50,
          value: '#fff3e0'
        },
        {
          code: 100,
          value: '#ffe0b2'
        },
        {
          code: 200,
          value: '#ffcc80'
        },
        {
          code: 300,
          value: '#ffb74d'
        },
        {
          code: 400,
          value: '#ffa726'
        },
        {
          code: 500,
          value: '#ff9800'
        },
        {
          code: 600,
          value: '#fb8c00'
        },
        {
          code: 700,
          value: '#f57c00'
        },
        {
          code: 800,
          value: '#ef6c00'
        },
        {
          code: 900,
          value: '#e65100'
        },
        {
          code: 1000,
          value: '#d43f00'
        },
        {
          code: 'A100',
          value: '#ffd180'
        },
        {
          code: 'A200',
          value: '#ffab40'
        },
        {
          code: 'A400',
          value: '#ff9100'
        },
        {
          code: 'A700',
          value: '#ff6d00'
        }
      ]
    },
    {
      title: 'Deep Orange',
      value: 'deep-orange',
      extensions: [
        {
          code: 50,
          value: '#fbe9e7'
        },
        {
          code: 100,
          value: '#ffccbc'
        },
        {
          code: 200,
          value: '#ffab91'
        },
        {
          code: 300,
          value: '#ff8a65'
        },
        {
          code: 400,
          value: '#ff7043'
        },
        {
          code: 500,
          value: '#ff5722'
        },
        {
          code: 600,
          value: '#f4511e'
        },
        {
          code: 700,
          value: '#e64a19'
        },
        {
          code: 800,
          value: '#d84315'
        },
        {
          code: 900,
          value: '#bf360c'
        },
        {
          code: 1000,
          value: '#ad2400'
        },
        {
          code: 'A100',
          value: '#ff9e80'
        },
        {
          code: 'A200',
          value: '#ff6e40'
        },
        {
          code: 'A400',
          value: '#ff3d00'
        },
        {
          code: 'A700',
          value: '#dd2c00'
        }
      ]
    },
    {
      title: 'Yellow',
      value: 'yellow',
      extensions: [
        {
          code: 50,
          value: '#fffde7'
        }, {
          code: 100,
          value: '#fff9c4'
        }, {
          code: 200,
          value: '#fff59d'
        }, {
          code: 300,
          value: '#fff176'
        }, {
          code: 400,
          value: '#ffee58'
        }, {
          code: 500,
          value: '#ffeb3b'
        }, {
          code: 600,
          value: '#fdd835'
        }, {
          code: 700,
          value: '#fbc02d'
        }, {
          code: 800,
          value: '#f9a825'
        }, {
          code: 900,
          value: '#f57f17'
        }, {
          code: 1000,
          value: '#dc7922'
        }, {
          code: 'A100',
          value: '#ffff8d'
        }, {
          code: 'A200',
          value: '#ffff00'
        }, {
          code: 'A400',
          value: '#ffea00'
        }, {
          code: 'A700',
          value: '#ffd600'
        }
      ]
    },
    {
      title: 'Lime',
      value: 'lime',
      extensions: [
        {
          code: 50,
          value: '#f9fbe7'
        },
        {
          code: 100,
          value: '#f0f4c3'
        },
        {
          code: 200,
          value: '#e6ee9c'
        },
        {
          code: 300,
          value: '#dce775'
        },
        {
          code: 400,
          value: '#d4e157'
        },
        {
          code: 500,
          value: '#cddc39'
        },
        {
          code: 600,
          value: '#c0ca33'
        },
        {
          code: 700,
          value: '#afb42b'
        },
        {
          code: 800,
          value: '#9e9d24'
        },
        {
          code: 900,
          value: '#827717'
        },
        {
          code: 1000,
          value: '#6E6303'
        },
        {
          code: 'A100',
          value: '#f4ff81'
        },
        {
          code: 'A200',
          value: '#eeff41'
        },
        {
          code: 'A400',
          value: '#c6ff00'
        },
        {
          code: 'A700',
          value: '#aeea00'
        }
      ]
    },
    {
      title: 'Amber',
      value: 'amber',
      extensions: [
        {
          code: 50,
          value: '#fff8e1'
        },
        {
          code: 100,
          value: '#ffecb3'
        },
        {
          code: 200,
          value: '#ffe082'
        },
        {
          code: 300,
          value: '#ffd54f'
        },
        {
          code: 400,
          value: '#ffca28'
        },
        {
          code: 500,
          value: '#ffc107'
        },
        {
          code: 600,
          value: '#ffb300'
        },
        {
          code: 700,
          value: '#ffa000'
        },
        {
          code: 800,
          value: '#ff8f00'
        },
        {
          code: 900,
          value: '#ff6f00'
        },
        {
          code: 1000,
          value: '#ed5d00'
        },
        {
          code: 'A100',
          value: '#ffe57f'
        },
        {
          code: 'A200',
          value: '#ffd740'
        },
        {
          code: 'A400',
          value: '#ffc400'
        },
        {
          code: 'A700',
          value: '#ffab00'
        }
      ]
    },
    {
      title: 'Brown',
      value: 'brown',
      extensions: [
        {
          code: 50,
          value: '#efebe9'
        },
        {
          code: 100,
          value: '#d7ccc8'
        },
        {
          code: 200,
          value: '#bcaaa4'
        },
        {
          code: 300,
          value: '#a1887f'
        },
        {
          code: 400,
          value: '#8d6e63'
        },
        {
          code: 500,
          value: '#795548'
        },
        {
          code: 600,
          value: '#6d4c41'
        },
        {
          code: 700,
          value: '#5d4037'
        },
        {
          code: 800,
          value: '#4e342e'
        },
        {
          code: 900,
          value: '#3e2723'
        },
        {
          code: 1000,
          value: '#331c18'
        },
        {
          code: 'A100',
          value: '#d1c6c2'
        },
        {
          code: 'A200',
          value: '#b19f99'
        },
        {
          code: 'A400',
          value: '#84655a'
        },
        {
          code: 'A700',
          value: '#55382F'
        }
      ]
    },
    {
      title: 'Grey',
      value: 'grey',
      extensions: [
        {
          code: 50,
          value: '#fafafa'
        },
        {
          code: 100,
          value: '#f5f5f5'
        },
        {
          code: 200,
          value: '#eeeeee'
        },
        {
          code: 300,
          value: '#e0e0e0'
        },
        {
          code: 400,
          value: '#bdbdbd'
        },
        {
          code: 500,
          value: '#9e9e9e'
        },
        {
          code: 600,
          value: '#757575'
        },
        {
          code: 700,
          value: '#616161'
        },
        {
          code: 800,
          value: '#424242'
        },
        {
          code: 900,
          value: '#393939'
        },
        {
          code: 1000,
          value: '#212121'
        },
        {
          code: 'A100',
          value: '#ffffff'
        },
        {
          code: 'A200',
          value: '#e5e5e5'
        },
        {
          code: 'A400',
          value: '#afafaf'
        },
        {
          code: 'A700',
          value: '#5A5A5A'
        }
      ]
    },
    {
      title: 'Cyan',
      value: 'cyan',
      extensions: [
        {
          code: 50,
          value: '#e0f7fa'
        },
        {
          code: 100,
          value: '#b2ebf2'
        },
        {
          code: 200,
          value: '#80deea'
        },
        {
          code: 300,
          value: '#4dd0e1'
        },
        {
          code: 400,
          value: '#26c6da'
        },
        {
          code: 500,
          value: '#00bcd4'
        },
        {
          code: 600,
          value: '#00acc1'
        },
        {
          code: 700,
          value: '#0097a7'
        },
        {
          code: 800,
          value: '#00838f'
        },
        {
          code: 900,
          value: '#006064'
        },
        {
          code: 1000,
          value: '#005054'
        },
        {
          code: 'A100',
          value: '#84ffff'
        },
        {
          code: 'A200',
          value: '#18ffff'
        },
        {
          code: 'A400',
          value: '#00e5ff'
        },
        {
          code: 'A700',
          value: '#00b8d4'
        }
      ]
    }, {
      title: 'Teal',
      value: 'teal',
      extensions: [
        {
          code: 50,
          value: '#e0f2f1'
        },
        {
          code: 100,
          value: '#b2dfdb'
        },
        {
          code: 200,
          value: '#80cbc4'
        },
        {
          code: 300,
          value: '#4db6ac'
        },
        {
          code: 400,
          value: '#26a69a'
        },
        {
          code: 500,
          value: '#009688'
        },
        {
          code: 600,
          value: '#00897b'
        },
        {
          code: 700,
          value: '#00796b'
        },
        {
          code: 800,
          value: '#00695c'
        },
        {
          code: 900,
          value: '#004d40'
        },
        {
          code: 1000,
          value: '#003D30'
        },
        {
          code: 'A100',
          value: '#a7ffeb'
        },
        {
          code: 'A200',
          value: '#64ffda'
        },
        {
          code: 'A400',
          value: '#1de9b6'
        },
        {
          code: 'A700',
          value: '#00bfa5'
        }
      ]
    },
    {
      title: 'Dark',
      value: 'dark',
      extensions: [
        {
          code: 'blue',
          value: '#030334'
        }, {
          code: 'light-blue',
          value: '#04043C',
        }, {
          code: 'indigo',
          value: '#01012C'
        }, {
          code: 'purple',
          value: '#0A0A32'
        }, {
          code: 'deep-purple',
          value: '#01011E'
        }, {
          code: 'red',
          value: '#330000'
        }, {
          code: 'pink',
          value: '#3C1113'
        }, {
          code: 'orange',
          value: '#3B0707'
        }, {
          code: 'deep-orange',
          value: '#330505'
        }, {
          code: 'green',
          value: '#0B220B'
        }, {
          code: 'light-green',
          value: '#012901'
        }, {
          code: 'yellow',
          value: '#3D0101'
        }, {
          code: 'lime',
          value: '#2A1F04'
        }, {
          code: 'amber',
          value: '#420909'
        }, {
          code: 'brown',
          value: '#210A06'
        }, {
          code: 'cyan',
          value: '#011C20'
        }, {
          code: 'teal',
          value: '#0B2518'
        }
      ]
    },
    {
      title: 'Custom',
      value: 'custom',
    }
  ]

  formData: any = {
    selectedColor: {}
  };

  constructor(
    private messageService: MessageService
  ) {
    this.subscription = messageService.getMessage().subscribe(message => {
      if (message.text === messageService.messages.changeLanguage) {
        this.lang = message.data.lang;
        this.langsData();
      }
    });
  }

  ngOnInit(): void {
    this.getLangData();
    this.getData();
    if (this.custom === 'fullOptions') {
      this.custom = {
        textColor: true,
        linkColor: true,
        highlightColor: true
      }
    }
  }

  getLangData() {
    this.data = this.langsData.find(item => item.lang === this.lang);
    if (!this.data) {
      this.data = this.langsData[0];
    }
  }

  getData() {
    this.standardColors.forEach(e => {
      const rs = this.data.colors.find(item => item.value === e.value);
      if (rs) {
        e.name = rs.name;
      } else {
        e.name = e.title;
      }
    });

    if (this.selectedColor) {
      if (this.selectedColor.type) {
        this.formData.colorCode = this.selectedColor.class;
        this.formData.colorValue = this.selectedColor.value;
        this.formData.selectedColor = this.selectedColor;
        this.formData.color = this.standardColors.find(item => item.value === this.selectedColor.type);
        this.formData.selectedColorIndex = this.standardColors.findIndex(item => item.value === this.selectedColor.type);
      } else {
        this.formData.color = this.standardColors[0];
      }
    } else {
      this.formData.color = this.standardColors[0];
    }
  }

  selectTab($event) {
    this.formData.color = this.standardColors[$event.index];
    this.formData.colorCode = this.formData.color.value;
    this.formData.colorValue = null;
  }

  selectColor(color) {
    var lightColorValue = '';
    var darkColorValue = '';
    var lightColor = this.formData.color.extensions.find(item => item.code === 50);
    if (lightColor) {
      lightColorValue = lightColor.value;
      if (lightColorValue === color.value) {
        lightColorValue = '#fff';
      }
    } else {
      lightColorValue = '#fff';
    }
    var darkColor = this.formData.color.extensions.find(item => item.code === 1000);
    if (!darkColor) {
      var darkColor = this.formData.color.extensions.find(item => item.code === 900);
    }
    if (darkColor) {
      darkColorValue = darkColor.value;
      if (darkColorValue === color.value) {
        darkColorValue = '#000';
      }
    } else {
      darkColorValue = '#000';
    }
    if ((this.formData.color.value + '-' + color.code) !== this.formData.selectedColor.class) {
      var hexValue = color.value;
      var rgbaValue = hexToRgba(hexValue).toString();

      const invertBL = invert(color.value, true);

      var borderColor = hexToRgba(invertBL + '25').toString();

      var selectedColor = {
        type: this.formData.color.value,
        code: color.code,
        class: this.formData.color.value + '-' + color.code,
        value: color.value,
        rgba: rgbaValue,
        lightColor: lightColorValue,
        darkColor: darkColorValue,
        invert: invert(color.value),
        invertBL: invertBL,
        defaultBorder: borderColor
      };
      this.formData.colorCode = selectedColor.class;
      this.formData.colorValue = selectedColor.value;
      this.formData.selectedColor = selectedColor;
      this.emitData.emit(this.formData.selectedColor);
    }
  }

  selectCustomColor($event) {
    this.formData.selectedColor = $event;
    this.formData.selectedColor.type = this.formData.color.value;
    this.formData.selectedColor.code = null;
    this.formData.selectedColor.class = 'custom';
    this.formData.selectedColor.lightColor = '#fff';
    this.formData.selectedColor.darkColor = '#000';
    this.emitData.emit(this.formData.selectedColor);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
