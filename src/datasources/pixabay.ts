import DatasourceAdapter, { IImage } from "./adapter";
import axios from "axios";

export interface IPixabayImage {
  largeImageURL: string,
  webformatURL: string
}

export default class Pixabay extends DatasourceAdapter {

  async search(query:string, offset:number, limit:number): Promise<IImage[]> {
    const endpoint = this.getEndpoint("search");
    const images:IImage[] = [];

    try {
      const response = await axios(endpoint.url, {
        params: {
          ...endpoint.params,
          [endpoint.queryParam]: query
        }
      });

      const data = response.data.data;
      // images = data.map((giphyImage:IGiphyImage) => this.translateImages(giphyImage));
    } catch (e) {
      return Promise.resolve(e);
    }

    return Promise.resolve(images);
  }

  async images(offset:number, limit:number): Promise<IImage[]> {
    return new Promise((res, rej) => {
      const arr = [];

      const image:IImage = {
        type: 'gif',
        created: '',
        pageUrl: '',
        images: [
          {
            url: 'test',
            width: 100,
            height: 100,
            size: "normal"
          }
        ]
      }

      arr.push(image);
      res(arr);
    });
  }

}