var BillingApp = angular.module('BillingApp', []);

BillingApp.controller('BillingCtrl', function ($scope, $http, $window) {

    $scope.IsShowEditPanel = true;

    $http.get('/Billing/ListJobType').success(function (data) {
        $scope.JobTypes = data;
    });

    $http.get('/Billing/ListBillings/').success(function (data) {
        $scope.Billings = data;
    });

    $scope.add = function () {
        var billing = { "Customer": $scope.ICustomer, "JobType": $scope.IJobType, "Date": $scope.IDate, "Description": $scope.IDescription, "Hours": $scope.IHours };
        $http.post('/Billing/Add/', billing).success(function (data) {
            if (data == "OK") {
                $window.location.href = "/";
            }
        });
    };

    $scope.update = function () {
        alert('OK');
    };

    $scope.remove = function (index) {
        $scope.friends.splice(index, 1);
    };
});

