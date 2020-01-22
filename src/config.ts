
interface IIndexSignature {
  [propName: string]: any;
}

/** removeKeys contain which keys we don't won't to see for public */
const removeKeys :  IIndexSignature = {
  dataSources: ['apiKey', 'apiKeyParam']
};

/** DataSource interface */
export interface IDataSource {
  [propName: string]: object | string | number;
}

/** Interface for config structure */
export interface IConfig extends  IIndexSignature {
  dataSources: IDataSource,
  port: number
}

/**
 * Class to control app configuration
 */
class Config {
  private configFile:string = "../config.json"

  private configRead:IConfig = {
    dataSources: {},
    port: 8090
  }

  constructor(configFile?:string) {
    this.configFile = configFile || this.configFile;
    const configRead:IConfig = require(this.configFile);
    this.configRead = configRead;
  }

  /**
   * This is ugly and should be refactor
   * Idea is too remove unwanted config keys
   */
  removeKeys = (config:IConfig) : void => {
    Object.keys(config).forEach((key:string) => {
      if(removeKeys[key]) {
        const thisRemoveKey = removeKeys[key];

        Object.keys(config[key]).forEach((insideKey:string) => {
          if(typeof config[key] === "object") {
            Object.keys(config[key][insideKey]).forEach((deepKey:string) => {
              if(thisRemoveKey.indexOf(deepKey) > -1)
                delete(config[key][insideKey][deepKey]);
            })
          }
        })
      }
    });
  }

  /**
   * Get the whole app config
   */
  getConfig = (param?:string, safe?:boolean) : object => {
    safe = safe || true;
    const config : IConfig = this.configRead;

    if(safe)
      this.removeKeys(config);

    return param ? config[param] : config;
  }
}

export default Config;