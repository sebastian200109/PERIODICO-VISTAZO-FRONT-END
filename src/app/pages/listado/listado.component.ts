import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { Categoria, News } from '../../models/news.model';
import { FavoritesService } from '../../services/favorites.service';
import { NewsService } from '../../services/news.service';

type Filtro = Categoria | 'todas';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NewsCardComponent],
  templateUrl: './listado.component.html',
})
export class ListadoComponent implements OnInit {
  categorias: { valor: Filtro; etiqueta: string }[] = [
    { valor: 'todas', etiqueta: 'Todas' },
    { valor: 'educacion', etiqueta: 'Educación' },
    { valor: 'tecnologia', etiqueta: 'Tecnología' },
    { valor: 'turismo', etiqueta: 'Turismo' },
    { valor: 'comercio', etiqueta: 'Comercio' },
  ];

  noticias = signal<News[]>([]);
  filtroActivo = signal<Filtro>('todas');

  lista = computed(() => {
    const filtro = this.filtroActivo();
    return filtro === 'todas'
      ? this.noticias()
      : this.noticias().filter((n) => n.categoria === filtro);
  });

  constructor(
    private newsService: NewsService,
    public favoritesService: FavoritesService,
  ) {}

  ngOnInit(): void {
    this.favoritesService.cargar();
    this.newsService.obtenerNoticias().subscribe((noticias) => this.noticias.set(noticias));
  }

  seleccionarFiltro(valor: Filtro): void {
    this.filtroActivo.set(valor);
  }

  esFavorita(id: number): boolean {
    return this.favoritesService.esFavorita(id);
  }

  alternarFavorito(id: number): void {
    this.favoritesService.alternar(id);
  }
}
