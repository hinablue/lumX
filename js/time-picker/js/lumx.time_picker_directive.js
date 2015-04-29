/* global angular */
/* global moment */
'use strict'; // jshint ignore:line


angular.module('lumx.time-picker', [])
    .controller('lxTimePickerController', ['$scope', '$timeout', '$window', function($scope, $timeout, $window)
    {
        var locale = $window.navigator.language !== null ? $window.navigator.language : $window.navigator.browserLanguage,
            $element,
            $dateFilter,
            $timePicker;

        this.init = function(element)
        {
            $scope.selectedTime = {
                hour: undefined,
                minute: undefined,
                formatted: undefined
            };

            $element = element;
            $timePicker = element.find('.lx-time-picker');

            $scope.currentDate = moment(new Date());
            $scope.localeData = moment().locale(locale).localeData();
            $scope.now = moment().locale(locale);

            $scope.hour = $scope.now.hour();
            $scope.minute = $scope.now.minute();
            $scope.displayTime = {
                hour: $scope.hour < 10 ? '0' + $scope.hour : $scope.hour,
                minute: $scope.minute < 10 ? '0' + $scope.minute : $scope.minute
            };
        };

        this.updateModel = function(val)
        {
            if (angular.isDefined(val) && true === /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(val)) {
                var time = val.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/),
                    hour = parseInt(time[1], 10), minute = parseInt(time[2], 10);

                $scope.selectedTime = {
                    hour: hour,
                    minute: minute,
                    formatted: (hour < 10 ? '0' + hour : hour)+':'+(minute < 10 ? '0' + minute : minute)
                };

                $scope.hour = hour;
                $scope.minute = minute;
                $scope.displayTime = {
                    hour: $scope.hour < 10 ? '0' + $scope.hour : $scope.hour,
                    minute: $scope.minute < 10 ? '0' + $scope.minute : $scope.minute
                };
            }
            else
            {
                $scope.selectedTime = {
                    hour: undefined,
                    minute: undefined,
                    formatted: undefined
                };
            }
        };

        $scope.previousHour = function()
        {
            if (($scope.hour - 1) <= -1) {
                $scope.hour = 23;
            } else {
                $scope.hour--;
            }

            $scope.displayTime.hour = $scope.hour < 10 ? '0' + $scope.hour : $scope.hour;

            updateModel();
        };

        $scope.nextHour = function()
        {
            if (($scope.hour + 1) > 23) {
                $scope.hour = 0;
            } else {
                $scope.hour++;
            }

            $scope.displayTime.hour = $scope.hour < 10 ? '0' + $scope.hour : $scope.hour;

            updateModel();
        };

        $scope.previousMinute = function()
        {
            if (($scope.minute - 1) <= -1) {
                $scope.minute = 59;
                $scope.previousHour();
            } else {
                $scope.minute--;
            }

            $scope.displayTime.minute = $scope.minute < 10 ? '0' + $scope.minute : $scope.minute;

            updateModel();
        };

        $scope.nextMinute = function()
        {
            if (($scope.minute + 1) > 59) {
                $scope.minute = 0;
                $scope.nextHour();
            } else {
                $scope.minute++;
            }

            $scope.displayTime.minute = $scope.minute < 10 ? '0' + $scope.minute : $scope.minute;

            updateModel();
        };

        $scope.openPicker = function()
        {
            $dateFilter = angular.element('<div/>', {
                class: 'lx-time-filter'
            });

            $dateFilter
                .appendTo('body')
                .bind('click', function()
                {
                    $scope.closePicker();
                });

            $timePicker
                .appendTo('body')
                .show();

            $timeout(function()
            {
                $dateFilter.addClass('lx-time-filter--is-shown');
                $timePicker.addClass('lx-time-picker--is-shown');
            }, 100);
        };

        $scope.closePicker = function()
        {
            $dateFilter.removeClass('lx-time-filter--is-shown');
            $timePicker.removeClass('lx-time-picker--is-shown');

            $timeout(function()
            {
                $dateFilter.remove();

                $timePicker
                    .hide()
                    .appendTo($element);
            }, 600);
        };

        function updateModel() {
            $scope.model = $scope.displayTime.hour+':'+$scope.displayTime.minute;
        };
    }])
    .directive('lxTimePicker', ['$log', function($log)
    {
        return {
            restrict: 'AE',
            controller: 'lxTimePickerController',
            scope: {
                model: '=',
                label: '@'
            },
            templateUrl: 'lumx.time_picker.html',
            link: function(scope, element, attrs, ctrl)
            {
                ctrl.init(element);
                scope.$watch('model', function (newVal)
                {
                    ctrl.updateModel(newVal);
                });
            }
        };
    }]);