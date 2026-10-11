import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

const FAVORITOS_STORAGE_KEY = 'vistazoFavoritos';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly favoritos = signal<number[]>([]);
  readonly favoritos$ = this.favoritos.asReadonly();
  private cargados = false;

  constructor(private http: HttpClient) {}

  async cargar(): Promise<void> {
    if (this.cargados) return;
    this.cargados = true;

    const guardados = localStorage.getItem(FAVORITOS_STORAGE_KEY);
    if (guardados) {
      this.favoritos.set(JSON.parse(guardados));
      return;
    }

    try {
      const iniciales = await firstValueFrom(this.http.get<number[]>('data/favoritos.json'));
      this.favoritos.set(iniciales ?? []);
    } catch {
      this.favoritos.set([]);
    }
  }

  esFavorita(id: number): boolean {
    return this.favoritos().includes(Number(id));
  }

  alternar(id: number): void {
    id = Number(id);
    const actuales = this.favoritos();
    const nuevos = this.esFavorita(id)
      ? actuales.filter((favId) => favId !== id)
      : [...actuales, id];
    this.favoritos.set(nuevos);
    localStorage.setItem(FAVORITOS_STORAGE_KEY, JSON.stringify(nuevos));
  }
}
