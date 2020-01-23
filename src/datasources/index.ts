import Config from "../config";
import DatasourceAdapter, { IResults, IImage, DEFAULT_COUNT } from "./adapter";

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

  async search(q:string, offset:number = 0, count:number = DEFAULT_COUNT): Promise<object> {
    const ds = await this.getDataSources();
    let results:IResults = null;

    for(const DatasourceClass of Object.values(ds)) {
      const datasource = new DatasourceClass(this.getConfig());
      const data = await datasource.search(q, offset, count);

      if(data.error instanceof Error) {
        return Promise.resolve(data);
      }

      results = this.mergeResults(results, data);
    }

    return Promise.resolve(results);
  }

  async images(offset:number = 0, count:number = DEFAULT_COUNT): Promise<object> {
    const ds = await this.getDataSources();
    let results:IResults = null;

    for(const DatasourceClass of Object.values(ds)) {
      const datasource = new DatasourceClass(this.getConfig());
      const data = await datasource.images(offset, count);

      if(data.error instanceof Error) {
        return Promise.reject(data.error);
      }

      results = this.mergeResults(results, data);
    }

    return Promise.resolve(results);
  }

  mergeResults(resultsA:IResults, resultsB:IResults): IResults {
    let results: IResults = resultsA;

    if(!results) {
      results = resultsB;
    } else {
      results.totalCount += resultsB.totalCount;
      results.count += resultsB.count;
      results.images = results.images.concat(resultsB.images);
    }

    results.images.sort(this.sortResults);

    return results;
  }

  sortResults = (a:IImage, b:IImage) => new Date(a.created) < new Date(b.created) ? 1 : -1;
}