'use strict';

const Service = require('egg').Service;

class ConfigService extends Service {

  /**
   * 查询资源包列表.
   * */
  async list(app, data) {
    const sql = 'SELECT id, keyword, value, ' +
      'date_format(create_time, \'%Y-%m-%d %H:%i:%s\') as createTime, ' +
      'date_format(update_time, \'%Y-%m-%d %H:%i:%s\') as updateTime ' +
      'FROM config ';
    const tmp = await app.mysql.query(sql);
    return tmp;
  }

  /**
   * 新增配置.
   * */
  async create(app, configData) {
    const data = {
      keyword: configData.keyword,
      value: configData.value,
      create_time: configData.createTime,
    };
    const result = await app.mysql.insert('config', data);
    return result.insertId;
  }

  /**
   * 更新配置.
   * */
  async update(app, configData) {
    const data = {
      id: configData.id,
      keyword: configData.keyword,
      value: configData.value,
      update_time: configData.updateTime,
    };
    const result = await this.app.mysql.update('config', data);
    if (result && result.affectedRows === 1) {
      return true;
    }
    return false;
  }

  /**
   * 删除配置.
   * */
  async delete(app, configData) {
    const data = {
      id: configData.id,
      keyword: configData.keyword,
    };
    const result = await this.app.mysql.delete('config', data);
    if (result && result.affectedRows === 1) {
      return true;
    }
    return false;
  }
}

module.exports = ConfigService;
