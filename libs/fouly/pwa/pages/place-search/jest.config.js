module.exports = {
  name: 'fouly-pwa-pages-place-search',
  preset: '../../../../../jest.config.js',
  coverageDirectory: '../../../../../coverage/libs/fouly/pwa/pages/place-search',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
