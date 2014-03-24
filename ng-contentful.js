'use strict';

(function(){
  var module = angular.module('ng-contentful', []);
  module.provider('contentfulClient', function ContentfulClientProvider() {
    var spaceId, accessToken, ssl=true, options= {};

    this.setSpaceId     = function (id)     { spaceId = id; };
    this.setAccessToken = function (token)  { accessToken = token; };
    this.setSSL         = function (useSSL) { ssl = !!useSSL; };
    this.setOptions     = function (opt)    { options = opt; };

    this.$get = ['$q', function ($q) {
      /*global contentful*/
      var finalOptions = Object.create(options);
      finalOptions.space = spaceId;
      finalOptions.accessToken = accessToken;
      finalOptions.secure = ssl;

      var client = contentful.createClient(finalOptions);

      pimpPromises(client, 'asset assets contentType contentTypes entry entries space'.split(' '));

      return client;

      function pimpPromises(object, methods) {
        methods.forEach(function (method) {
          var originalMethod = object[method];
          object[method] = function () {
            var args = arguments;
            return $q.when(originalMethod.apply(object, args));
          };
        });
      }
    }];
  });

  module.factory('ContentTypeList', ['$q', 'contentfulClient', function ($q, contentfulClient) {
    var cache = {};
    var lookups = {};

    return {
      lookupContentType: function (id) {
        if (cache[id]) {
          return $q.when(cache[id]);
        } else if (lookups[id]) {
          return lookups[id];
        } else {
          var lookup = contentfulClient.contentType(id)
          .then(function (contentType) {
            cache[id] = contentType;
            return contentType;
          });
          lookups[id] = lookup;
          return lookup;
        }
      },
      loadAllContentTypes: function () {
        contentfulClient.contentTypes()
        .then(function (contentTypes) {
          contentTypes.forEach(function (contentType) {
            cache[contentType.sys.id] = contentType;
          });
        });
      },
      getContentType: function (id) {
        return cache[id];
      }
    };
  }]);

  module.controller('EntryController', ['$scope', 'ContentTypeList', function ($scope, ContentTypeList) {
    $scope.entryTitle = function () {
      var contentType = getContentType();
      if (contentType) {
        return $scope.entry.fields[contentType.displayField];
      }
    };

    $scope.contentType = function () {
      return getContentType();
    };

    function lookupContentType() {
      return ContentTypeList.lookupContentType(contentTypeId());
    }

    function getContentType() {
      var ct = ContentTypeList.getContentType(contentTypeId());
      if (ct) {
        return ct;
      } else {
        lookupContentType();
      }
    }

    function contentTypeId() {
      return $scope.entry.sys.contentType.sys.id;
    }
  }]);
})();
