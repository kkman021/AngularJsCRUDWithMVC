var BillingApp = angular.module('BillingApp', ['ui.bootstrap']);

BillingApp.controller('BillingCtrl', function ($scope, $http, $window) {

    $scope.pagingInfo = {
        Currentpage: 1,
        itemsPerPage: 2,
        sortBy: 'Customer',
        reverse: false,
        searchName: '',
        totalItems: 0
    };

    $scope.pageChanged = function () {
        $scope.InitData();
    };

    //功能顯示控制
    $scope.ShowMode = 'list';

    //取得工作列表
    $http.get('/Billing/ListJobType').success(function (data) {
        $scope.JobTypes = data;
    });

    //取得資料
    $scope.InitData = function () {        
        $http.get('/Billing/ListBillings/', { params: $scope.pagingInfo }).success(function (data) {
            $scope.Billings = data.data;
            $scope.pagingInfo.totalItems = data.count;
        });
    }

    $scope.searchMode = function () {
        $scope.pagingInfo.Currentpage = 1;
        $scope.InitData();
    }

    //新增
    $scope.add = function () {
        var billing = { "Customer": $scope.ICustomer, "JobType": $scope.IJobType.id, "Date": $scope.IDate, "Description": $scope.IDescription, "Hours": $scope.IHours };
        $http.post('/Billing/Add/', billing).success(function (data) {
            if (data == "OK") {
                $window.location.href = "/";
            }
        });
    };

    //修改
    $scope.edit = function (BillingDetail) {
        $http.post('/Billing/EditMode/', BillingDetail).success(function (data) {
            if (data == "OK") {
                $scope.ShowMode = 'list';
            }
        });
    };

    //刪除
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

    //顯示明細
    $scope.showDetail = function (Billing, ShowMode) {
        $scope.BillingDetail = Billing;
        $scope.ShowMode = ShowMode;
    }

    $scope.showList = function () {
        $scope.ShowMode = 'list';
    };



    //日期設定
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    $scope.format = "yyyy-MM-dd";

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };
});