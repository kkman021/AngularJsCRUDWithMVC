BillingApp.directive('serverValidate', [
    function () {
        return {
            link: function (scope, element, attr) {
                var form = element.inheritedData('$formController');
                // form不存在直接退出
                if (!form) return;
                // validation model
                var validate = attr.serverValidate;
                // watch validate changes to display validation
                scope.$watch(validate, function (errors) {

                    // every server validation should reset others
                    // note that this is form level and NOT field level validation
                    form.$serverError = {};

                    // if errors is undefined or null just set invalid to false and return
                    if (!errors) {
                        form.$serverInvalid = false;
                        return;
                    }
                    // set $serverInvalid to true|false
                    form.$serverInvalid = (errors.length > 0);

                    // loop through errors
                    angular.forEach(errors, function (error, i) {
                        form.$serverError[error.key] = { $invalid: true, message: error.value };
                    });
                });
            }
        };
    }
]);