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

    $scope.edit = function (BillingDetail) {
        $http.post('/Billing/EditMode/', BillingDetail).success(function (data) {
            if (data == "OK") {
                $scope.ShowMode = 'list';
            }
        });
    };

    $scope.GoDel = function (ID) {
        var retVal = confirm("確定刪除？");
        if (retVal == true) {
            var PostData = { "ID": ID };
            $http.post('/Billing/DeleteMode/', PostData).success(function (data) {
                if (data == "OK") {
                    $scope.InitData();
                }
            }).error(function (data, status, headers, config) {
                alert("Error");
            });
            return true;
        } else {
            return false;
        }
    }

    $scope.showDetail = function (Billing, ShowMode) {
        $scope.BillingDetail = Billing;
        $scope.ShowMode = ShowMode;
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