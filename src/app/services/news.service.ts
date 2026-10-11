import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { News } from '../models/news.model';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private noticias$?: Observable<News[]>;

  constructor(private http: HttpClient) {}

  obtenerNoticias(): Observable<News[]> {
    if (!this.noticias$) {
      this.noticias$ = this.http
        .get<News[]>('data/news.json')
        .pipe(shareReplay(1));
    }
    return this.noticias$;
  }
}
