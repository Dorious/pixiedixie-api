import Config from "../config";

export interface IImages {
  width: number,
  height: number,
  url: string,
  size: string
}

export interface IImage {
  type: string,
  created: string,
  pageUrl: string,
  images: IImages[]
}

export interface IDataSourceConfig {
  [propName: string]: any
}

export default abstract class DatasourceAdapter {
  config: Config
  configKey: string

  constructor(config:Config) {
    this.config = config;
    this.configKey = this.constructor.name.toLowerCase();
  }

  getConfig() {
    const config:IDataSourceConfig = this.config.get("dataSources", false);
    return config[this.configKey];
  }

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

  abstract async search(query:string, offset:number, limit:number): Promise<IImage[]|string>
  abstract async images(offset:number, limit:number): Promise<IImage[]|string>
}