import Config from "../config";
import axios, { AxiosResponse } from "axios";

export const DEFAULT_COUNT = 25;

export interface IImageSize {
  width: number,
  height: number,
  url: string,
  size: string
}

export interface IImage {
  created: string,
  datasource?: string,
  images: IImageSize[],
  pageUrl: string,
  type: string,
}

export interface IResults {
  totalCount: number,
  offset: number,
  count: number,
  images: IImage[],
  error?: ErrorConstructor
}

export interface IDataSourceConfig {
  [propName: string]: any
}

export interface IDataSourceParams {
  query?: string,
  offset?: number,
  count?: number,
  [propName: string]: any
}

/**
 * Abstract class for any Data Source
 * Check README.md for documentation
 */
export default abstract class DatasourceAdapter {
  private config: Config
  private configKey: string

  constructor(config:Config) {
    this.config = config;
    this.configKey = this.constructor.name.toLowerCase();
  }

  /**
   * Probably obvious: search
   * @param query Query string
   * @param offset Where to start
   * @param count How much
   */
  abstract async search(query:string, offset:number, count:number): Promise<IResults|string>

  /**
   * Method for main page to get lates/random/trendy pictues
   * @param offset Where to start
   * @param count How much
   */
  abstract async images(offset:number, count:number): Promise<IResults|string>

  /**
   * Returns this DataSource config from config.json
   */
  getConfig(): IDataSourceConfig {
    const config:IDataSourceConfig = this.config.get("dataSources", false);
    return config[this.configKey];
  }

  /**
   * Return configuration for specific endpoint
   * @param name A name of endpoint from config.json
   */
  getEndpoint(name:string) {
    const config = this.getConfig();
    const { baseUrl, apiKeyParam, apiKey, queryParam, endpoints } = config;
    const endpoint = endpoints[name];

    return {
      url: `${baseUrl}${endpoint}`,
      queryParam,
      params: {
        [apiKeyParam]: apiKey
      }
    }
  }

  /**
   * Methods for for pagination
   */
  getTotal = (data:AxiosResponse) => 0
  getCount = (data:AxiosResponse) => 0
  getOffset = (data:AxiosResponse) => 0

  /**
   * Fetch data via endpoint
   * @param endpointName A name of endpoint from config.json
   * @param params GET query params
   */
  async getData(endpointName:string, params?:IDataSourceParams): Promise<IResults> {
    const endpoint = this.getEndpoint(endpointName);

    let results:IResults = {
      totalCount: 0,
      count: 0,
      offset: 0,
      images: []
    };
    let images:IImage[] = [];

    params = {...endpoint.params, ...params};

    try {
      const response = await axios(endpoint.url, {
        params
      });

      const data = response.data;

      if(data) {
        images = this.translateImages(data);

        results = {
          totalCount: this.getTotal(data),
          count: this.getCount(data),
          offset: this.getOffset(data),
          images
        };
      }
    } catch (e) {
      results.error = e;
    }

    return Promise.resolve(results);
  }

  /**
   * Dummy translateImage function that just return the input
   */
  translateImages = (data:any): any => {
    const images:IImage[] = [];
    return images;
  }
}