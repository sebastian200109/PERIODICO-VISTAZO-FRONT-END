import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { News } from '../../models/news.model';
import { FavoritesService } from '../../services/favorites.service';
import { NewsService } from '../../services/news.service';

const CAT_CLASS: Record<string, string> = {
  educacion: 'cat-edu',
  tecnologia: 'cat-tech',
  turismo: 'cat-tur',
  comercio: 'cat-com',
};

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './detalle.component.html',
})
export class DetalleComponent implements OnInit {
  noticias = signal<News[]>([]);
  noticia = signal<News | undefined>(undefined);
  relacionadas = signal<News[]>([]);

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    public favoritesService: FavoritesService,
  ) {}

  ngOnInit(): void {
    this.favoritesService.cargar();
    this.newsService.obtenerNoticias().subscribe((noticias) => {
      this.noticias.set(noticias);
      this.cargarNoticiaActual();
    });

    this.route.paramMap.subscribe(() => this.cargarNoticiaActual());
  }

  private cargarNoticiaActual(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const n = this.noticias().find((noticia) => noticia.id === id);
    this.noticia.set(n);
    this.relacionadas.set(
      n
        ? (n.relacionadas || [])
            .map((rid) => this.noticias().find((x) => x.id === rid))
            .filter((x): x is News => !!x)
        : [],
    );
  }

  claseCategoria(n: News): string {
    return CAT_CLASS[n.categoria] ?? '';
  }

  esFavorita(id: number): boolean {
    return this.favoritesService.esFavorita(id);
  }

  alternarFavorito(id: number): void {
    this.favoritesService.alternar(id);
  }
}
