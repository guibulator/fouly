module.exports = {
  name: 'fouly-shared-providers',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/fouly/shared/providers',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
