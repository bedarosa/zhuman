import axios from "axios";
import fs from "fs";
import moment from "moment";
import dotenv from "dotenv";
import { IDownloadMedia } from "../interfaces/IDownloadMedia";

dotenv.config();

export class DownloadMedia implements IDownloadMedia {
  async downloadAudio(
    url: string,
    telefoneCliente: string,
    MediaContentType: string
  ): Promise<string> {
    const formattedDateTime = moment().format("DD-MM-YYYY-HH:mm");
    const extensaoMedia = MediaContentType.split("/")[1];
    const downloadDirector = process.env.FILEPATHDOWNLOAD;
    const filePath = `${downloadDirector}${
      telefoneCliente + "-" + formattedDateTime + "." + extensaoMedia
    }`;
    await axios({
      method: "GET",
      url,
      responseType: "arraybuffer",
    })
      .then((response) => {
        const audioData = Buffer.from(response.data, "binary");
        fs.writeFileSync(filePath, audioData);
        console.log("Download concluído");
      })
      .catch((error) => {
        console.error("Erro durante o download:", error);
      });
    return filePath;
  }
}
