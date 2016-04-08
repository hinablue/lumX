(function()
{
    'use strict';

    angular
        .module('lumx.time-picker')
        .service('LxTimePickerService', LxTimePickerService);

    LxTimePickerService.$inject = ['$rootScope', '$timeout', 'LxDepthService', 'LxEventSchedulerService'];

    function LxTimePickerService($rootScope, $timeout, LxDepthService, LxEventSchedulerService)
    {
        var service = this;
        var activeTimePickerId;
        var timePickerFilter;
        var idEventScheduler;
        var scopeMap = {};

        service.close = closeTimePicker;
        service.open = openTimePicker;
        service.registerScope = registerScope;

        ////////////

        function closeTimePicker(_timePickerId)
        {
            if (angular.isDefined(idEventScheduler))
            {
                LxEventSchedulerService.unregister(idEventScheduler);
                idEventScheduler = undefined;
            }

            activeTimePickerId = undefined;

            $rootScope.$broadcast('lx-time-picker__close-start', _timePickerId);

            timePickerFilter.removeClass('lx-time-picker-filter--is-shown');
            scopeMap[_timePickerId].element.removeClass('lx-time-picker--is-shown');

            $timeout(function()
            {
                angular.element('body').css(
                {
                    overflow: 'visible'
                });

                timePickerFilter.remove();

                scopeMap[_timePickerId].element
                    .hide()
                    .appendTo(scopeMap[_timePickerId].elementParent);

                scopeMap[_timePickerId].isOpen = false;
                $rootScope.$broadcast('lx-time-picker__close-end', _timePickerId);
            }, 600);
        }

        function onKeyUp(_event)
        {
            if (_event.keyCode == 27 && angular.isDefined(activeTimePickerId))
            {
                closeTimePicker(activeTimePickerId);
            }

            _event.stopPropagation();
        }

        function openTimePicker(_timePickerId)
        {
            LxDepthService.register();

            activeTimePickerId = _timePickerId;

            angular.element('body').css(
            {
                overflow: 'hidden'
            });

            timePickerFilter = angular.element('<div/>',
            {
                class: 'lx-time-picker-filter'
            });

            timePickerFilter
                .css('z-index', LxDepthService.getDepth())
                .appendTo('body');

            if (scopeMap[activeTimePickerId].autoClose)
            {
                timePickerFilter.on('click', function()
                {
                    closeTimePicker(activeTimePickerId);
                });
            }

            if (scopeMap[activeTimePickerId].escapeClose)
            {
                idEventScheduler = LxEventSchedulerService.register('keyup', onKeyUp);
            }

            scopeMap[activeTimePickerId].element
                .css('z-index', LxDepthService.getDepth() + 1)
                .appendTo('body')
                .show();

            $timeout(function()
            {
                $rootScope.$broadcast('lx-time-picker__open-start', activeTimePickerId);

                scopeMap[activeTimePickerId].isOpen = true;

                timePickerFilter.addClass('lx-time-picker-filter--is-shown');
                scopeMap[activeTimePickerId].element.addClass('lx-time-picker--is-shown');
            }, 100);

            $timeout(function()
            {
                $rootScope.$broadcast('lx-time-picker__open-end', activeTimePickerId);
            }, 700);
        }

        function registerScope(_timePickerId, _timePickerScope)
        {
            scopeMap[_timePickerId] = _timePickerScope.lxTimePicker;
        }
    }
})();