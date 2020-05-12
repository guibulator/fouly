module.exports = {
  name: 'fouly-pwa-app-shell',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/fouly/pwa/app-shell',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
