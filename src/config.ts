
interface IIndexSignature {
  [propName: string]: any;
}

/** removeKeys contain which keys we don't won't to see for public */
const removeKeys:  IIndexSignature = {
  dataSources: ['apiKey', 'apiKeyParam']
};

/** DataSource interface */
export interface IDataSource {
  [propName: string]: object | string | number;
}

/** Interface for config structure */
export interface IConfig extends IIndexSignature {
  apiPrefix: string;
  dataSources: IDataSource;
  port: number;
  queryParam: string;
  dataSourcesParam: string;
}

export const defaultConfig: IConfig = {
  apiPrefix: '/',
  dataSources: {},
  dataSourcesParam: "datasources",
  port: 8090,
  queryParam: "q"
}

/**
 * Class to control app configuration
 */
class Config {
  /** Config file path */
  private configFile: string

  private config: IConfig = {...defaultConfig}

  /** Contains config with removed ${removeKeys} */
  private configSafe: IConfig = {...defaultConfig}

  constructor(configFile = "../config.json") {
    this.configFile = configFile;
    const config: IConfig = require(configFile);
    this.config = JSON.parse(JSON.stringify(config));
    this.configSafe = this.removeKeys(JSON.parse(JSON.stringify(config)));
  }

  /**
   * This is ugly and should be refactor
   * Idea is too remove unwanted config keys
   */
  removeKeys = (config: IConfig): IConfig => {
    Object.keys(config).forEach((key: string) => {
      if(removeKeys[key]) {
        const thisRemoveKey = removeKeys[key];

        Object.keys(config[key]).forEach((insideKey: string) => {
          if(typeof config[key] === "object") {
            Object.keys(config[key][insideKey]).forEach((deepKey: string) => {
              if(thisRemoveKey.indexOf(deepKey) > -1)
                delete(config[key][insideKey][deepKey]);
            })
          }
        })
      }
    });

    return config;
  }

  /**
   * Get the whole app config
   */
  get = (param?: string, safe = true ): object => {
    const config: IConfig = safe ? this.configSafe : this.config;
    return param ? config[param] : config;
  }
}

export default Config;