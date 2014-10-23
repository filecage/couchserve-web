var couch = new CouchSocketService('localhost', 8000);
var $sensorBox = $('#sensors');
var $moduleBox = $('#modules');

var modules = {};
var sensors = {};
var groups = {};

couch
    .on('SYNC', function(data) {
        if (!data.groups) {
            return;
        }

        data.groups.forEach(function(group, index){

            group.sensors.forEach(function(sensor, index){
                $sensorBox.append('<li id="sensor_' + sensor.id + '"><strong>' + group.name + ' -> ' + sensor.name + '</strong> <span class="value">' + sensor.value + '</span>');
            });

            group.modules.forEach(function(module, index){
                modules[module.id] = module;
                var $module = $('<li id="module_' + module.id + '"><strong>' + group.name + ' -> ' + module.name + '</strong> <span class="value">' + module.options.value + '</span>');
                var $controllable = $('<div class="controllable"></div>');

                switch (module.options.controlType) {
                    case 'CONTROL_TYPE_TOGGLE':
                        $('<button class="less">-</button>').data('target-value', module.options.value - 25).appendTo($controllable);
                        $('<button class="toggle">Toggle</button>').data('target-value', module.options.previousValue).appendTo($controllable);
                        $('<button class="more">+</button>').data('target-value', module.options.value + 25).appendTo($controllable);


                        $('button', $controllable)
                            .click(function(e){
                                var value = $(this).data('target-value');
                                if (value != module.options.value) {
                                    couch.send({action: 'MODULE_COMMAND', id: module.id, data: [value]});
                                }
                            });
                        break;

                    default:
                        console.warn('unable to handle module control type "' + module.options.controlType + '"');
                }

                $module.append($controllable).appendTo($moduleBox);
            });

        });
    })
    .on('UPDATE', function(update){
        //console.log(update);
        switch (update.component) {
            case 'SENSOR':
                $targetItem = $('#sensor_' + update.target);
                $targetItem.find('.value').html(update.data.value);
                break;

            case 'MODULE':
                var module = modules[update.target];
                module.options = update.options;

                $targetItem = $('#module_' + module.id);
                $targetItem.find('.value').html(module.options.value);
                $targetItem.find('.less').data('target-value', module.options.value - 25);
                $targetItem.find('.toggle').data('target-value', module.options.nextValue);
                $targetItem.find('.more').data('target-value', module.options.value + 25);
                break;


            default:
                console.warn('unable to handle update component "' + update.component + '"');
                break;
        }
        var $targetItem;
    });