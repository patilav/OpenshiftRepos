var app = angular.module("ServerApp", []);

app.controller("MyCntl", function ($scope, $http) {
    $scope.index = null;

    $http.get("/login")
    .success(function (response) {
        $scope.login = response;
    });

    $scope.remove = function (index) {
        $http.delete("/login/" + index)
        .success(function (response) {
            $scope.login = response;
        });
    };

    $scope.add = function (login) {
        $http.post("/login", login)
        .success(function (response) {
            $scope.login = response;
        });
    };

    $scope.edit = function (index) {
        $scope.index = index;
        $scope.logins = $scope.login[index];
    };

    $scope.update = function (login) {
        $http.put("/login/" + $scope.index, login)
        .success(function (response) {
            $scope.login = response;
        });
    };

});