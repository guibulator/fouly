module.exports = {
  name: 'fouly-pwa-pages-contribute',
  preset: '../../../../../jest.config.js',
  coverageDirectory: '../../../../../coverage/libs/fouly/pwa/pages/contribute',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
