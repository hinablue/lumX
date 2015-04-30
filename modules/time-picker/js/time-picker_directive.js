/* global angular */
/* global moment */
'use strict'; // jshint ignore:line


angular.module('lumx.time-picker', [])
    .controller('lxTimePickerController', ['$scope', '$timeout', '$window', function($scope, $timeout, $window)
    {
        var self = this,
            activeLocale,
            $timePicker,
            $timePickerFilter,
            $timePickerContainer;

        this.init = function(element, locale)
        {
            $timePicker = element.find('.lx-time-picker');
            $timePickerContainer = element;
            self.build(locale, false);
        };

        this.build = function(locale, isNewModel)
        {
            if (locale === activeLocale && !isNewModel)
            {
                return;
            }

            activeLocale = locale;

            moment.locale(activeLocale);

            if (angular.isDefined($scope.model))
            {
                $scope.selected = {
                    model: moment(moment().format('YYYY/MM/DD')+' '+$scope.model).format('HH:mm'),
                    time: moment(moment().format('YYYY/MM/DD')+' '+$scope.model)
                };

                $scope.activeTime = moment(moment().format('YYYY/MM/DD')+' '+$scope.model);
            }
            else
            {
                $scope.selected = {
                    model: undefined,
                    time: new Date()
                };

                $scope.activeTime = moment();
            }

            $scope.moment = moment;
        };

        $scope.previousHour = function()
        {
            $scope.activeTime = $scope.activeTime.add(-1, 'hour');
            generateTimetable();
        };

        $scope.nextHour = function()
        {
            $scope.activeTime = $scope.activeTime.add(1, 'hour');
            generateTimetable();
        };

        $scope.previousMinute = function()
        {
            $scope.activeTime = $scope.activeTime.add(-1, 'minute');
            generateTimetable();
        };

        $scope.nextMinute = function()
        {
            $scope.activeTime = $scope.activeTime.add(1, 'minute');
            generateTimetable();
        };

        $scope.openPicker = function()
        {
            $timePickerFilter = angular.element('<div/>', {
                class: 'lx-time-filter'
            });

            $timeFilter
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
                $timePickerFilter.addClass('lx-time-filter--is-shown');
                $timePicker.addClass('lx-time-picker--is-shown');
            }, 100);
        };

        $scope.closePicker = function()
        {
            $timePickerFilter.removeClass('lx-time-filter--is-shown');
            $timePicker.removeClass('lx-time-picker--is-shown');

            // $scope.model = $scope.displayTime.hour+':'+$scope.displayTime.minute;

            $timeout(function()
            {
                $dateFilter.remove();

                $timePicker
                    .hide()
                    .appendTo($element);
            }, 600);
        };

        function generateTimetable() {
            $scope.selected.time = $scope.activeTime;
            $scope.selected.model = $scope.activeTime.format('HH:mm');
        }
    }])
    .directive('lxTimePicker', function()
    {
        return {
            restrict: 'AE',
            controller: 'lxTimePickerController',
            scope: {
                model: '=',
                label: '@',
                fixedLabel: '&',
                icon: '@'
            },
            templateUrl: 'time_picker.html',
            link: function(scope, element, attrs, ctrl)
            {
                ctrl.init(element, checkLocale(attrs.locale));

                attrs.$observe('locale', function()
                {
                    ctrl.build(checkLocale(attrs.locale), false);
                });

                scope.$watch('model', function (newVal)
                {
                    ctrl.build(checkLocale(attrs.locale), true);
                });

                function checkLocale(locale)
                {
                    if (!locale)
                    {
                        return (navigator.language !== null ? navigator.language : navigator.browserLanguage).split("_")[0].split("-")[0] || 'en';
                    }

                    return locale;
                }
            }
        };
    });
