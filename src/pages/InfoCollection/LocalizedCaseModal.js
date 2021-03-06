/**
 * @author:stanny
 * date:2018-11-02
 * @description: modify user password and authority
 */
import React from 'react';
import { 
  Modal,
  Form,
  Breadcrumb,
  Input,
  InputNumber,
  Button,
  Upload,
  Icon,
  message,
  DatePicker,
  Select,
  Cascader
} from 'antd';
import { connect } from 'dva';
import styles from './LocalizedCaseModal.less';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;

const options = [
  {
    value: '黑龙江省公安厅',
    label: '黑龙江省公安厅',
    children: [
      {
        value: '哈尔滨市公安局',
        label: '哈尔滨市公安局',
        children: [
          {
            value: '南岗分局',
            label: '南岗分局',
          },
          {
            value: '道里分局',
            label: '道里分局',
          },
          {
            value: '道外分局',
            label: '道外分局',
          },
          {
            value: '香坊分局',
            label: '香坊分局',
          },
        ],
      },
      {
        value: '大庆市公安局',
        label: '大庆市公安局',
        children: [
          {
            value: '萨尔图区',
            label: '萨尔图区',
          },
          {
            value: '龙凤区',
            label: '龙凤区',
          },
          {
            value: '让胡路区',
            label: '让胡路区',
          },
          {
            value: '红岗区',
            label: '红岗区',
          },
        ],
      },
    ],
  },
];

function getFormatTime(time) {
  var date = new Date(time.format());
  var currentTime =
    date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) + '-' + date.getDate();
  var hour = date.getHours().toString().length > 1 ? date.getHours() : '0' + date.getHours();
  var minutes =
    date.getMinutes().toString().length > 1 ? date.getMinutes() : '0' + date.getMinutes();
  var seconds =
    date.getSeconds().toString().length > 1 ? date.getSeconds() : '0' + date.getSeconds();
  currentTime += ' ' + hour + ':' + minutes + ':' + seconds;
  return currentTime;
}

class LocalizedCaseModal extends React.Component {
  state = { visible: false };

