# ng-contentful

ng-contentful is a [AngularJS][angularjs] module for accessing the [Contentful][contentful]
[content delivery API][docs] and integrate content into your website.

It wraps the [contentful.js][cfjs] module into AngularJS modules, integrates its asynchronous operations in the digest-cycle and provides a couple of helpers for displaying content.

## Installation

    bower install ng-contentful

Then just include the file by script-tag

     <script type="text/javascript" charset="utf-8" src="bower_components/ng-contentful/src/ng-contentful.js"></script>

## Setup

1. Require the module
2. In the config phase you set up your connection like so:

    var myApp = angular.module('myApp', ['ng-contentful']);

    myApp.config(function (contentfulClientProvider) {
      contentfulClientProvider.setOptions({
        // any other options, see contentful.js documentation
      });
      contentfulClientProvider.setSpaceId('mySpaceId');
      contentfulClientProvider.setAccessToken('myAccessToken');
    });

## Usage

There are currently three services available:

- contentfulClient: The base service to make requests to the server
- ContentTypeList: Mechanism to synchronously and asynchronously look up
  contentTypes
- EntryController: Controller to help work with entries

### contentfulClient

Require the `contentfulClient` service and call the available methods
(see [Contentful.js documentation][cfjs]. Process the responses via
Promises:

    myApp.controller('SpaceController', function ($scope, contentfulClient) {
      contentfulClient.space().then(function (space) {
        $scope.space = space;
      });
    });
    
### ContentTypeList

Provides three methods:

- lookupContentType(id): lookup the contentType by id by fetching the
  information from the server if necessary. Returns a promise.
- loadAllContentTypes: Loads all available contentTypes from the server.
  Returns a promise
- getContentType(id): Synchronously returns contentType. Returns null if
  contentType is not yet know to the client.

### EntryController

The EntryController assumes there's an `entry` on the scope.

Exposes two methods:

- $scope.entryTitle(): Returns the title for an entry
- $scope.contentType(): Returns the contentType for an entry if
  available locally. If not available, it triggers a lookup and when the
  lookup is done, $apply gets called so that it then returns the
  contentType.

[angularjs]: http://angularjs.org
[contentful]: http://contentful.com
[docs]: https://www.contentful.com/developers/documentation/content-delivery-api/
[cfjs]: https://github.com/contentful/contentful.js
