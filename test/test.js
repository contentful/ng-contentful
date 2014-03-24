'use strict';

var testApp = angular.module('testapp', ['ng-contentful']);

testApp.config(function (contentfulClientProvider) {
  contentfulClientProvider.setSpaceId('cfexampleapi');
  contentfulClientProvider.setAccessToken('b4c0n73n7fu1');
});

testApp.controller('SpaceController', function ($scope, contentfulClient) {
  contentfulClient.space().then(function (space) {
    $scope.space = space;
  });
});

testApp.controller('EntriesController', function ($scope, contentfulClient) {
  contentfulClient.entries().then(function (entries) {
    $scope.entries = entries;
  });
});
