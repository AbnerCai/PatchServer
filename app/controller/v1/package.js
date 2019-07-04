'use strict';

const Controller = require('egg').Controller;

const fs = require('mz/fs');
const path = require('path');
const crypto = require('crypto');

const moment = require('moment');
const mkdirp = require('mkdirp');

const STRING = require('../constant/string');
const CODE = require('../constant/code');


class PackageController extends Controller {
  /**
   * 资源包上传.
   * */
  async upload() {
    const { ctx, app } = this;
    const result = {};

    const body = ctx.request.body;
    // 校验参数
    const moduleId = body.moduleId;
    const moduleName = body.moduleName;
    const version = body.version;
    const versionName = body.versionName;
    const type = body.type;

    if (!moduleId || !moduleName || !version || !versionName) {
      result.code = CODE.ERROR_PARAM_MISS;
      result.msg = STRING.ERROR_PARAM_MISS;
      ctx.body = result;
      return;
    }

    const file = ctx.request.files[0];
    if (!file) {
      result.code = CODE.ERROR_PARAM_MISS;
      result.msg = STRING.ERROR_PARAM_FILE_MISS;
      ctx.body = result;
      return;
    }
    // 文件存储
    const fileName = file.filename;
    // const uid = uuidV1().replace(/\-/g, '');
    const extname = path.extname(fileName);
    const timestamp = moment().format('YYYYMMDDHHmmssSSS');
    // 存储文件的文件名为: 模块名 + 版本名称 + 时间戳
    const newFileName = `${moduleName}_${versionName}_${timestamp}${extname}`;

    const newPath = app.config.uploadFilePath + moment().format('YYYY/MM/DD/');
    const baseUrl = app.config.baseUrl + moment().format('YYYY/MM/DD/');

    const newFilePath = newPath + newFileName;

    try {
      // 处理文件
      ctx.logger.info('文件存储路径: %s', newPath);
      try {
        // 检验文件夹是否存在.
        fs.accessSync(newPath, fs.F_OK);
      } catch (e) {
        // 创建文件夹
        mkdirp.sync(newPath);
        ctx.logger.info('创建文件夹');
      }
      // 文件大小
      const size = fs.statSync(file.filepath).size;
      // 写文件
      await fs.createReadStream(file.filepath).pipe(fs.createWriteStream(newFilePath));

      // 读取一个Buffer
      const buffer = fs.readFileSync(file.filepath);
      const fsMd5Hash = crypto.createHash('md5');
      const fsSha256Hash = crypto.createHash('sha256');

      fsMd5Hash.update(buffer);
      const md5 = fsMd5Hash.digest('hex');

      fsSha256Hash.update(buffer);
      const sha256 = fsSha256Hash.digest('hex');

      // 执行 shell 命令
      // const command = `cd ${newPath} && cwebp -q 80 ${newFileName} -o ${uid}.webp`;
      // await process.exec(command, function(error, stdout, stderr) {
      //   if (error !== null) {
      //     ctx.logger.info('exec error: ' + error);
      //   } else {
      //     ctx.logger.info('stdout: ' + stdout);
      //   }
      // });

      // ctx.logger.info('shell 执行完毕');

      const data = {
        moduleId,
        moduleName,
        version,
        versionName,
        type,
        size,
        md5,
        sha256,
        fileName: newFileName,
        downloadUrl: baseUrl + newFileName,
        filePath: newFilePath,
        publishTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      };
      // 存储 Mysql
      const tmp = ctx.service.package.create(app, data);
      // TODO: 验证

      result.code = CODE.SUCCESS;
      result.msg = STRING.SUCCESS_UPLOAD_FILE;
      result.data = data;
    } catch (e) {
      result.code = CODE.ERROR_SAVE_FILE;
      result.msg = `${STRING.ERROR_SAVE_FILE}: ${e}`;
    } finally {
      // 需要删除临时文件
      await fs.unlink(file.filepath);
    }
    ctx.body = result;
  }

  /**
   * 资源包列表查询.
   * */
  async list() {
    const { ctx, app } = this;
    const result = {};

    const body = ctx.request.body;
    // 校验参数
    const moduleId = body.moduleId;
    if (!moduleId) {
      result.code = CODE.ERROR_PARAM_MISS;
      result.msg = STRING.ERROR_PARAM_MISS;
      ctx.body = result;
      return;
    }
    const data = {
      moduleId,
    };

    const tmp = await ctx.service.package.list(app, data);

    result.code = CODE.SUCCESS;
    result.msg = STRING.SUCCESS;
    result.data = tmp;
    ctx.body = result;
  }

  /**
   * 资源包查询.
   * */
  async query() {
    const { ctx, app } = this;
    const result = {};

    const body = ctx.request.body;
    // 校验参数
    const moduleId = body.moduleId;
    const version = body.version;
    const versionName = body.versionName;
    if (!moduleId || !version || !versionName) {
      result.code = CODE.ERROR_PARAM_MISS;
      result.msg = STRING.ERROR_PARAM;
      ctx.body = result;
      return;
    }

    const data = {
      moduleId,
      version,
      versionName,
    };

    const tmp = await ctx.service.package.query(app, data);

    result.code = CODE.SUCCESS;
    result.msg = STRING.SUCCESS;
    result.data = tmp;
    ctx.body = result;
  }
}

module.exports = PackageController;
