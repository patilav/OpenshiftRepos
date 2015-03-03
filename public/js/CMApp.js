var app = angular.module("CMApp", []);

app.controller("CMController", function ($scope, $http) {
    $scope.remove = function (index) {
        $http.delete("/api/website/" + index)
        .success(function (response) {
            $scope.websites = response;
        })
     }

    $http.get("/api/website").success(function (response) {
        $scope.websites = response;
    });
});