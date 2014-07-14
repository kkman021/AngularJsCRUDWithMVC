var BillingApp = angular.module('BillingApp', ['ui.bootstrap']);

BillingApp.factory('BillingRepository', function ($http) {
    return {
        lookupBilling: function (callback, oPageInfo) {
            $http.get('/Billing/ListBillings/', { params: oPageInfo }).success(callback);
        },
        insertBilling: function (callback, oBillingModel) {
            $http.post('/Billing/Add/', oBillingModel).success(callback);
        },
        updateBilling: function (callback, oBillingModel) {
            $http.post('/Billing/EditMode/', oBillingModel).success(callback);
        },
        deleteBilling: function (callback, oPostData) {
            $http.post('/Billing/DeleteMode/', oPostData).success(callback);
        },
        lookupJobList: function (callback) {
            $http.get('/Billing/ListJobType').success(callback);
        }
    }
});

BillingApp.controller('BillingCtrl', function ($scope, $http, $window, $filter, BillingRepository) {
    //取得工作列表
    BillingRepository.lookupJobList(function (results) {
        $scope.JobTypes = results;
    });
    //    $http.get('/Billing/ListJobType').success(function (data) {
    //        $scope.JobTypes = data;
    //    });

    //初始化pager控件 & 將搜尋條件也放在此object
    $scope.pagingInfo = {
        Currentpage: 1,
        itemsPerPage: 5,
        sortBy: 'id',
        reverse: true,
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
        BillingRepository.lookupBilling(function (results) {
            $scope.Billings = new MappingJsonToModel(results.data);
            $scope.pagingInfo.totalItems = results.count;
        }, $scope.pagingInfo);

        //        $http.get('/Billing/ListBillings/', { params: $scope.pagingInfo }).success(function (data) {
        //            $scope.Billings = new MappingJsonToModel(data.data);
        //            $scope.pagingInfo.totalItems = data.count;
        //        });
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
        BillingRepository.insertBilling(function (results) {
            if (results == "OK") {
                alert("建檔成功！");
                $window.location.href = "/";
            }
        }, $scope.BillingModel);

        //        $http.post('/Billing/Add/', $scope.BillingModel).success(function (data) {
        //            if (data == "OK") {
        //                $window.location.href = "/";
        //            }
        //        });
    };

    //修改
    $scope.edit = function (BillingDetail) {
        BillingRepository.updateBilling(function (results) {
            if (results == "OK") {
                alert("修改成功！");
                $window.location.href = "/";
            }
        }, BillingDetail);

        //        $http.post('/Billing/EditMode/', BillingDetail).success(function (data) {
        //            if (data == "OK") {
        //                $scope.ShowMode = 'list';
        //            }
        //        });
    };

    //刪除
    $scope.GoDel = function (ID) {
        var retVal = confirm("確定刪除？");
        if (retVal == true) {
            BillingRepository.deleteBilling(function (results) {
                if (results == "OK") {
                    alert("刪除成功！");
                    $window.location.href = "/";
                }
            }, { "ID": ID });
            //            $http.post('/Billing/DeleteMode/', PostData).success(function (data) {
            //                if (data == "OK") {
            //                    $scope.InitData();
            //                }
            //            })
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