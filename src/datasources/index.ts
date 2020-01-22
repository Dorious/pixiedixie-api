import Config from "../config";
import DatasourceAdapter, { IImage } from "./adapter";
import { AxiosError } from "axios";

export default class DataSources {
  list:string[] = []
  config:Config = null;

  constructor(config:Config, list?:[string]) {
    this.config = config
    this.list = list || this.getDefaultList();
  }

  getConfig = ():Config => this.config

  getDefaultList = ():string[] => Object.keys(this.getConfig().get('dataSources'))

  getDataSources() : Promise<object> {
    const ds:DatasourceAdapter[] = [];

    return new Promise((res, rej) => {
      let count = 0;

      this.list.forEach((name) => {
        import(`./${name}`).then((module) => {
          ds.push(module.default);
          count++;

          if(count === this.list.length) {
            res(ds);
          }
        });
      });
    });
  }

  async search(q:string): Promise<object> {
    const ds = await this.getDataSources();
    let results:IImage[]|ErrorConstructor = [];

    for(const DatasourceClass of Object.values(ds)) {
      const datasource = new DatasourceClass(this.getConfig());
      const data = await datasource.search(q);

      if(data instanceof Error) {
        return Promise.resolve(data);
      }

      results = results.concat(data);
    }

    return Promise.resolve(results);
  }
}