function drawMap(data){
    locationEvents = data;

    var stormEvents = {type:'FeatureCollection',features:[]};
    var filteredEvents = {type:'FeatureCollection',features:[]};
    stormEvents.features = locationEvents.map(function(stormevent){
        return {
            type:"Feature",
            properties:stormevent,
            geometry:{
              type:"Point",
              coordinates:[+stormevent.BEGIN_LON,+stormevent.BEGIN_LAT]
            }
        }
    });


    var event_types = [];
    stormEvents.features.forEach(function(se){
        //console.log(se.properties.EVENT_TYPE);
        if(event_types.indexOf(se.properties.EVENT_TYPE) < 0 ){
            event_types.push(se.properties.EVENT_TYPE);
        }
    });

    console.log(event_types);

    var property_damages = [];
    stormEvents.features.forEach(function(se){
        if(property_damages.indexOf(se.properties.DAMAGE_PROPERTY_NUM) < 0 ){
            property_damages.push(+se.properties.DAMAGE_PROPERTY_NUM);
        }
    });

    
    var event_select = d3.select('#select_event')

    
       
    $('#select_event').on('change',function(d,e){
        
        var type = $(this).val();

        console.log(type);

        if(type === 'All'){
        
            stormLayer.externalUpdate( stormEvents );
        
        }else{
            
            filteredEvents.features = stormEvents.features.filter(function(feat){
                return feat.properties.EVENT_TYPE == type;
            });
            console.log('test',type,filteredEvents.features.length)
            stormLayer.externalUpdate( filteredEvents );
        }
        

    })
    

    var damageScale = d3.scale.sqrt()
        .domain([0,10000000])
        .range([2,30]);
    
    var radiusScale = function(d){

        //console.log(damageScale(d.properties.DAMAGE_PROPERTY_NUM))

        return damageScale(d.properties.DAMAGE_PROPERTY_NUM)
    }
    // options
    //     .enter()
    //     .append('option')
    //     .attr('test',function(d){return d;}) 
                   

    var options = {
        layerId:'storms',
        classed:'storm_event',
        type:'point',
        attr_functions:{
            'r': radiusScale
        },
        event_functions:{
            mouseover:function(d){
                var content = '<h4>'+d.properties.EVENT_TYPE+'</h4>';
                content += '<table class="table">';
                content += '<tr><td>Property Damage</td><td>'+d.properties.DAMAGE_PROPERTY_NUM+'</td></tr>';
                content += '<tr><td>Crops Damage</td><td>'+d.properties.DAMAGE_CROPS_NUM+'</td></tr>';
                content += '<tr><td>CZ Name</td><td>'+d.properties.CZ_NAME_STR+'</td></tr>';
                content += '<tr><td>Begin Date</td><td>'+d.properties.BEGIN_DATE+'</td></tr>';
                content += '<tr><td>Event ID</td><td>'+d.properties.EVENT_ID+'</td></tr>';
                content += '</table>';


                d3.select("#tooltip")
                    .style("visibility", "visible")
                    .style("top", function () { return (d3.event.pageY - 130)+"px"})
                    .style("left", function () { return (d3.event.pageX - 230)+"px";})
                    .html(content)

            },
            mouseout:function(d){
                    d3.select("#tooltip")
                    .style("visibility", "hidden")
            }   
        }

    };

    var stormLayer = new L.GeoJSON.d3(stormEvents,options)
    map.addLayer(stormLayer);
}