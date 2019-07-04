'use strict';

const Controller = require('egg').Controller;

const fs = require('mz/fs');
const path = require('path');
const crypto = require('crypto');

const moment = require('moment');
const mkdirp = require('mkdirp');

const STRING = require('../constant/string');
const CODE = require('../constant/code');


class ConfigController extends Controller {
  /**
   * 配置表查询
   * */
  async list() {
    const { ctx, app } = this;
    const result = {};

    const body = ctx.request.body;

    const data = {
    };

    const tmp = await ctx.service.config.list(app, data);

    result.code = CODE.SUCCESS;
    result.msg = STRING.SUCCESS;
    result.data = tmp;
    ctx.body = result;
  }

  /**
   * 新增配置.
   * */
  async create() {
    const { ctx, app } = this;
    const result = {};

    const body = ctx.request.body;
    // 校验参数
    const keyword = body.keyword;
    const value = body.value;
    if (!keyword || !value) {
      result.code = CODE.ERROR_PARAM_MISS;
      result.msg = STRING.ERROR_PARAM;
      ctx.body = result;
      return;
    }

    const data = {
      keyword,
      value,
      createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    const id = await ctx.service.config.create(app, data);
    data.id = id;

    result.code = CODE.SUCCESS;
    result.msg = STRING.SUCCESS;
    result.data = data;
    ctx.body = result;
  }

  /**
   * 更新配置.
   * */
  async update() {
    const { ctx, app } = this;
    const result = {};

    const body = ctx.request.body;
    // 校验参数
    const id = body.id;
    const keyword = body.keyword;
    const value = body.value;
    if (!id || !keyword || !value) {
      result.code = CODE.ERROR_PARAM_MISS;
      result.msg = STRING.ERROR_PARAM;
      ctx.body = result;
      return;
    }

    const data = {
      id,
      keyword,
      value,
      updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    const tmp = await ctx.service.config.update(app, data);
    if (tmp) {
      result.code = CODE.SUCCESS;
      result.msg = STRING.SUCCESS;
      result.data = data;
    } else {
      result.code = CODE.ERROR_SQL_EXECUTE;
      result.msg = STRING.ERROR_SQL_EXECUTE;
    }
    ctx.body = result;
  }

  /**
   * 删除配置.
   * */
  async delete() {
    const { ctx, app } = this;
    const result = {};

    const body = ctx.request.body;
    // 校验参数
    const id = body.id;
    const keyword = body.keyword;
    if (!id || !keyword) {
      result.code = CODE.ERROR_PARAM_MISS;
      result.msg = STRING.ERROR_PARAM;
      ctx.body = result;
      return;
    }

    const data = {
      id,
      keyword,
    };

    const tmp = await ctx.service.config.delete(app, data);
    if (tmp) {
      result.code = CODE.SUCCESS;
      result.msg = STRING.SUCCESS;
    } else {
      result.code = CODE.ERROR_SQL_EXECUTE;
      result.msg = STRING.ERROR_SQL_EXECUTE;
    }
    ctx.body = result;
  }

}

module.exports = ConfigController;
