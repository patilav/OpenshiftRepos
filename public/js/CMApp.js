var app = angular.module("CMApp", []);

app.controller("CMController", function ($scope, $http) {

    $scope.add = function (site) {
        $http.post("/api/website",site)
        .success(function (response) {
            $scope.websites = response;
        })
    }

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