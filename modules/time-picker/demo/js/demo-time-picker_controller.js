(function()
{
    'use strict';

    angular
        .module('Controllers')
        .controller('DemoTimePickerController', DemoTimePickerController);

    DemoTimePickerController.$inject = ['LxTimePickerService'];

    function DemoTimePickerController(LxTimePickerService)
    {
        var vm = this;

        vm.timePickerCallback = timePickerCallback;
        vm.openTimePicker = openTimePicker;

        vm.locale = 'en';
        vm.timePicker = {
            basic:
            {
                date: new Date(),
                dateFormatted: moment().locale(vm.locale).format('HH:mm')
            },
            input:
            {
                date: new Date(),
                dateFormatted: moment().locale(vm.locale).format('HH:mm')
            }
        };
        vm.timePickerId = 'time-picker';

        ////////////

        function timePickerCallback(_newtime)
        {
            vm.timePicker.basic.date = _newtime;
            vm.timePicker.basic.dateFormatted = moment(_newtime).locale(vm.locale).format('HH:mm');
        }

        function openTimePicker(_pickerId)
        {
            LxTimePickerService.open(_pickerId);
        }
    }
})();