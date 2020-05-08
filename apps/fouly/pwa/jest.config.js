module.exports = {
  name: 'fouly-pwa',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/apps/fouly/pwa',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
