/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Dan "Ducky" Little
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/** Collection of functions for defining a Bing layers in a GeoMoose map.
 * 
 */

/** Create the parameters for a Bing Services layer.
 *
 */
function defineSource(mapSource) {
    // there are two different layers in Bing maps,
    //  roads and aerials.  This applies the logic to map
    //  them.
    let aerials_on = false, roads_on = false;
    for(let layer of mapSource.layers) {
        if(layer.on === true) {
            if(layer.name === 'aerials') {
                aerials_on = true;
            } else if(layer.name === 'roads') {
                roads_on = true;
            }
        }
    }

    let image_style = 'Road';
    if(aerials_on && roads_on) {
        image_style = 'AerialWithLabels';
    } else if(aerials_on) {
        image_style = 'Aerial';
    }

    return {
        key: mapSource.params.key,
        imagerySet: image_style
    }
}

/** Return an OpenLayers Layer for the Bing Services source.
 *
 *  @param mapSource The MapSource definition from the store.
 *
 *  @returns OpenLayers Layer instance.
 */
export function createLayer(mapSource) {
    return new ol.layer.Tile({
        source: new ol.source.BingMaps(defineSource(mapSource))
    });
}

/** Ensure that the Bing Services parameters all match.
 */
export function updateLayer(map, layer, mapSource) {
    // pull in the open layers source
    let src = layer.getSource();
    // get the new definition
    let defn = defineSource(mapSource);

    if(defn.imagerySet !== src.getImagerySet()) {
        layer.setSource(new ol.source.BingMaps(defn));
    }
}
