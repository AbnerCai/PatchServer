'use strict';

const Service = require('egg').Service;

const uuid = require('uuid');
const moment = require('moment');

const USER_TOKEN = 'token:';

// 6 小时
const SECONDS = 6 * 60 * 60;

class PackageService extends Service {

  /**
   * 创建资源包记录.
   * */
  async create(app, packageData) {
    const data = {
      module_id: packageData.moduleId,
      module_name: packageData.moduleName,
      type: packageData.type,
      version: packageData.version,
      version_name: packageData.versionName,
      download_url: packageData.downloadUrl,
      file_path: packageData.filePath,
      publish_time: packageData.publishTime,
      size: packageData.size,
      md5: packageData.md5,
      sha256: packageData.sha256,
    };
    const tmp = await app.mysql.insert('package', data);
    return tmp.insertId;
  }

  /**
   * 查询资源包列表.
   * */
  async list(app, packageData) {
    const sql = 'SELECT id, description, type, version, md5, sha256, size, ' +
      'module_id as moduleId, ' +
      'module_name as moduleName, ' +
      'version_name as versionName, ' +
      'download_url as downloadUrl, date_format(publish_time, \'%Y-%m-%d %H:%i:%s\') as publishTime ' +
      'FROM package ' +
      'WHERE module_id = ?';
    const tmp = await app.mysql.query(sql, packageData.moduleId);
    return tmp;
  }

  /**
   * 查询资源包.
   * */
  async query(app, packageData) {
    const sql = 'SELECT id, description, type, version, md5, sha256, size, ' +
      'module_id as moduleId, ' +
      'module_name as moduleName, ' +
      'version_name as versionName, ' +
      'download_url as downloadUrl, date_format(publish_time, \'%Y-%m-%d %H:%i:%s\') as publishTime ' +
      'FROM package ' +
      'WHERE module_id = ? AND version >= ? ' +
      'ORDER BY publish_time DESC';
    const tmp = await app.mysql.query(sql, [ packageData.moduleId, packageData.version ]);
    if (tmp && tmp.length >= 1) {
      return tmp[0];
    }
    return {};
  }

}

module.exports = PackageService;
