import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { News } from '../../models/news.model';
import { FavoritesService } from '../../services/favorites.service';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    FooterComponent,
    NewsCardComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  destacadas = signal<News[]>([]);

  constructor(
    private newsService: NewsService,
    public favoritesService: FavoritesService,
  ) {}

  ngOnInit(): void {
    this.favoritesService.cargar();
    this.newsService.obtenerNoticias().subscribe((noticias) => {
      this.destacadas.set(noticias.filter((n) => n.destacadaHome));
    });
  }

  esFavorita(id: number): boolean {
    return this.favoritesService.esFavorita(id);
  }

  alternarFavorito(id: number): void {
    this.favoritesService.alternar(id);
  }
}
