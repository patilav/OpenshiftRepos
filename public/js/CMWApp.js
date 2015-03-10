var app = angular.module("CMApp", []);

app.controller("CMController", function ($scope, $http) {
    $scope.selectedIndex = null;
    $scope.selectedSite = null;

    $scope.removePage = function (pageIndex) {
        $scope.selectedSite.pages.splice(pageIndex, 1);
        $http.put("/mongoapi/website/" + $scope.selectedSite._id, $scope.selectedSite)
        .success(function (resp) {
            $scope.websites = resp;
        })
    }

    $scope.select = function (index) {
        $scope.selectedIndex = index
        $scope.selectedSite = $scope.websites[index];
    }

    $scope.add = function (site) {
        $http.post("/mongoapi/website", site)
        .success(function (response) {
            $scope.websites = response;
        })
    }

    $scope.addPage = function (page) {
        if (typeof $scope.selectedSite.pages == undefined)
        {
            $scope.selectedSite.pages = [];
        }
        var newPage = {
            name : page.name
        }
        $scope.selectedSite.pages.push(newPage);
        $http.put("/mongoapi/website/" +$scope.selectedSite._id, $scope.selectedSite)
        .success(function (resp) {
            $scope.websites = resp;
        })
    }

    $scope.remove = function (id) {
        $http.delete("/mongoapi/website/" + id)
        .success(function (response) {
            $scope.websites = response;
        })
    }

    $http.get("/mongoapi/website").success(function (response) {
        $scope.websites = response;
    });

});