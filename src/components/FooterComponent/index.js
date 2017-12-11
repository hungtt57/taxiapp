import React from 'react';
import {Text} from 'react-native';
import {FooterTab,Footer,Left,Body,Right,Button} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './FooterComponentStyles';




export const FooterComponent = ({logo}) => {

    //tab bar items
    const tabs = [{
        title:"TaxiCar",
        subTitle : "",
        icon : "car"
    },
        {
            title:"TaxiBike",
            subTitle : "",
            icon : "car"
        },
        {
            title:"TaxiShare",
            subTitle : "",
            icon : "car"
        },  {
            title:"Premium",
            subTitle : "",
            icon : "car"
        },


    ];
    return (
        <Footer>
        <FooterTab style={styles.footerContainer}
                   iosBarStyle="light-content"
        >
            {
                tabs.map((obj,index) => {
                    return (
                        <Button key={index}>
                            <Icon size={20} name={obj.icon}  color={(index===0) ? "#FF5E3A"  : "#eee"}/>
                            <Text style={{fontSize:12,color:(index===0) ? "#FF5E3A"  : "#eee"}}>{obj.title} </Text>
                            <Text style={styles.subText}>{obj.subTitle} </Text>
                        </Button>
                    )
                })
            }

        </FooterTab>
        </Footer>
    );
};
export default FooterComponent;