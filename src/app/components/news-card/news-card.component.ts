import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { News } from '../../models/news.model';

const CAT_CLASS: Record<string, string> = {
  educacion: 'cat-edu',
  tecnologia: 'cat-tech',
  turismo: 'cat-tur',
  comercio: 'cat-com',
};

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './news-card.component.html',
})
export class NewsCardComponent {
  @Input({ required: true }) news!: News;
  @Input() favorita = false;
  @Input() listStyle = false;
  @Output() favoritoClick = new EventEmitter<number>();

  get claseCategoria(): string {
    return CAT_CLASS[this.news.categoria] ?? '';
  }

  get claseTamano(): string {
    if (this.listStyle) return '';
    return this.news.tamHome === 'feature'
      ? 'card-feature'
      : this.news.tamHome === 'normal-wide'
        ? 'card-normal-wide'
        : '';
  }

  onFavorito(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.favoritoClick.emit(this.news.id);
  }
}