  handleClick = () => {
    // this.showModal();
    const {
      form: { setFieldsValue },
      text,
      data,
    } = this.props;

    if (text === '查看并编辑') {
      const arr = data.institution.split(' / ');
      setFieldsValue({
        caseid: data.caseid,
        caseStatus: data.caseStatus,
        location: data.location,
        institution: arr,
        caseType: data.caseType,
        enterType: data.enterType,
        stolen: data.stolen,
        persons: data.persons,
        time: moment(data.time, 'YYYY-MM-DD HH:mm:ss'),
        detail: data.detail
      });
    } else {
      setFieldsValue({
        caseid: "",
        caseStatus: "",
        location: "",
        institution: ['黑龙江省公安厅', '哈尔滨市公安局', '南岗分局'],
        caseType: "",
        enterType: "",
        stolen: "",
        persons: "",
        time: null,
        detail: ''
      });
    }
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  submitEdit = () => {
    const {
      dispatch,
      form: { validateFields },
      data,
    } = this.props;

    validateFields((err, values) => {
      if (!err) {
        const { caseid, caseStatus, location, time, institution, detail, caseType, enterType, stolen, persons } = values;
        dispatch({
          type: 'caseManagement/editCaseInfo',
          payload: {
            caseid, 
            caseStatus, 
            location, 
            detail, 
            caseType, 
            enterType, 
            stolen, 
            persons,
            institution: institution.join(' / '),
            time: getFormatTime(time)
          },
        });
        // 重置 `visible` 属性为 false 以关闭对话框
        this.setState({ visible: false });
      }
    });
  };

  submitNew = () => {
    const {
      dispatch,
      form: { validateFields },
      data,
    } = this.props;

    validateFields((err, values) => {
      if (!err) {
        var newValue = {
          ...values,
          institution: values.institution.join(' / '),
          time: getFormatTime(values.time)
        };
        dispatch({
          type: 'caseManagement/addCase',
          payload: newValue,
        });
        // 重置 `visible` 属性为 false 以关闭对话框
        this.setState({ visible: false });
      }
    });
  };

  render() {
    const { visible } = this.state;
    const {
      text,
      form: { getFieldDecorator },
    } = this.props;

    let modalConfig;
    if (text === '查看并编辑') {
      modalConfig = {
        title: '修改案件信息',
        onOk: this.submitEdit,
        Input: <Input readOnly />,
        label: '案件编号',
      };
    } else {
      modalConfig = {
        title: '新建案件',
        onOk: this.submitNew,
        Input: <Input maxLength="14"/>,
        label: '案件编号',
      };
    }
    const config = {
      rules: [{ type: 'object', required: true, message: '请选择时间!' }],
    };

    return (
      <span>
        <Button
          type="primary"
          onClick={() => {
            this.showModal();
            this.handleClick();
          }}
        >
          {text}
        </Button>
        <Modal
          title={modalConfig.title}
          visible={visible}
          onOk={modalConfig.onOk}
          onCancel={this.hideModal}
          okText="提交"
          cancelText="返回" 
        >
          <Form className={styles.userForm}>
            <FormItem label={modalConfig.label}>
              {getFieldDecorator('caseid', {
                rules: [{ required: true }],
              })(modalConfig.Input)}
            </FormItem>

            <FormItem label="案件状态">
                {getFieldDecorator('caseStatus', {
                  initialValue: '未破案',
                  rules: [{ required: true }],
                })(
                  <Select>
                    <Option value="已破案">已破案</Option>
                    <Option value="未破案">未破案</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="案发时间">
                {getFieldDecorator('time', config)(
                  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                )}
              </FormItem>
              <FormItem label="案发地点">
                {getFieldDecorator('location', {
                  rules: [{ required: true }],
                })(<Input />)}
              </FormItem>
              <FormItem label="所属单位">
                {getFieldDecorator('institution', {
                  initialValue: ['黑龙江省公安厅', '哈尔滨市公安局', '南岗分局'],
                  rules: [{ type: 'array', required: true }],
                })(<Cascader options={options} changeOnSelect placeholder="请选择所属单位" />)}
              </FormItem>

              <FormItem label="简要案情">
                {getFieldDecorator('detail', {
                  rules: [{ required: true }],
                })(<textarea rows={3} cols={60} className={styles.textareaStyle} />)}
              </FormItem>
              <FormItem label="案件类别">
                {getFieldDecorator('caseType', {
                  initialValue: '入室盗窃案',
                  rules: [{ required: true }],
                })(
                  <Select>
                    <Option value="入室盗窃案">入室盗窃案</Option>
                    <Option value="扒窃案">扒窃案</Option>
                    <Option value="故意杀人案">故意杀人案</Option>
                    <Option value="抢劫案">抢劫案</Option>
                    <Option value="强奸案">强奸案</Option>
                    <Option value="其他盗窃案">其他盗窃案</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="侵入方式">
                {getFieldDecorator('enterType', {
                  initialValue: '技术开锁',
                  rules: [{ required: true }],
                })(
                  <Select>
                    <Option value="技术开锁">技术开锁</Option>
                    <Option value="撬门入室">撬门入室</Option>
                    <Option value="和平入室">和平入室</Option>
                    <Option value="撬窗入室">撬窗入室</Option>
                    <Option value="翻窗入室">翻窗入室</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="被盗物品">
                {getFieldDecorator('stolen', {
                  rules: [{ required: true }],
                })(<Input />)}
              </FormItem>
              <FormItem label="作案人数">
                {getFieldDecorator('persons', {
                  rules: [{ required: true }],
                })(<Input />)}
              </FormItem>
            

          </Form>
        </Modal>
      </span>
    );
  }
}

export default connect()(Form.create()(LocalizedCaseModal));
