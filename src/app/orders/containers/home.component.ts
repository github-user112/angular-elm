import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

import { Category, Shop, Position } from '../models';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromOrder from '../reducers';
import { LoadPosition } from '../actions/position.action';
import Swiper from 'swiper';
import { filter } from 'rxjs/operators';

// declare const require: any;
// const Swiper = require('swiper');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {


  imgBaseUrl: string;
  geohash: string;
  msiteTitle: Observable<string>;
  hasGetData: string;
  foodTypes: Observable<Category[][]>;
  shopListArr: Observable<Shop[]>;
  position: Observable<Position>;

  routeSub: Subscription;
  constructor(public route$: ActivatedRoute, private store$: Store<fromOrder.State>) {
    this.imgBaseUrl = 'https://fuss10.elemecdn.com';
    this.msiteTitle = this.store$.pipe(select(fromOrder.getPositionName));
    this.foodTypes = this.store$.pipe(select(fromOrder.getHomeCategories));
    this.shopListArr = this.store$.pipe(select(fromOrder.getHomeShopList));
    // this.position = this.store$.pipe(select(fromOrder.getPosition));
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log('==>', changes);
  // }

  ngOnInit() {
    this.routeSub = this.route$.params.subscribe(p => {
      this.store$.dispatch(new LoadPosition(p['geohash']));
    });

    // this.foodTypes.pipe(
    //   filter(list => list && list.length > 0)
    // ).subscribe((list) => {
    //   console.log(list);
    //   if (this.swiperContainer) {
    //     const x = new Swiper(this.swiperContainer.nativeElement, {
    //       pagination: {
    //         el: this.swiperPagination.nativeElement,
    //         // dynamicBullets: true,
    //       },
    //       loop: true
    //     });
    //   }
    // });

  }

  ngAfterViewInit(): void {
    // if (this.swiperContainer) {
    //   const x = new Swiper(this.swiperContainer.nativeElement, {
    //     pagination: {
    //       el: this.swiperPagination.nativeElement,
    //       // dynamicBullets: true,
    //     },
    //     loop: true
    //   });
    // }
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

}