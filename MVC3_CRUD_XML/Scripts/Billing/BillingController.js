var BillingApp = angular.module('BillingApp', ['ui.bootstrap']);

BillingApp.controller('BillingCtrl', function ($scope, $http, $window, $filter) {
    //取得工作列表
    $http.get('/Billing/ListJobType').success(function (data) {
        $scope.JobTypes = data;
    });

    //初始化pager控件 & 將搜尋條件也放在此object
    $scope.pagingInfo = {
        Currentpage: 1,
        itemsPerPage: 5,
        sortBy: 'Customer',
        reverse: false,
        searchName: '',
        totalItems: 0
    };

    //將取的到Json資料和Model Mapping
    function MappingJsonToModel(JsonData) {
        var ModelList = [];
        for (var i = 0; i < JsonData.length; i++) {
            ModelList[i] = new BillingModel(JsonData[i].ID, JsonData[i].Customer, JsonData[i].JobType, JsonData[i].Date, JsonData[i].Description, JsonData[i].Hours);            
        }
        return ModelList;
    }

    //Model
    function BillingModel(ID, Customer, JobType, Date, Description, Hours) {
        this.ID = ID;
        this.Customer = Customer;
        this.JobType = JobType;
        this.Date = Date;
        this.Description = Description;
        this.Hours = Hours;
        this.JobTypeText = function () {
            return $filter("filter")($scope.JobTypes, { id: this.JobType })[0].name;
        };
    }

    //取得清單
    $scope.InitData = function () {
        $http.get('/Billing/ListBillings/', { params: $scope.pagingInfo }).success(function (data) {
            $scope.Billings = new MappingJsonToModel(data.data);
            $scope.pagingInfo.totalItems = data.count;
        });
    }

    //頁面切換
    $scope.pageChanged = function () {
        $scope.InitData();
    };

    //更換排序
    $scope.SortChanged = function (ChangeTarget) {
        $scope.pagingInfo.sortBy = ChangeTarget;
        $scope.pagingInfo.reverse = !$scope.pagingInfo.reverse;
        $scope.InitData();
    }

    //功能顯示控制
    $scope.ShowMode = 'list';

    $scope.GoSearching = function () {
        $scope.pagingInfo.Currentpage = 1;
        $scope.InitData();
    }

    //新增
    $scope.add = function () {        
        $http.post('/Billing/Add/', $scope.BillingModel).success(function (data) {
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
    $scope.showDetail = function (Billing,ShowMode) {
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