var app = angular.module("CMApp", []);

app.controller("CMController", function ($scope, $http) {
    $http.get("/api/website").success(function (response) {
        $scope.websites = response;
    });
});