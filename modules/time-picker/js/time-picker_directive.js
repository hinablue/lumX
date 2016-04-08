(function()
{
    'use strict';

    angular
        .module('lumx.time-picker')
        .directive('lxTimePicker', lxTimePicker);

    lxTimePicker.$inject = ['LxTimePickerService', 'LxUtils'];

    function lxTimePicker(LxTimePickerService, LxUtils)
    {
        return {
            restrict: 'AE',
            templateUrl: 'time-picker.html',
            scope:
            {
                autoClose: '=?lxAutoClose',
                callback: '&?lxCallback',
                color: '@?lxColor',
                escapeClose: '=?lxEscapeClose',
                ngModel: '=',
                locale: '@lxLocale'
            },
            link: link,
            controller: LxTimePickerController,
            controllerAs: 'lxTimePicker',
            bindToController: true,
            replace: true,
            transclude: true
        };

        function link(scope, element, attrs)
        {
            if (angular.isDefined(attrs.id))
            {
                attrs.$observe('id', function(_newId)
                {
                    scope.lxTimePicker.pickerId = _newId;
                    LxTimePickerService.registerScope(scope.lxTimePicker.pickerId, scope);
                });
            }
            else
            {
                scope.lxTimePicker.pickerId = LxUtils.generateUUID();
                LxTimePickerService.registerScope(scope.lxTimePicker.pickerId, scope);
            }
        }
    }

    LxTimePickerController.$inject = ['$element', '$scope', '$timeout', '$transclude', 'LxTimePickerService'];

    function LxTimePickerController($element, $scope, $timeout, $transclude, LxTimePickerService)
    {
        var lxTimePicker = this;
        var input;
        var modelController;
        var timer1;

        lxTimePicker.closeTimePicker = closeTimePicker;
        lxTimePicker.openTimePicker = openTimePicker;
        lxTimePicker.previousHour = previousHour;
        lxTimePicker.previousMinute = previousMinute;
        lxTimePicker.nextHour = nextHour;
        lxTimePicker.nextMinute = nextMinute;

        lxTimePicker.autoClose = angular.isDefined(lxTimePicker.autoClose) ? lxTimePicker.autoClose : true;
        lxTimePicker.color = angular.isDefined(lxTimePicker.color) ? lxTimePicker.color : 'primary';
        lxTimePicker.element = $element.find('.lx-time-picker');
        lxTimePicker.escapeClose = angular.isDefined(lxTimePicker.escapeClose) ? lxTimePicker.escapeClose : true;
        lxTimePicker.isOpen = false;
        lxTimePicker.moment = moment;

        $transclude(function(clone)
        {
            if (clone.length)
            {
                lxTimePicker.hasInput = true;

                timer1 = $timeout(function()
                {
                    input = $element.find('.lx-time-input input');
                    modelController = input.data('$ngModelController');
                });
            }
        });

        $scope.$on('$destroy', function()
        {
            $timeout.cancel(timer1);
        });

        $scope.$watch('lxTimePicker.display', function(newTime, oldTime) {
            if (false === angular.equals(newTime, oldTime)) {
                if (newTime.hours < 0 || newTime.hours > 23 || newTime.minutes < 0 || newTime.minutes > 59) {
                } else {
                    lxTimePicker.ngModelClone.hour(newTime.hours);
                    lxTimePicker.ngModelClone.minute(newTime.minutes);

                    lxTimePicker.ngModel = lxTimePicker.ngModelClone.toDate();
                    lxTimePicker.ngModelMoment = lxTimePicker.ngModelClone.clone();

                    if (angular.isDefined(lxTimePicker.callback))
                    {
                        lxTimePicker.callback(
                        {
                            newTime: lxTimePicker.ngModel
                        });
                    }

                    if (angular.isDefined(modelController))
                    {
                        modelController.$setViewValue(lxTimePicker.ngModelMoment.clone().format('HH:mm'));
                        modelController.$render();
                    }
                }
            }
        }, true);

        init();

        function closeTimePicker()
        {
            LxTimePickerService.close(lxTimePicker.pickerId);
        }

        function openTimePicker()
        {
            LxTimePickerService.open(lxTimePicker.pickerId);
        }
        function init()
        {
            moment.locale(lxTimePicker.locale);

            lxTimePicker.ngModelMoment = angular.isDefined(lxTimePicker.ngModel) ? moment(angular.copy(lxTimePicker.ngModel)) : moment();
            lxTimePicker.ngModelClone = lxTimePicker.ngModelMoment.clone();
            lxTimePicker.display = {
                hours: lxTimePicker.ngModelClone.format('HH'),
                minutes: lxTimePicker.ngModelClone.format('mm')
            };
        }
        function previousHour() {
            lxTimePicker.ngModelClone.add(-1, 'hour');
            lxTimePicker.display.hours = lxTimePicker.ngModelClone.format('HH');
        }
        function nextHour() {
            lxTimePicker.ngModelClone.add(1, 'hour');
            lxTimePicker.display.hours = lxTimePicker.ngModelClone.format('HH');
        }
        function previousMinute() {
            lxTimePicker.ngModelClone.add(-1, 'minute');
            lxTimePicker.display.minutes = lxTimePicker.ngModelClone.format('mm');
        }
        function nextMinute() {
            lxTimePicker.ngModelClone.add(1, 'minute');
            lxTimePicker.display.minutes = lxTimePicker.ngModelClone.format('mm');
        }
    }
})();