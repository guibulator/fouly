module.exports = {
  name: 'shared-authentication',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shared/authentication',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
