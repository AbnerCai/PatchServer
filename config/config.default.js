/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1561618321673_2952';

  // add your middleware config here
  config.middleware = [];

  config.security = {
    xframe: {
      enable: false,
    },
    csrf: {
      enable: false,
    },
  };

  config.mysql = {
    // database configuration
    client: {
      // host
      host: 'localhost',
      // port
      port: '3306',
      // username
      user: 'root',
      // password
      password: '314159',
      // database
      database: 'patch',
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };

  config.multipart = {
    mode: 'file',
  };

  // add your user config here
  const userConfig = {
    uploadFilePath: path.join(appInfo.baseDir, 'app/public/upload/'),
    baseUrl: 'http://localhost:7001/public/upload/',
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
