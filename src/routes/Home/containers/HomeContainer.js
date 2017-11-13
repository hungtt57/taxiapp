import {connect} from "react-redux";
import Home from "../component/Home";
import {setName} from '../modules/home';

const mapStateToProps = (state) => ({
    name : state.home.name
});
const mapActionCreators = {
    setName
};
export default connect(mapStateToProps,mapActionCreators)(Home);