import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { PositionWithId, Position } from '../models';
import { IndexDbBaseService } from '../../services/indexDb.service';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { eleServerUrl } from '../../../environments/environment';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  private table: Dexie.Table<PositionWithId, number>;
  constructor(private db$: IndexDbBaseService, private http$: HttpClient) {
    this.table = this.db$.table('position');
  }

  getPosition(geohash: string): Observable<Position> {
    return this.getPositionFromLocal(geohash).pipe(
      mergeMap(p => p !== null ? of(p) : this.getPositionFromServer(geohash))
    );
  }

  getPositionFromServer(geohash: string): Observable<Position> {
    return this.http$.get<Position>(`${eleServerUrl}/v2/pois/${geohash}`);
  }


  saveToLocal(position: Position): Observable<boolean> {
    return new Observable(observer => {
      try {
        this.table.filter(t => t.geohash === position.geohash).first().then(d => {
          if (!d) {
            this.table.clear().then(() => {
              this.table.add(<PositionWithId>position);
              observer.next(true);
            });
          } else {
            observer.next(true);
          }
        });
      } catch (e) {
        observer.error(e);
      } finally {
        observer.complete();
      }
      return () => { };
    });
  }

  getPositionFromLocal(geohash: string): Observable<Position> {
    return new Observable(observer => {
      this.table.filter(t => t.geohash === geohash).first().then(d => {
        if (d) {
          observer.next(d);
        } else {
          observer.next(null);
        }
      });
      return () => { };
    });
  }

}