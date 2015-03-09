var app = angular.module("CMApp", []);

app.controller("CMController", function ($scope, $http) {
    $scope.selectedIndex = null;
    $scope.selectedSite = null;

    $scope.removePage = function (pageIndex) {
        $http.delete("/api/website/" + $scope.selectedIndex + "/page/" + pageIndex)
        .success(function (response)
        {
            $scope.websites = response;
            $scope.selectedSite = response[$scope.selectedIndex];
        })
    }

    $scope.select = function (index) {
        $scope.selectedIndex = index
        $scope.selectedSite = $scope.websites[index];

    }

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