import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { News } from '../../models/news.model';
import { FavoritesService } from '../../services/favorites.service';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NewsCardComponent],
  templateUrl: './favoritos.component.html',
})
export class FavoritosComponent implements OnInit {
  noticias = signal<News[]>([]);

  lista = computed(() =>
    this.noticias().filter((n) =>
      this.favoritesService.favoritos$().includes(n.id),
    ),
  );

  constructor(
    private newsService: NewsService,
    public favoritesService: FavoritesService,
  ) {}

  ngOnInit(): void {
    this.favoritesService.cargar();
    this.newsService
      .obtenerNoticias()
      .subscribe((noticias) => this.noticias.set(noticias));
  }

  alternarFavorito(id: number): void {
    this.favoritesService.alternar(id);
  }
}
