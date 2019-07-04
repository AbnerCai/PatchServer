'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.post('/mp/v1/patch/package/upload', controller.v1.package.upload);
  router.post('/mp/v1/patch/package/list', controller.v1.package.list);
  router.post('/mp/v1/patch/package/query', controller.v1.package.query);

  router.post('/mp/v1/patch/config/list', controller.v1.config.list);
  router.post('/mp/v1/patch/config/create', controller.v1.config.create);
  router.post('/mp/v1/patch/config/update', controller.v1.config.update);
  router.post('/mp/v1/patch/config/delete', controller.v1.config.delete);

};
