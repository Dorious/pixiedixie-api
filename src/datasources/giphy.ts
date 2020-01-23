import DatasourceAdapter, { IImage, IImageSize, IResults } from "./adapter";
import { AxiosAdapter, AxiosResponse } from "axios";

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

export interface IData extends AxiosResponse {
  data: [],
  pagination: {
    total_count: number,
    count: number,
    offset: number
  }
}

export default class Giphy extends DatasourceAdapter {

  sizes:ISizes = {
    fixed_width: "normal"
  };

  translateImageSizes = (giphyImage:IGiphyImage) => {
    const imageSizes:IImageSize[] = Object.keys(this.sizes).map((key:string) => {
      const imageInfo:IGiphyImageSize = giphyImage.images[key];
      return {
        size: this.sizes[key],
        url: imageInfo.url,
        width: imageInfo.width,
        height: imageInfo.height
      }
    });

    return imageSizes;
  }

  translateImage = (giphyImage:IGiphyImage) => {
    const imageSizes:IImageSize[] = this.translateImageSizes(giphyImage);

    const image:IImage = {
      datasource: 'giphy',
      type: giphyImage.type,
      created: giphyImage.import_datetime,
      images: imageSizes,
      pageUrl: giphyImage.url
    }

    return image;
  }

  translateImages = (responseData:IData) => {
    const images:IImage[] = responseData.data.map(
      (giphyImage:IGiphyImage) => this.translateImage(giphyImage)
    );
    return images;
  }

  getTotal = (data:IData) => {
    return data.pagination.total_count;
  }

  getCount = (data:IData) => {
    return data.pagination.count;
  }

  getOffset = (data:IData) => {
    return data.pagination.offset;
  }

  async search(query:string, offset:number, count:number): Promise<IResults|string> {
    const endpoint = this.getEndpoint("search");

    return this.getData("search", {
      [endpoint.queryParam]: query,
      limit: count,
      offset
    });
  }

  async images(offset:number, count:number): Promise<IResults> {
    const endpoint = this.getEndpoint("images");
    return this.getData("images");
  }

}