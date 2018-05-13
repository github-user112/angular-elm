import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsModule } from './components/components.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducer } from './store';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'city' },
    { path: 'city', loadChildren: './city/city.module#CityModule' },

];

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        ComponentsModule,
        StoreModule.forRoot(reducer),
        EffectsModule.forRoot([]),
        RouterModule.forRoot(routes, { useHash: true }),
        StoreDevtoolsModule.instrument({ maxAge: 10 })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
