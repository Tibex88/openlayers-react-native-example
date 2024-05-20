import { Asset ,useAssets } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

import React, { useEffect, useRef, useState } from 'react';
import { Text, useWindowDimensions } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

// type Props = {
//     onInitialized: (zoomToGeoJSONFunc: () => void) => void;
//     onMapPress: (coordinates: [number, number]) => void;
// };

const Map = (props) => {
    const { onInitialized, onMapPress } = props;

    // const [assets] = useAssets([require('./index.html')],[]);
    const [htmlString, setHtmlString] = useState('');

    const dimensions = useWindowDimensions();

    const webViewRef = useRef();

    const zoomToGeoJSON = () => {
        webViewRef.current?.injectJavaScript('window.zoomToGeoJSON(); true');
    };

    // useEffect(() => {
    //     if (assets) {
    //          fetch(assets[0].localUri || '')
    //             .then((res) => res.text())
    //             .then((html) => {
    //                 setHtmlString(html);
    //                 onInitialized(zoomToGeoJSON);
    //             });
    //             console.log('yes assets', assets)
    //     }
    //     else{
    //         console.log('no assets', assets)
    //     }
    // }, [assets]);

    useEffect(()=> {
        async function loadHtml() {
        const htmlAsset = Asset.fromModule([require('./index.html')]);
        console.log(htmlAsset.copyAsync(), 'html asset')
        // await htmlAsset.downloadAsync(); 
        console.log(htmlAsset.fileUri(), 'file uri')
        const htmlPath = htmlAsset.localUri;
        // const htmlPath = htmlAsset.uri;
        console.log(htmlPath)
        const htmlFile = await FileSystem.readAsStringAsync(htmlPath);
        console.log(htmlFile)
        setHtmlString(htmlFile);
        }

        loadHtml()
    },[])

    const messageHandler = (e) => {
        const coords = JSON.parse(e.nativeEvent.data) ;
        onMapPress(coords);
    };

    if (!htmlString) {
        return <Text>No html string</Text>;
    }

    return (
        <WebView
            ref={(r) => (webViewRef.current = r)}
            injectedJavaScript=''
            source={{
                html: htmlString,
            }}
            javaScriptEnabled
            style={{
                width: dimensions.width,
                height: dimensions.height,
            }}
            scrollEnabled={false}
            overScrollMode='never'
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            scalesPageToFit={false}
            containerStyle={{ flex: 1 }}
            onMessage={messageHandler}
        />
    );
};

export default Map;
