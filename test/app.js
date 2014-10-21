var couch = new CouchSocketService('localhost', 8000);
var $sensorBox = $('#sensors');
var $moduleBox = $('#modules');

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
                $moduleBox.append('<li id="module_' + sensor.id + '"><strong>' + group.name + ' -> ' + module.name + '</strong> <span class="value">' + module.options.value + '</span>');
            });

        });
    })
    .on('UPDATE', function(data){
        switch (data.component) {
            case 'SENSOR':
                var $targetItem = $('#sensor_' + data.target);
                $targetItem.find('.value').html(data.data.value);
                break;

            default:
                console.warn('unable to handle update component "' + data.component + '"');
                break;
        }
    });