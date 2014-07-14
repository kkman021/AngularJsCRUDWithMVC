BillingApp.factory('BillingRepository', function ($http, $filter) {
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