import DatasourceAdapter, { IImage, IImages } from "./adapter";
import axios from "axios";

export interface IGiphyImage {
  type: string,
  import_datetime: string,
  images: IGiphyImageSizes,
  url: string
}

export interface IGiphyImageSizes {
  [propName: string]: IGiphyImageSize
}

export interface IGiphyImageSize {
  url: string,
  width: number,
  height: number
}

export interface ISizes {
  [propName: string]: string
}

export default class Giphy extends DatasourceAdapter {

  sizes:ISizes = {
    fixed_width: "normal"
  };

  translateImages = (giphyImage:IGiphyImage) => {
    const imageSizes:IImages[] = [];

    const image:IImage = {
      type: giphyImage.type,
      created: giphyImage.import_datetime,
      images: imageSizes,
      pageUrl: giphyImage.url
    }

    // Translate images from Giphy
    Object.keys(this.sizes).forEach((key:string) => {
      const imageInfo:IGiphyImageSize = giphyImage.images[key];

      imageSizes.push({
        size: this.sizes[key],
        url: imageInfo.url,
        width: imageInfo.width,
        height: imageInfo.height
      })
    });

    return image;
  }

  async search(query:string, offset:number, limit:number): Promise<IImage[]|string> {
    const endpoint = this.getEndpoint("search");
    let images:IImage[] = [];

    try {
      const response = await axios(endpoint.url, {
        params: {
          ...endpoint.params,
          [endpoint.queryParam]: query
        }
      });
      const data = response.data.data;
      images = data.map((giphyImage:IGiphyImage) => this.translateImages(giphyImage));
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
        images: [
          {
            url: 'test',
            width: 100,
            height: 100,
            size: ''
          }
        ]
      }

      arr.push(image);
      res(arr);
    });
  }

}