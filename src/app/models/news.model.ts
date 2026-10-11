export type Categoria = 'educacion' | 'tecnologia' | 'turismo' | 'comercio';

export interface News {
  id: number;
  categoria: Categoria;
  catLabel: string;
  imagen: string;
  titulo: string;
  resumen: string;
  contenido: string[];
  ubicacion: string;
  fecha: string;
  modalidad: string;
  costo: string;
  cupos: string;
  relacionadas: number[];
  destacadaHome: boolean;
  tamHome: 'feature' | 'normal' | 'normal-wide' | null;
}
