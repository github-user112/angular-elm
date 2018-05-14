import { Component, OnInit, Input } from '@angular/core';
import { Shop, Support } from '../../models';

import { imgBaseUrl } from '../../../../environments/environment';

@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss']
})
export class ShopListComponent implements OnInit {

  @Input() geohash: string;
  @Input() shopListArr: Shop[];
  @Input() showLoading: boolean;
  imgBaseUrl: string;
  touchend: boolean;
  showBackStatus: boolean;
  constructor() {
    this.imgBaseUrl = imgBaseUrl;
  }

  ngOnInit() {
  }

  backTop() {

  }

  zhunshi(supports: Support[]) {

  }

}
