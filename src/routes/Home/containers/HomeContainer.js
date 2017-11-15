import {connect} from "react-redux";
import Home from "../component/Home";
import {getCurrentLocation} from '../modules/home';

const mapStateToProps = (state) => ({
    region : state.home.region
});
const mapActionCreators = {
    getCurrentLocation
};
export default connect(mapStateToProps,mapActionCreators)(Home);