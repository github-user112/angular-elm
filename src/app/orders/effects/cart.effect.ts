import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store, select } from '@ngrx/store';
import {
    CartActionTypes, GetAllCartItem, GetAllCartItemSucess,
    GetAllCartItemFail, AddCartItem, AddCartItemSucess, AddCartItemFail,
    RemoveCartItem, RemoveCartItemSucess, RemoveCartItemFail, ClearAllCartItem, ClearAllCartItemSucess, ClearAllCartItemFail
} from '../actions/cart.action';
import { mergeMap, map, catchError, filter, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { CartService } from '../services/cart.service';
import * as fromRouter from '@ngrx/router-store';
import * as fromOrder from '../reducers';

@Injectable({
    providedIn: 'root'
})
export class CartEffect {

    constructor(private actions$: Actions, private service$: CartService, private store$: Store<fromOrder.State>) { }


    @Effect({ dispatch: true }) router$ = this.actions$.pipe(
        ofType(fromRouter.ROUTER_NAVIGATION),
        map((action: any) => action.payload),
        filter((payload: any) => payload.event.url.indexOf('/msite/shop') !== -1),
        map((payload: any) => payload.routerState),
        switchMap(({ params }) => this.service$.getAll(parseInt(params['shopId'], 10)).pipe(
            map(d => new GetAllCartItemSucess(d)),
            catchError(e => of(new GetAllCartItemFail(e)))
        )),
    );

    // @Effect() getAll$: Observable<Action> = this.actions$.pipe(
    //     ofType<GetAllCartItem>(CartActionTypes.GET_ALL_CART_ITEMS),
    //     map(action => action.shopId),
    //     mergeMap(shopId => this.service$.getAll(shopId).pipe(
    //         map(d => new GetAllCartItemSucess(d)),
    //         catchError(e => of(new GetAllCartItemFail(e)))
    //     ))
    // );

    @Effect() add$: Observable<Action> = this.actions$.pipe(
        ofType<AddCartItem>(CartActionTypes.ADD_CART_ITEM),
        map(action => action.item),
        mergeMap(item => this.service$.addOneAndGetAll(item).pipe(
            map(d => new GetAllCartItemSucess(d)),
            catchError(e => of(new AddCartItemFail(e)))
        ))
    );

    @Effect() delete$: Observable<Action> = this.actions$.pipe(
        ofType<RemoveCartItem>(CartActionTypes.REMOVE_CART_ITEM),
        map(action => action.id),
        withLatestFrom(this.store$.pipe(select(fromOrder.getShopId))),
        mergeMap(([id, shopId]) => this.service$.removeOneAndGetAll(id, shopId).pipe(
            map(d => new GetAllCartItemSucess(d)),
            catchError(e => of(new RemoveCartItemFail(e)))
        ))
    );

    @Effect() clearAll$: Observable<Action> = this.actions$.pipe(
        ofType<ClearAllCartItem>(CartActionTypes.CLEAR_ALL_CART_ITEMS),
        // map(action => action.shopId),
        withLatestFrom(this.store$.pipe(select(fromOrder.getShopId))),
        mergeMap(([, shopId]) => this.service$.clearAll(shopId).pipe(
            map(() => new ClearAllCartItemSucess()),
            catchError(e => of(new ClearAllCartItemFail(e)))
        ))
    );

}

