import DatasourceAdapter, { IImage, IResults } from "./adapter";
import { AxiosResponse } from "axios";

export interface IPixabayImage {
  largeImageURL: string,
  imageHeight: number,
  imageWidth: number,
  pageURL: string,
  previewURL: string,
  type: string,
  webformatHeight: number,
  webformatWidth: number,
  webformatURL: string
}

export interface IData extends AxiosResponse {
  hits: IPixabayImage[],
  total: number
}

export default class Pixabay extends DatasourceAdapter {
  /**
   * Need to set count/offset on fetch.
   * Because API doesn't provide.
   */
  private count = 0
  private offset = 0

  /**
   * Parse date from url
   * Yeah that is sick but that's the only way :P
   */
  parseDate(image:IPixabayImage) {
    const m = image.previewURL.match(/([\d]{4})\/([\d]{2})\/([\d]{2})\/([\d]{2})\/([\d]{2})\//);
    return `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}`;
  }

  /**
   * Multiple sizes for responsive
   * Probably not necessary for out purpose but what the heck
   */
  translateImage(pixabayImage:IPixabayImage) {
    const type = pixabayImage.webformatURL.split('.').pop();

    const image:IImage = {
      type,
      created: this.parseDate(pixabayImage),
      datasource: 'pixabay',
      images: [{
        width: pixabayImage.webformatWidth,
        height: pixabayImage.webformatHeight,
        url: pixabayImage.webformatURL,
        size: '640px'
      },
      {
        width: Math.floor((1280/pixabayImage.imageHeight)*pixabayImage.imageWidth),
        height: 1280,
        url: pixabayImage.largeImageURL,
        size: '1280px'
      }],
      pageUrl: pixabayImage.pageURL,
    }

    return image;
  }

  /**
   * Translates Pixabay to our format
   */
  translateImages = (responseData:IData):IImage[] => {
    const images:IImage[] = responseData.hits.map(
      (pixabayImage:IPixabayImage) => this.translateImage(pixabayImage)
    );
    return images;
  }

  getTotal = (data:IData) => data.total
  getCount = (data:IData) => data.hits.length
  getOffset = (data:IData) => this.offset
  setOffset = (offset:number) => this.offset = offset;

  async search(query:string, offset:number, count:number): Promise<IResults|string> {
    const endpoint = this.getEndpoint("search");
    this.setOffset(offset);

    console.log('pixacount', count);

    return this.getData("search", {
      [endpoint.queryParam]: query,
      per_page: count
    });
  }

  async images(offset:number, count:number): Promise<IResults> {
    const endpoint = this.getEndpoint("images");

    return this.getData("images");
  }

}