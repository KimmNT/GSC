import {StyleSheet, Dimensions} from 'react-native';

const res = Dimensions.get('window').height;
const {height, width} = Dimensions.get('window');

const primaryColor = '#4CAF50';
const boxColor = '#dedbdb';
const statBox = '#FFFFFF';
const timeIcon = '#E1B52B';
const stepIcon = '#EE6866';
const caloriesIcon = '#FC6D06';
const distanceIcon = '#3c59c2';
const disconnectBtn = '#D24545';
const clearBtn = '#FE7A36';

const groupStyle = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#rgba(0,0,0,0.5)',
  },
  group__container: {
    position: 'relative',
    backgroundColor: '#dbdbdc',
    width: '100%',
    height: '100%',
  },
  group__content: {
    marginTop: res * 0.05,
    paddingHorizontal: res * 0.03,
  },
  group__img_background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  group__title: {
    color: primaryColor,
    fontSize: res * 0.03,
    textTransform: 'uppercase',
    fontWeight: '900',
  },
  group__header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: res * 0.04,
    marginBottom: res * 0.02,
  },
  header__total: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: res * 0.01,
  },
  total__count: {
    color: '#000',
  },
  total__number: {
    color: '#000',
    fontSize: res * 0.02,
    fontWeight: '600',
  },
  header__classes: {
    backgroundColor: '#FFF',
    padding: res * 0.01,
    borderRadius: res * 0.005,
  },
  classes__name: {
    fontWeight: '600',
    color: '#000',
  },
  list__height: {
    marginBottom: res * 0.2,
  },

  //CONTROL BUTTONS
  group__btn_create: {
    position: 'absolute',
    bottom: res * 0.02,
    right: res * 0.02,
    backgroundColor: boxColor,
    width: res * 0.12,
    height: res * 0.12,
    borderRadius: (res * 0.12) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
  },
  btn__create_icon: {
    fontSize: res * 0.06,
    fontWeight: '600',
    color: '#000',
  },
  group__btn_disconnect: {
    position: 'absolute',
    bottom: res * 0.02,
    left: res * 0.02,
    backgroundColor: disconnectBtn,
    paddingHorizontal: res * 0.05,
    paddingVertical: res * 0.01,
    borderRadius: res * 0.005,
  },
  btn__disconnect_icon: {
    fontSize: res * 0.04,
    fontWeight: '600',
    color: '#FFF',
  },
  group__btn_control: {
    position: 'absolute',
    bottom: res * 0.02,
    left: res * 0.02,
    flexDirection: 'row',
    gap: res * 0.04,
    // backgroundColor: 'rgba(170, 170, 170, 0.2)',
    paddingVertical: res * 0.01,
    paddingHorizontal: res * 0.015,
    borderRadius: res * 0.005,
  },
  group__btn_get: {
    backgroundColor: primaryColor,
    paddingHorizontal: res * 0.03,
    paddingVertical: res * 0.01,
    borderRadius: res * 0.005,
  },
  btn__get_icon: {
    fontSize: res * 0.03,
    fontWeight: '600',
    color: '#FFF',
  },
  group__btn_upload: {
    backgroundColor: '#FFF',
    paddingHorizontal: res * 0.03,
    paddingVertical: res * 0.01,
    borderRadius: res * 0.005,
  },
  btn__upload_icon: {
    fontSize: res * 0.03,
    fontWeight: '600',
    color: primaryColor,
  },
  group__btn_clear: {
    backgroundColor: clearBtn,
    borderRadius: res * 0.01,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: res * 0.015,
    margin: res * 0.01,
    width: 50,
  },
  btn__clear_icon: {
    color: '#FFF',
    fontSize: res * 0.03,
  },
  //LIST
  group__boxes: {
    width: '100%',
    height: '84%',
  },
  group__item_list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: res * 0.015,
    marginBottom: res * 0.1,
    marginTop: res * 0.02,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: -3,
      height: 7,
    },
    shadowOpacity: 0.6,
    shadowRadius: 5.68,
    elevation: 12,
  },

  //STUDENTS LIST
  group__item_imagelist: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  group__item_imagelist_item: {
    width: '100%',
    height: res * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  group__item_image_layer: {
    width: res * 0.13,
    height: res * 0.13,
    borderRadius: (res * 0.13) / 2,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  group__item_image: {
    width: res * 0.12,
    height: res * 0.12,
    resizeMode: 'cover',
    borderRadius: (res * 0.12) / 2,
  },
  group__item_name: {
    backgroundColor: '#FFF',
    paddingVertical: res * 0.005,
    paddingHorizontal: res * 0.01,
    borderRadius: res * 0.005,
    marginTop: res * 0.01,
  },
  student__name: {
    fontSize: res * 0.016,
    textAlign: 'center',
    fontWeight: '600',
    color: '#000',
  },
  group__item_qrcode: {
    backgroundColor: '#000',
    padding: res * 0.007,
    borderRadius: res * 0.005,
    marginTop: res * 0.01,
  },
  qrocde_value: {
    fontSize: res * 0.02,
    textAlign: 'center',
    fontWeight: '600',
    color: '#FFF',
  },

  //DEVICES LIST
  group__item_information: {
    width: '65%',
  },
  group__item: {
    width: '100%',
    height: res * 0.3,
    paddingVertical: res * 0.02,
  },
  group__item_content: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  group__item_stat: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'stretch',
    flexWrap: 'wrap',
    paddingHorizontal: res * 0.015,
    paddingVertical: res * 0.005,
    backgroundColor: boxColor,
    borderRadius: res * 0.01,
    borderWidth: 2,
    borderColor: '#D1D1D1'
  },
  group__item_notasnumber: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  out__of_range: {
    fontSize: res * 0.06,
    color: '#000',
  },
  out__of_range_text: {
    marginTop: res * 0.02,
    fontSize: res * 0.02,
    color: '#000',
    fontWeight: '600',
  },
  stat__info: {
    width: '45%',
    alignItems: 'center',
    backgroundColor: statBox,
    marginVertical: res * 0.01,
    padding: res * 0.01,
    borderRadius: res * 0.01,
  },
  stat__header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  stat__icon: {
    fontSize: res * 0.025,
    marginRight: res * 0.01,
  },
  step: {
    color: stepIcon,
  },
  time: {
    color: timeIcon,
  },
  calories: {
    color: caloriesIcon,
  },
  distance: {
    color: distanceIcon,
  },
  stat__number_container: {
    alignItems: 'center',
  },
  stat__number: {
    fontSize: res * 0.022,
    fontWeight: '900',
    color: '#000',
    marginTop: res * 0.015,
  },
  stat__unit: {
    color: '#505050',
    fontSize: res * 0.015,
  },
  group__add_container: {
    position: 'absolute',
    bottom: res * 0.04,
    right: 0,
    paddingHorizontal: res * 0.04,
    alignItems: 'flex-end',
    zIndex: 2,
    // backgroundColor: 'tomato',
  },
  group__add_content: {
    backgroundColor: '#15212D',
    width: res * 0.09,
    height: res * 0.09,
    borderRadius: (res * 0.09) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: res * 0.01,
  },
  groupp__add_icon: {
    color: '#FFF',
    fontSize: res * 0.04,
  },
});

export default groupStyle;
