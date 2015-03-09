var app = angular.module("FormApp", []);

app.controller("FormController", function ($scope, $http) {
    $scope.hello = "Hello from FormController";

    $scope.add = function (site) {
        $http.post("/api/forms",site)
        .success(function (response) {
            $scope.forms = response;
        })
    }

    $scope.remove = function (id) {
        //alert(id);
        $http.delete("/api/form/" + id)
        .success(function (response) {
            $scope.forms = response;
        })
     }

    $http.get("/api/form").success(function (response) {
        $scope.forms = response;
    });

});