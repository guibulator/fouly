module.exports = {
  name: 'fouly-webfront',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/apps/fouly/webfront',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
