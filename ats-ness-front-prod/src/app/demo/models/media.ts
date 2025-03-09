export interface Media {
    id?: number; // Optional because it may not be set initially
    name: string;
    imagenUrl: string; // URL of the image
    codeImage?: string; // Optional field for any image code
}  