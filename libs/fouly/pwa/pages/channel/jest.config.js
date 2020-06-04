module.exports = {
  name: 'fouly-pwa-pages-channel-channel',
  preset: '../../../../../../jest.config.js',
  coverageDirectory: '../../../../../../coverage/libs/fouly/pwa/pages/channel/channel',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
