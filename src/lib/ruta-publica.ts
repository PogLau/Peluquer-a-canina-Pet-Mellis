/** Ruta de un archivo de /public. En la demo de GitHub Pages el sitio vive bajo un subdirectorio. */
export function rutaPublica(ruta: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${ruta}`
}
