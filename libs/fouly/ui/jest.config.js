module.exports = {
  name: 'fouly-ui',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/fouly/ui',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
