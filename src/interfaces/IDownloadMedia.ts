export interface IDownloadMedia {
  downloadAudio(
    url: string,
    telefoneCliente: string,
    MediaContentType0: string
  ): Promise<string>;
}
