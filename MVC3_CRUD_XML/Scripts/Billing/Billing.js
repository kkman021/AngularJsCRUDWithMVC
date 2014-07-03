var BillingApp = angular.module('BillingApp', []);

BillingApp.controller('BillingCtrl', function ($scope, $http, $window) {

    $scope.ShowMode = 'list';

    $http.get('/Billing/ListJobType').success(function (data) {
        $scope.JobTypes = data;
    });

    $scope.InitData = function () {
        $http.get('/Billing/ListBillings/').success(function (data) {
            $scope.Billings = data;
        });
    }

    $scope.add = function () {
        var billing = { "Customer": $scope.ICustomer, "JobType": $scope.IJobType.id, "Date": $scope.IDate, "Description": $scope.IDescription, "Hours": $scope.IHours };
        $http.post('/Billing/Add/', billing).success(function (data) {
            if (data == "OK") {
                $window.location.href = "/";
            }
        });
    };

    $scope.showDetail = function (Billing) {
        $scope.BillingDetail = Billing;
        $scope.ShowMode = 'details';
    }

    $scope.showList = function () {
        $scope.ShowMode = 'list';
    };

    $scope.update = function () {
        alert('OK');
    };

    $scope.remove = function (index) {
        $scope.friends.splice(index, 1);
    };
});

